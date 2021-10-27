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
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid v-else>
      <div>task doesn't exist</div>
    </v-container>
    <div class="mx-auto mt-10" style="width: 200px">
      <v-btn @click="purchaseTask">購入</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions'
import { defineComponent, reactive, useContext, useAsync } from '@nuxtjs/composition-api'
import { Task } from '~/types/db'
import { taskConverter } from '~/lib/converters'
import { authStore } from '~/store'

interface Data {
  task?: Task
}

interface PurchaseTaskRequest {
  task_id: string
}

interface PurchaseTaskResponse {
  message: string
}

export default defineComponent({
  setup() {
    const context = useContext()
    const data = reactive<Data>({
      task: undefined,
    })
    useAsync(async () => {
      const docSnapshot = await getDoc(doc(context.$db, 'tasks', context.params.value.id).withConverter(taskConverter))
      // docSnapshot.get()
      if (docSnapshot.exists()) {
        console.log(docSnapshot.data())
        data.task = docSnapshot.data()
      } else {
        console.log('No such document!')
      }
    })
    const purchaseTask = async () => {
      const gitHubUserName = authStore.getGitHubUserName
      if (!gitHubUserName) throw new Error('GitHub username had to be retrieved')
      const functions = getFunctions(undefined, 'asia-northeast1')
      const purchaseTask = httpsCallable<PurchaseTaskRequest, PurchaseTaskResponse>(functions, 'purchaseTask')
      const result = await purchaseTask({ task_id: context.params.value.id })
      console.log(result.data.message)
    }
    return { data, purchaseTask }
  },
})
</script>

<style></style>
