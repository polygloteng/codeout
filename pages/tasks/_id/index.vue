<template>
  <div>

    <v-container fluid v-if="task" class="codeout-task-area py-sm-10 px-sm-16 py-10 px-6">
      <v-row class="mx-md-16 mx-0">
        <v-col class="pr-md-6 px-0" cols="12" md="6" sm="12" xs="12">
          <client-only>
            <!--DB側に画像もしくはファイル名情報を持たせた方が良いかもしれません。（12/30佐藤）-->
            <v-img class="mb-6" height="240" :src="`${$config.assetsDomain}/images/top_study_thumb01.png`"></v-img>
            <v-img class="mb-6" height="240" :src="`${$config.assetsDomain}/images/top_study_thumb02.png`"></v-img>
          </client-only>
        </v-col>
        <v-col class="pl-md-6 px-0" cols="12" md="6" sm="12" xs="12">
          <h2 class="mb-6">{{ task.name }}</h2>
          <p class="mb-0">評価：</p>
          <v-rating
            :value="task.avg_rating"
            color="#275DC2"
            background-color="grey lighten-2"
            dense
            half-increments
            readonly
            size="24"
            class="d-inline-block"
          ></v-rating>
          <client-only>
            <div class="mt-6" v-if="purchase">
              <div class="text-h5 text-left font-weight-bold mt-10">リポジトリ</div>
              <div class="text-body1 text-left">
                <a :href="purchase.repo_url" target="_blank">{{ purchase.repo_url }}</a>
              </div>
            </div>
          </client-only>
          <p class="mt-6 text-body1 text-left">{{ task.description }}</p>
          <client-only>
            <div class="mt-6 mb-6">
              <!--デザイン指定がないため暫定的にスタイルをつけておきました。（1/10佐藤）-->
              <div v-if="!currentUser">
                <div class="d-flex justify-md-start justify-center">
                  <router-link to="/signup">会員登録して購入</router-link>
                </div>
              </div>
              <div v-else-if="purchase">
                <div class="d-flex justify-md-start justify-center">
                  <p class="codeout-mission-bg rounded-pill caption py-1">購入済み</p>
                </div>
              </div>
              <div v-else-if="isPurchasing">
                <div class="d-flex justify-md-start justify-center">
                  <p class="codeout-mission-bg rounded-pill caption py-1">購入処理実行中</p>
                </div>
              </div>
              <div v-else>
                <div class="d-flex justify-md-start justify-center">
                  <v-btn @click="doPurchase" class="codeout-btn-size-default codeout-btn-a mt-10 mb-10 v-btn v-btn--is-elevated v-btn--has-bg">タスクを購入</v-btn>
                </div>
              </div>
            </div>
            <div class="d-flex justify-md-start justify-center">
              <div v-if="currentUser"><router-link :to="'/tasks/' + task.id + '/review'">レビューを書く</router-link></div>
            </div>
          </client-only>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="codeout-content-area py-sm-16 px-sm-16 py-16 px-6">
      <v-row class="mt-3 mb-6">
        <h3 class="px-2">レビュー一覧</h3>
      </v-row>
      <v-row>
        <v-col class="codeout-card-align-stretch" v-for="review in reviews" :key="review.id" cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
          <v-card class="rounded-lg" min-height="170" hover :to="'/profiles/' + review.profile.ref.id">
            <v-row>
              <v-col cols="4">
                <v-row class="justify-center mt-2 pl-8">
                  <v-img class="rounded-circle" width="100%" max-width="100" :src="review.profile.thumbnail_url"></v-img>
                </v-row>
              </v-col>
              <v-col cols="8">
                <v-card-title class="pt-0">{{ review.profile.nickname }}</v-card-title>
                <v-card-text>
                  <v-row class="mx-0">
                    <v-rating :value="review.rating" color="#275DC2" background-color="grey lighten-2" dense half-increments readonly size="14"></v-rating>
                    <p class="grey--text ml-3">{{ review.rating }}</p>
                  </v-row>
                  <v-row class="mx-0">
                    <p class="grey--text">{{ review.comment }}</p>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
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
