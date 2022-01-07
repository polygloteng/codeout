<template>
  <div v-if="profile">
    <v-container>
      <v-row>
        <v-col> ニックネーム：<v-text-field v-model="data.nickname"></v-text-field> </v-col>
      </v-row>
      <v-row>
        <v-col> サムネイル：<v-text-field v-model="data.thumbnail_url"></v-text-field> </v-col>
      </v-row>
      <v-row>
        <v-btn @click="doEdit(currentUser, data.nickname, data.thumbnail_url)">更新する</v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'
import { useProfile } from '~/composables/user'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext()
    const { currentUser, onUserSignedInStateSettled } = useAuth()
    onUserSignedInStateSettled({ notSignedInCallback: () => context.redirect('/') })
    const uid = context.params.value.id
    const { profile, data, doEdit } = useProfile(context, uid)
    return { currentUser, profile, data, doEdit }
  },
})
</script>

<style></style>
