<template>
  <div class="mx-auto mt-10" style="width: 200px">
    <v-btn @click="signIn">GitHubログイン</v-btn>
  </div>
</template>

<script lang="ts">
import { getAuth, signInWithPopup, GithubAuthProvider } from 'firebase/auth'
import { defineComponent, useContext, useRouter, onBeforeMount } from '@nuxtjs/composition-api'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext() // this must be called within setup function
    const router = useRouter() // this must be called within setup function
    const auth = getAuth()
    onBeforeMount(() => {
      // required in case of direct access while the user is signed in
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          context.redirect('/')
        }
        // after the page is displayed, page transition will be monitored by the middleware, so unsubscribe it
        unsubscribe()
      })
    })
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
