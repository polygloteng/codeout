<template>
  <div>

    <v-container fluid v-if="profile" class="codeout-head-area py-sm-10 px-sm-16 py-10 px-6">
      <h2 class="">プロフィール編集</h2>
    </v-container>

    <v-container fluid v-if="profile" class="codeout-content-area py-sm-16 px-sm-16 py-16 px-6">
      <v-row class="justify-center py-md-3 pa-6">
        <v-card width="100%" max-width="930" class="pa-md-10 pa-3">
          <v-row>
            <v-col cols="12" md="3" sm="12" xs="12">
              <client-only>
                <v-row class="justify-center mt-2 mb-2">
                  <v-img class="rounded-circle" width="100%" max-width="100" :src="data.thumbnail_url"></v-img>
                  <!--画像なしの場合-->
                  <!--<v-img class="rounded-circle" width="100%" max-width="100" :src="`${$config.assetsDomain}/images/icon_prof_no_img.png`"></v-img>-->
                </v-row>
              </client-only>
            </v-col>
            <v-col cols="12" md="9" sm="12" xs="12">
              <v-text-field outlined rounded-lg counter placeholder="ニックネームを入力してください" v-model="data.nickname"></v-text-field>
              <v-textarea outlined rounded-lg counter placeholder="紹介文を入力してください" label=""></v-textarea>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
      <v-row class="justify-center">
        <v-btn @click="doEdit(currentUser, data.nickname, data.thumbnail_url)" class="codeout-btn-size-default codeout-btn-a mt-10 mb-10 v-btn v-btn--is-elevated v-btn--has-bg">登録する</v-btn>
      </v-row>
    </v-container>

    <v-container fluid v-if="profile" class="codeout-content-area py-sm-16 px-sm-16 py-16 px-6">
      <v-row class="justify-center py-md-3 pa-6">
        <v-card width="100%" max-width="930" class="pa-md-10 pa-3">
          <v-row>
            <v-col> ニックネーム：<v-text-field v-model="data.nickname"></v-text-field> </v-col>
          </v-row>
          <v-row>
            <v-col> サムネイル：<v-text-field v-model="data.thumbnail_url"></v-text-field> </v-col>
          </v-row>
          <v-row>
            <v-btn @click="doEdit(currentUser, data.nickname, data.thumbnail_url)">登録する</v-btn>
          </v-row>
        </v-card>
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
