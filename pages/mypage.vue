<template>
  <div>

    <v-container fluid v-if="user && profile" class="codeout-content-area py-sm-16 px-sm-16 py-16 px-6">
      <div class="codeout-mypage-wrapper">
        <v-row class="justify-center flex-row-reverse px-sm-3 pa-0">
          <v-col cols="12" md="9" sm="12" xs="12">
            <v-card class="rounded-lg pa-sm-6 pa-md-10 pa-6">
              <h2>マイページ</h2>
              <h3 class="mt-9 mb-3">購入済みタスク</h3>
              <v-divider class="mt-3 mb-9"></v-divider>
              <!--サムネ画像の表示確認用に、ファイル名末尾の連番をループカウントで暫定的に付与しています。（1/10佐藤）-->
              <div class="codeout-buyed-tasks" v-for="(purchase, index) in purchases" :key="purchase.task.ref.id">
                <v-row class="codeout-buyed-item my-3">
                  <v-col cols="12" md="4" sm="12" xs="12">
                    <client-only>
                      <!--v-rowのボックス要素全体にaタグをつけるとリポジトリURLがクリックできないのでサムネ画像にだけaタグをつけています。（1/10佐藤）-->
                      <a :href="'/tasks/' + purchase.task.ref.id">
                        <!--DB側に画像もしくはファイル名情報を持たせた方が良いかもしれません。（1/10佐藤）-->
                        <v-img :src="`${$config.assetsDomain}/images/top_study_thumb0${index + 1}.png`"></v-img>
                      </a>
                    </client-only>
                  </v-col>
                  <v-col cols="12" md="8" sm="12" xs="12">
                    <h3 class="mb-2">{{ purchase.task.name }}</h3>
                    <p class="codeout-mission-bg rounded-pill caption py-1" v-if="purchase.task_completed">完了</p>
                    <p class="codeout-mission-bg rounded-pill caption py-1" v-else>未完了</p>
                    <div class="mt-2">
                      <a class="caption" :href="purchase.repo_url" target="_blank">{{ purchase.repo_url }}</a>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="3" sm="12" xs="12">
            <v-card class="rounded-lg pa-sm-6 pa-md-6 pa-6">
              <client-only>
                <v-row class="justify-center mt-2 mb-2">
                  <v-img class="rounded-circle" width="100%" max-width="100" :src="profile.thumbnail_url"></v-img>
                </v-row>
                <h3 class="mt-4 mb-4 text-center">{{ profile.nickname }}</h3>
                <p class="grey--text caption">
                  紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。紹介文が入ります。
                </p>
                <v-divider class="mt-6 mb-6"></v-divider>
                <div class="d-flex justify-center flex-md-column">
                  <div class="pb-0 pr-md-0 pr-5 text-md-left text-center">
                    <span class="grey--text caption">残ポイント</span>
                    <p class="mb-0">{{ user.point }}</p>
                  </div>
                  <div class="pb-0 pl-md-0 pl-5 text-md-left text-center">
                    <span class="grey--text caption">スコア</span>
                    <p class="mb-0">{{ profile.score }}</p>
                  </div>
                </div>
                <!--リンク設定していただければと思います。（12/31佐藤）-->
                <v-row class="justify-center">
                  <v-btn
                    :to="'/profiles/' + profile.id + '/edit'"
                    class="codeout-btn-size-small codeout-btn-c mt-6 mb-6 v-btn v-btn--is-elevated v-btn--has-bg caption"
                    >プロフィールを編集する</v-btn
                  >
                </v-row>
              </client-only>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>

  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'
import { useUser } from '~/composables/user'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext()
    const { currentUser, onUserSignedInStateSettled } = useAuth()
    console.log(currentUser.value)
    onUserSignedInStateSettled({ notSignedInCallback: () => context.redirect('/') })
    const { user, profile, purchases } = useUser(context, currentUser.value)
    return { user, profile, purchases }
  },
})
</script>

<style></style>
