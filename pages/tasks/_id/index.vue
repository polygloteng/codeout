<template>
  <div>
    <v-container v-if="data.task">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <div>
            <div class="text-h4 text-center font-weight-bold">
              {{ data.task.name }}
            </div>
            <v-img
              style="border: 2px solid #cccccc"
              class="mx-auto mt-10"
              max-width="100%"
              :src="require('~/assets/study.png')"
            ></v-img>
          </div>
          <div>
            <span>評価：</span>
            <v-rating
              :value="data.task.avg_rating"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
              class="d-inline-block"
            ></v-rating>
          </div>

          <div class="text-h5 text-left font-weight-bold mt-10">タスクの概要</div>
          <div class="text-body1 text-left">{{ data.task.description }}</div>

          <div v-if="data.purchase">
            <div class="text-h5 text-left font-weight-bold mt-10">リポジトリ</div>
            <div class="text-body1 text-left">
              <a :href="data.purchase.repo_url">{{ data.purchase.repo_url }}</a>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="mx-auto mt-10" style="width: 200px">
        <div v-if="!signedIn"><router-link to="/signup">会員登録して購入</router-link></div>
        <div v-else-if="data.purchase">購入済み</div>
        <div v-else-if="purchasing">購入処理実行中</div>
        <div v-else>
          <v-btn @click="purchase">購入</v-btn>
        </div>
      </div>
    </v-container>
    <v-container fluid v-else>
      <div>task doesn't exist</div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { defineComponent, reactive, useContext, useAsync, onMounted, computed, watch } from '@nuxtjs/composition-api'
import { Task, Purchase } from '~/types/db'
import { taskConverter, purchaseConverter } from '~/lib/converters'
import { authStore, purchaseStore } from '~/store'

interface Data {
  task?: Task
  purchase?: Purchase
}

interface PurchaseRequest {
  task_id: string
}

interface PurchaseResponse {
  message: string
}

const makePurchasingKey = (user_id: string, task_id: string): string => {
  return `${user_id}/${task_id}`
}

export default defineComponent({
  setup() {
    const context = useContext()
    const data = reactive<Data>({
      task: undefined,
      purchase: undefined,
    })
    const task_id = context.params.value.id
    const signedIn = computed(() => authStore.isSignedIn)
    const purchasing = computed(() => {
      const user = authStore.getUser
      if (!user) return false
      const purchasingList = purchaseStore.getPurchasingList
      return makePurchasingKey(user.uid, task_id) in purchasingList
    })
    const refreshPurchaseStates = async () => {
      const user = authStore.getUser
      if (user) {
        const purchaseSnapshot = await getDoc(
          doc(context.$db, `users/${user.uid}/purchases`, task_id).withConverter(purchaseConverter)
        )
        const purchasingKey = makePurchasingKey(user.uid, task_id)
        if (purchaseSnapshot.exists()) {
          purchaseStore.deletePurchasing(purchasingKey)
          data.purchase = purchaseSnapshot.data()
        } else if (purchasing) {
          // リアルタイムリスナーが呼び出されない場合への対応
          purchaseStore.deletePurchasing(purchasingKey)
        }
      }
    }
    useAsync(async () => {
      const taskSnapshot = await getDoc(doc(context.$db, 'tasks', task_id).withConverter(taskConverter))
      if (taskSnapshot.exists()) {
        data.task = taskSnapshot.data()
      } else {
        console.log('No such document!')
      }
    })
    onMounted(async () => {
      if (authStore.isSignedIn) refreshPurchaseStates()
    })
    watch(signedIn, (value) => {
      if (value) refreshPurchaseStates()
    })
    const purchase = async () => {
      const user = authStore.getUser
      if (!user) throw new Error('User must be logged in')
      const purchasingKey = makePurchasingKey(user.uid, task_id)
      const githubUserName = authStore.getGitHubUserName
      if (!githubUserName) throw new Error('GitHub username had to be retrieved')
      purchaseStore.addPurchasing(purchasingKey)
      const functions = getFunctions(undefined, 'asia-northeast1')
      const purchase = httpsCallable<PurchaseRequest, PurchaseResponse>(functions, 'purchase')
      const result = await purchase({ task_id: task_id })
      // リアルタイムリスナーでpurchaseドキュメントの作成を待機
      const purchaseRef = doc(context.$db, `users/${user.uid}/purchases`, task_id).withConverter(purchaseConverter)
      const unsubscribe = onSnapshot(
        purchaseRef,
        (purchaseSnapshot) => {
          if (purchaseSnapshot.exists()) {
            console.log('purchase document created')
            purchaseStore.deletePurchasing(purchasingKey)
            data.purchase = purchaseSnapshot.data()
            unsubscribe()
          }
        },
        (error) => {
          console.error(error)
          purchaseStore.deletePurchasing(purchasingKey)
          unsubscribe()
        }
      )
      console.log(result.data.message)
    }
    return { data, signedIn, purchasing, purchase }
  },
})
</script>

<style></style>
