<template>
  <v-container fluid>

    <div class="codeout-head-area py-sm-10 px-sm-16 pt-10 pb-10 px-3">
      <h2 class="mb-6">会員登録</h2>
      <p>GitHubアカウントを使用してご登録ください。</p>
      <p>GitHubアカウントをお持ちでない方は先に<router-link to="/">こちら</router-link>からGitHubアカウントをご作成ください。</p>
    </div>

    <!--リンク設定していただければと思います。（12/30佐藤）-->
    <v-row justify="center" class="codeout-content-area pt-16 pb-16">
      <v-card max-width="490" class="ma-6 pa-10">
        <h3 class="codeout-text-leftline">GitHubアカウントを使用して会員登録</h3>
        <v-btn @click="signUp" class="codeout-btn-size-large codeout-btn-grad mt-10 mb-10 v-btn v-btn--is-elevated v-btn--has-bg theme--light white--text"><i class="codeout-icon"><v-img :src="`${$config.assetsDomain}/images/icon_github.svg`"></v-img></i>GitHubアカウントで登録する</v-btn>
        <p class="grey--text">※会員登録すると<router-link to="/">利用規約</router-link>および<router-link to="/">プライバシーポリシー</router-link>に同意したとみなされます。</p>
      </v-card>
      <v-card max-width="490" class="ma-6 pa-10">
        <h3 class="codeout-text-leftline">既に会員登録済みの方</h3>
        <p class="mt-10 mb-10">既に会員登録済みの方は<router-link to="/">こちら</router-link>からサインインしてください。</p>
      </v-card>
    </v-row>

  </v-container>
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
