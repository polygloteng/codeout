<template>
  <div>
    <v-container v-if="task">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <div>
            <div class="text-h4 text-center font-weight-bold">
              {{ task.name }}
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
              :value="task.avg_rating"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
              class="d-inline-block"
            ></v-rating>
          </div>

          <div class="text-h5 text-left font-weight-bold mt-10">タスクの概要</div>
          <div class="text-body1 text-left">{{ task.description }}</div>

          <div v-if="purchase">
            <div class="text-h5 text-left font-weight-bold mt-10">リポジトリ</div>
            <div class="text-body1 text-left">
              <a :href="purchase.repo_url">{{ purchase.repo_url }}</a>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="mx-auto mt-10" style="width: 200px">
        <div v-if="!signedIn"><router-link to="/signup">会員登録して購入</router-link></div>
        <div v-else-if="purchase">購入済み</div>
        <div v-else-if="isPurchasing">購入処理実行中</div>
        <div v-else>
          <v-btn @click="doPurchase">購入</v-btn>
        </div>
      </div>
    </v-container>
    <v-container fluid v-else>
      <div>task doesn't exist</div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'
import { useTask } from '~/composables/task'
import { usePurchase } from '~/composables/purchase'

export default defineComponent({
  setup() {
    const context = useContext()
    const { signedIn } = useAuth()
    const task_id = context.params.value.id
    const { task } = useTask(context, task_id)
    const { purchase, isPurchasing, doPurchase } = usePurchase(context, task_id)
    return { task, purchase, signedIn, isPurchasing, doPurchase }
  },
})
</script>

<style></style>
