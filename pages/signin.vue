<template>
  <div>

    <v-container fluid class="codeout-head-area py-sm-10 px-sm-16 pt-10 pb-10 px-6">
      <h2 class="mb-6">ログイン</h2>
      <p>GitHubアカウントを使用してサインインしてください。</p>
    </v-container>
    <!--リンク設定していただければと思います。（12/30佐藤）-->
    <v-container fluid class="codeout-content-area py-sm-16 px-sm-16 pt-10 pb-10 px-6">
      <v-row class="justify-center">
        <v-card width="100%" max-width="490" class="ma-6 pa-10">
          <h3 class="codeout-text-leftline">会員済みのお客様</h3>
          <v-btn @click="signInEx" class="codeout-btn-size-large codeout-btn-a mt-10 mb-10 v-btn v-btn--is-elevated v-btn--has-bg"><i class="codeout-icon"><v-img :src="`${$config.assetsDomain}/images/icon_github.svg`"></v-img></i>GitHubアカウントでサインイン</v-btn>
          <p class="grey--text">※会員登録がまだのお客様は<router-link to="/">こちら</router-link>から会員登録をお願いします。</p>
        </v-card>
      </v-row>
    </v-container>

  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useRouter } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext() // this must be called within setup function
    const router = useRouter() // this must be called within setup function
    const { signIn, onUserSignedInStateSettled } = useAuth()
    onUserSignedInStateSettled({ signedInCallback: () => context.redirect('/') })
    const signInEx = async () => {
      try {
        await signIn(context)
        router.push('/')
      } catch (error) {
        console.error('sign in failed,', error)
      }
    }
    return { signInEx }
  },
})
</script>

<style></style>
