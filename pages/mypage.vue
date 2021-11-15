<template>
  <v-container v-if="user && publicProfile">
    <v-img :src="publicProfile.thumbnail_url" max-width="90"></v-img>
    <div>ニックネーム：{{ publicProfile.nickname }}</div>
    <div>ポイント：{{ user.point }}</div>
    <div>スコア：{{ publicProfile.score }}</div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useContext, ref, watch } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'
import { useUser } from '~/composables/user'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext()
    const { currentUser, onUserSignedInStateSettled } = useAuth()
    onUserSignedInStateSettled({ notSignedInCallback: () => context.redirect('/') })
    const { user, publicProfile } = useUser(context, currentUser.value)
    return { user, publicProfile }
  },
})
</script>

<style></style>
