<template>
  <div class="mx-auto mt-10" style="width: 200px">
    <v-btn @click="signIn">GitHubログイン</v-btn>
  </div>
</template>

<script lang="ts">
import { getAuth, signInWithPopup, GithubAuthProvider, getAdditionalUserInfo } from 'firebase/auth'
import { defineComponent, useContext, useRouter, onBeforeMount } from '@nuxtjs/composition-api'
import { onUserSingedIn, retrieveGitHubUserInfo } from '~/lib/auth'
import RequireAuth from '~/middleware/requireAuth'
import { authStore } from '~/store'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext() // this must be called within setup function
    const router = useRouter() // this must be called within setup function
    const auth = getAuth()
    onBeforeMount(() => onUserSingedIn(auth, () => context.redirect('/')))
    const signIn = async () => {
      try {
        const result = await signInWithPopup(getAuth(), new GithubAuthProvider())
        const githubUserInfo = retrieveGitHubUserInfo(result.user, getAdditionalUserInfo(result))
        authStore.setGitHubUserName(githubUserInfo.username)
        router.push('/')
      } catch (error) {
        console.error('sign in failed,', error)
      }
    }
    return { signIn }
  },
})
</script>

<style></style>
