<template>
  <div>

    <v-container fluid class="codeout-head-area py-sm-10 px-sm-16 py-10 px-6">
      <h2 class="mb-6">会員登録</h2>
      <p>GitHubアカウントを使用してご登録ください。</p>
      <p>GitHubアカウントをお持ちでない方は先に<router-link to="/">こちら</router-link>からGitHubアカウントをご作成ください。</p>
    </v-container>
    <!--リンク設定していただければと思います。（12/30佐藤）-->
    <v-container fluid class="codeout-content-area py-sm-16 px-sm-16 py-16 px-6">
      <v-row class="justify-center pa-3">
        <v-card width="100%" max-width="490" class="rounded-lg pa-md-10 pa-6 mx-md-6 my-6 mx-0">
          <h3 class="codeout-text-leftline">GitHubアカウントを使用して会員登録</h3>
          <v-btn @click="signUp" class="codeout-btn-size-large codeout-btn-a mt-10 mb-10 v-btn v-btn--is-elevated v-btn--has-bg text-sm-button text-overline"><i class="codeout-icon"><v-img :src="`${$config.assetsDomain}/images/icon_github.svg`"></v-img></i>GitHubアカウントで登録する</v-btn>
          <p class="grey--text">※会員登録すると<router-link to="/">利用規約</router-link>および<router-link to="/">プライバシーポリシー</router-link>に同意したとみなされます。</p>
        </v-card>
        <v-card width="100%" max-width="490" class="rounded-lg pa-md-10 pa-6 mx-md-6 my-6 mx-0">
          <h3 class="codeout-text-leftline">既に会員登録済みの方</h3>
          <p class="mt-10 mb-10">既に会員登録済みの方は<router-link to="/">こちら</router-link>からサインインしてください。</p>
        </v-card>
      </v-row>
    </v-container>

  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useRouter } from '@nuxtjs/composition-api'
import { useAuth, createUserIfNotExist } from '~/composables/auth'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext() // this must be called within setup function
    const router = useRouter() // this must be called within setup function
    const { signIn, signOut, onUserSignedInStateSettled } = useAuth()
    onUserSignedInStateSettled({ signedInCallback: () => context.redirect('/') })
    const signUp = async () => {
      try {
        const userInfo = await signIn(context)
        await createUserIfNotExist(context, userInfo)
        router.push('/')
      } catch (error) {
        console.error('sign up failed,', error)
        signOut()
      }
    }
    return { signUp }
  },
})
</script>

<style></style>
