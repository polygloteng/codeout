<template>
  <div>
    <v-container v-if="task">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <div>
            <div class="text-h4 text-center font-weight-bold">
              {{ task.name }}
            </div>
            <client-only>
              <v-img
                style="border: 2px solid #cccccc"
                class="mx-auto mt-10"
                max-width="100%"
                :src="`${$config.assetsDomain}/images/study.png`"
              ></v-img>
            </client-only>
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

          <client-only>
            <div v-if="purchase">
              <div class="text-h5 text-left font-weight-bold mt-10">リポジトリ</div>
              <div class="text-body1 text-left">
                <a :href="purchase.repo_url" target="_blank">{{ purchase.repo_url }}</a>
              </div>
            </div>
          </client-only>
        </v-col>
      </v-row>
      <client-only>
        <div class="mx-auto mt-10" style="width: 200px">
          <div v-if="!currentUser"><router-link to="/signup">会員登録して購入</router-link></div>
          <div v-else-if="purchase">購入済み</div>
          <div v-else-if="isPurchasing">購入処理実行中</div>
          <div v-else>
            <v-btn @click="doPurchase">購入</v-btn>
          </div>
          <div v-if="currentUser"><router-link :to="'/tasks/' + task.id + '/review'">レビューを書く</router-link></div>
        </div>
      </client-only>
      <div class="text-h5 text-left font-weight-bold mt-10">レビュー一覧</div>
      <v-row justify="center">
        <v-col cols="12" xl="8">
          <v-row>
            <v-col v-for="review in reviews" :key="review.id" cols="12" sm="6" md="4">
              <v-card class="pa-2" outlined tile hover :to="'/profiles/' + review.profile.ref.id">
                <v-card-title>{{ review.profile.nickname }}</v-card-title>
                <v-img width="100" :src="review.profile.thumbnail_url"></v-img>
                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating :value="review.rating" color="amber" dense half-increments readonly size="14"></v-rating>
                    <div class="grey--text ms-4">{{ review.rating }}</div>
                  </v-row>
                  <v-row align="center" class="mx-0"
                    ><div class="grey--text ms-4">{{ review.comment }}</div>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
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
    const task_id = context.params.value.id
    const { task, reviews } = useTask(context, task_id)
    const { currentUser } = useAuth()
    const { purchase, isPurchasing, doPurchase } = usePurchase(context, currentUser.value, task_id)
    return { task, reviews, purchase, currentUser, isPurchasing, doPurchase }
  },
})
</script>

<style></style>
