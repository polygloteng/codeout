<template>
  <div class="mx-auto mt-10" style="width: 200px">
    <v-btn @click="signInEx">GitHubログイン</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useRouter, onBeforeMount } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'
import RequireAuth from '~/middleware/requireAuth'
import { authStore } from '~/store'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const { redirect } = useContext() // this must be called within setup function
    const router = useRouter() // this must be called within setup function
    const { signIn, onUserSingedIn } = useAuth()
    onBeforeMount(() => onUserSingedIn(() => redirect('/')))
    const signInEx = async () => {
      try {
        await signIn()
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
