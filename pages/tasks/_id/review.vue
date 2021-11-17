<template>
  <div>
    <v-container v-if="task && currentUser">
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
            <v-rating class="text-center" length="5" size="64" v-model="data.rating"></v-rating>
            <v-textarea counter label="レビュー" :rules="reviewRules" v-model="data.comment"></v-textarea>
            <v-btn @click="doPost(data.rating, data.comment)">投稿</v-btn>
          </div>
        </v-col>
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
