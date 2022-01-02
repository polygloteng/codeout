<template>
  <div>

    <v-container fluid v-if="profile" class="codeout-head-area py-sm-10 px-sm-16 py-10 px-6">
      <h2 class="">プロフィール</h2>
    </v-container>

    <v-container fluid v-if="profile" class="codeout-content-area py-sm-16 px-sm-16 py-16 px-6">
      <v-row class="justify-center px-sm-6 pa-3">
        <v-card width="100%" max-width="930" class="rounded-lg pa-sm-6 pa-md-10 pa-6">
          <v-row>
            <v-col cols="12" md="2" sm="12" xs="12">
              <client-only>
                <v-row class="justify-center mt-2 mb-2">
                  <v-img class="rounded-circle" width="100%" max-width="100" :src="profile.thumbnail_url"></v-img>
                </v-row>
              </client-only>
            </v-col>

            <v-col cols="12" md="10" sm="12" xs="12">
              <div class="d-flex justify-space-between">
                <div class="">
                  <h3>{{ profile.nickname }}</h3>
                </div>
                <div class="">
                  <p class="mt-1"><span class="mr-2 grey--text caption">スコア</span>{{ profile.score }}</p>
                </div>
              </div>
              <v-divider class="mt-3 mb-9"></v-divider>
              <p class="grey--text">紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。</p>
              <h4 class="mt-9 mb-3">購入済みタスク</h4>

              <!--モックアップ（12/31佐藤）-->
              <div v-for="n of 3" :key="n" class="codeout-buyed-tasks"><!--ループ開始-->
                <v-row class="codeout-buyed-item my-3">
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <client-only>
                      <!--DB側に画像もしくはファイル名情報を持たせた方が良いかもしれません。（12/31佐藤）-->
                      <v-img class="" :src="`${$config.assetsDomain}/images/top_study_thumb01.png`"></v-img>
                    </client-only>
                  </v-col>
                  <v-col cols="12" md="8" sm="12" xs="12">
                    <h3 class="mb-2">ダミーのタスクです。ダミーのタスクです。ダミーのタスクです。ダミーのタスクです。</h3>
                    <v-rating
                      length="5" 
                      color="#275DC2"
                      background-color="grey lighten-2"
                      dense
                      half-increments
                      readonly
                      size="24"
                    ></v-rating>
                    <div class="mt-2">
                      <a class="caption" href="#">URL:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</a>
                    </div>
                  </v-col>
                </v-row>
              </div><!--ループ終了-->
            </v-col>
          </v-row>
        </v-card>
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
