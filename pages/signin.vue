<template>
  <div class="mx-auto mt-10" style="width: 200px">
    <v-btn @click="signIn">GitHubログイン</v-btn>
  </div>
</template>

<script lang="ts">
import { getAuth, signInWithPopup, GithubAuthProvider } from 'firebase/auth'
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import { authStore } from '~/store'

export default defineComponent({
  setup() {
    const router = useRouter()
    const signIn = async () => {
      const provider = new GithubAuthProvider()
      const auth = getAuth()
      try {
        await signInWithPopup(auth, provider)
        router.push('/')
      } catch (error) {
        console.log(error.message)
      }
    }
    return { signIn }
  },
})
</script>

<style>
</style>
