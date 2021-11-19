<template>
  <div>
    <v-container v-if="profile">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <div>
            <div class="text-h4 text-center font-weight-bold">
              {{ profile.nickname }}
            </div>
            <v-img
              style="border: 2px solid #cccccc"
              class="mx-auto mt-10"
              max-width="20%"
              :src="profile.thumbnail_url"
            ></v-img>
            <div class="text-h4 text-center font-weight-bold">スコア：{{ profile.score }}</div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useProfile } from '~/composables/user'

export default defineComponent({
  setup() {
    const context = useContext()
    const uid = context.params.value.id
    const { profile } = useProfile(context, uid)
    return { profile }
  },
})
</script>

<style></style>
