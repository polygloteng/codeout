<template>
  <div class="mx-auto mt-10" style="width: 200px">
    <v-btn @click="signUp">GitHubログインして会員登録</v-btn>
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
        const userInfo = await signIn()
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
