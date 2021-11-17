<template>
  <v-container v-if="user && publicProfile">
    <v-img :src="publicProfile.thumbnail_url" max-width="90"></v-img>
    <div>ニックネーム：{{ publicProfile.nickname }}</div>
    <div>残ポイント：{{ user.point }}</div>
    <div>スコア：{{ publicProfile.score }}</div>
    <div class="text-h5 font-weight-bold mt-10">購入済みタスク</div>
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <v-row>
          <v-col v-for="purchase in purchases" :key="purchase.task.ref.id" cols="12" sm="6" md="4">
            <v-card class="pa-2" outlined tile hover :to="'/tasks/' + purchase.task.ref.id">
              <v-card-title>{{ purchase.task.name }}</v-card-title>
              <v-img height="250" :src="`${$config.assetsDomain}/images/study.png`"></v-img>
              <div v-if="purchase.task_completed">完了</div>
              <div v-else>未完了</div>
            </v-card>
            <div class="text-body1 text-left">
              <a :href="purchase.repo_url" target="_blank">{{ purchase.repo_url }}</a>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'
import { useUser } from '~/composables/user'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext()
    const { currentUser, onUserSignedInStateSettled } = useAuth()
    onUserSignedInStateSettled({ notSignedInCallback: () => context.redirect('/') })
    const { user, publicProfile, purchases } = useUser(context, currentUser.value)
    return { user, publicProfile, purchases }
  },
})
</script>

<style></style>
