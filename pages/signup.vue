<template>
  <div class="mx-auto mt-10" style="width: 200px">
    <v-btn @click="signUp">GitHubログインして会員登録</v-btn>
  </div>
</template>

<script lang="ts">
import { getAuth, signInWithPopup, GithubAuthProvider, getAdditionalUserInfo } from 'firebase/auth'
import { defineComponent, useContext, useRouter, onBeforeMount } from '@nuxtjs/composition-api'
import { onUserSingedIn, retrieveGitHubUserInfo, createUserIfNotExist } from '~/lib/auth'
import { authStore } from '~/store'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext() // this must be called within setup function
    const router = useRouter() // this must be called within setup function
    const auth = getAuth()
    onBeforeMount(() => onUserSingedIn(auth, () => context.redirect('/')))
    const signUp = async () => {
      try {
        const result = await signInWithPopup(auth, new GithubAuthProvider())
        const firebaseUser = result.user
        const githubUserInfo = retrieveGitHubUserInfo(firebaseUser, getAdditionalUserInfo(result))
        await createUserIfNotExist(context.$db, firebaseUser.uid, githubUserInfo)
        authStore.setGitHubUserName(githubUserInfo.username)
        router.push('/')
      } catch (error) {
        console.error('sign up failed,', error)
        auth.signOut()
      }
    }
    return { signUp }
  },
})
</script>

<style></style>
