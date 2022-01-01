<template>
  <div>

    <v-container fluid v-if="task && currentUser" class="codeout-head-area py-sm-10 px-sm-16 pt-10 pb-10 px-6">
      <h2 class="">レビューを書く</h2>
    </v-container>

    <v-container fluid v-if="task && currentUser" class="codeout-content-area py-sm-16 px-sm-16 pt-10 pb-10 px-6">
      <v-row class="justify-center">
        <v-card width="100%" max-width="930" class="ma-6 pa-md-10 pa-6">
          <v-row>
            <v-col cols="12" md="3" sm="12" xs="12">
              <client-only>
                <!--DB側に画像もしくはファイル名情報を持たせた方が良いかもしれません。（12/30佐藤）-->
                <v-img class="" :src="`${$config.assetsDomain}/images/top_study_thumb01.png`"></v-img>
              </client-only>
            </v-col>
            <v-col cols="12" md="9" sm="12" xs="12">
              <h3 class="mb-6">{{ task.name }}</h3>
            </v-col>
            <v-col cols="12">
              <v-divider class="mt-3 mb-9"></v-divider>
            </v-col>
            <v-col cols="12">
              <h3 class="codeout-text-leftline mb-6">満足度<span class="ml-4 grey--text caption">※星マークをクリック</span></h3>
              <v-rating
                length="5" 
                color="#275DC2"
                background-color="grey lighten-2"
                dense
                half-increments
                size="24"
                v-model="data.rating"
              ></v-rating>
            </v-col>
            <v-col cols="12">
              <h3 class="codeout-text-leftline mb-6">レビューを入力</h3>
              <v-textarea outlined rounded-lg counter label="" :rules="reviewRules" v-model="data.comment"></v-textarea>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
      <v-row class="justify-center">
        <v-btn @click="doPost(data.rating, data.comment)" class="codeout-btn-size-default codeout-btn-a mt-10 mb-10 v-btn v-btn--is-elevated v-btn--has-bg">投稿する</v-btn>
      </v-row>
    </v-container>

  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'
import { useTask } from '~/composables/task'
import { useReview } from '~/composables/review'
import RequireAuth from '~/middleware/requireAuth'

const MAX_CHARS = 100

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext()
    const task_id = context.params.value.id
    const { task } = useTask(context, task_id)
    const { currentUser, onUserSignedInStateSettled } = useAuth()
    onUserSignedInStateSettled({ notSignedInCallback: () => context.redirect('/') })
    const { data, doPost } = useReview(context, task_id, currentUser.value)
    const reviewRules = [(v: string) => v.length <= MAX_CHARS || `${MAX_CHARS}文字以内で入力してください`]
    return { task, currentUser, data, doPost, reviewRules }
  },
})
</script>

<style></style>
