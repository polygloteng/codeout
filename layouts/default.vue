<template>
  <v-app>
    <v-app-bar color="white" app clipped-right>
      <router-link to="/">
        <v-img :src="`${$config.assetsDomain}/images/logo.png`" contain max-width="130"></v-img>
      </router-link>
      <v-spacer></v-spacer>
      <client-only>
        <v-toolbar-items v-if="currentUser" class="d-none d-md-block">
          <v-btn text to="/mypage"><i class="codeout-icon"><v-img :src="`${$config.assetsDomain}/images/icon_tri.svg`"></v-img></i>マイページ</v-btn>
          <v-btn text @click="signOutEx"><i class="codeout-icon"><v-img :src="`${$config.assetsDomain}/images/icon_tri.svg`"></v-img></i>サインアウト</v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-else class="d-none d-md-block">
          <v-btn text to="/signin"><i class="codeout-icon"><v-img :src="`${$config.assetsDomain}/images/icon_tri.svg`"></v-img></i>サインイン</v-btn>
          <v-btn text to="/signup"><i class="codeout-icon"><v-img :src="`${$config.assetsDomain}/images/icon_tri.svg`"></v-img></i>会員登録</v-btn>
        </v-toolbar-items>
        <v-app-bar-nav-icon class="d-block d-md-none" @click.stop="data.drawer = !data.drawer"></v-app-bar-nav-icon>
      </client-only>
      <v-text-field
        placeholder="タスクを検索"
        single-line
        hide-details
        dense
        filled
        rounded
        append-icon="mdi-magnify"
        class="d-none d-md-block shrink ml-6"
        v-model="data.keywords"
        @keydown.enter="doSearch"
      ></v-text-field>
    </v-app-bar>
    <!-- absoluteを指定することでドロワーが表示されていない場合でも領域が確保されてしまうことを防止する -->
    <!-- absoluteが指定されるとv-app-barで上部が一部隠れてしまうが、temporaryを指定して最前部に表示することでこれを防止している -->
    <!-- absolute指定ではSPレイアウト時にドロワーが原因の表示崩れが起こるのでappに変更しました（12/30 佐藤） -->

    <v-navigation-drawer v-model="data.drawer" app right clipped temporary class="d-block d-md-none">
      <client-only>
        <v-container v-if="currentUser">
          <v-list nav dense>
            <v-list-item to="/mypage">
              <v-list-item-content>
                <v-list-item-title>マイページ</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="signOutEx">
              <v-list-item-content>
                <v-list-item-title>ログアウト</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-container>
        <v-container v-else>
          <v-list nav dense>
            <v-list-item to="/signin">
              <v-list-item-content>
                <v-list-item-title>サインイン</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/signup">
              <v-list-item-content>
                <v-list-item-title>会員登録</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-container>
      </client-only>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer fluid color="white" class="d-block">
      <v-row class="pt-10 pb-0 px-3 px-sm-16 flex-xs-column">
        <v-col cols="12" lg="8" md="7" sm="12" xs="12" class="codeout-footer-logo">
          <router-link to="/">
            <v-img :src="`${$config.assetsDomain}/images/logo.png`" contain max-width="158"></v-img>
          </router-link>
          <p class="text-caption mt-6">GitHubで実戦的に学べる<br>プログラミング学習サービス</p>
          <v-divider class="mt-10 mb-5 d-md-none d-block"></v-divider>
        </v-col>
        <v-col cols="12" lg="4" md="5" sm="12" xs="12" class="codeout-footer-link">
          <v-row>
            <!--リンク設定していただければと思います。（12/30佐藤）-->
            <v-col cols="6">
              <p class="mb-0 pl-3">サービス</p>
              <v-list dense>
                <v-list-item-group>
                  <v-list-item to="#">
                    <v-list-item-content>
                      <v-list-item-title class="grey--text">- CODEOUTについて</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item to="#">
                    <v-list-item-content>
                      <v-list-item-title class="grey--text">- プレミアム会員</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col cols="6">
              <p class="mb-0 pl-3">ご利用にあたって</p>
              <v-list dense>
                <v-list-item-group>
                  <v-list-item to="#">
                    <v-list-item-content>
                      <v-list-item-title class="grey--text">- 利用規約</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item to="#">
                    <v-list-item-content>
                      <v-list-item-title class="grey--text">- プライバシーポリシー</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item to="#">
                    <v-list-item-content>
                      <v-list-item-title class="grey--text">- 特定商取引法に基づく表記</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item to="#">
                    <v-list-item-content>
                      <v-list-item-title class="grey--text">- 運営会社</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="pt-0 pb-0 px-3 px-sm-16 pb-sm-6">
        <v-col class="codeout-footer-copyright">
          <p class="grey--text">Copyright &copy; 2019 株式会社ポリグロット</p>
        </v-col>
      </v-row>
    </v-footer>

  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'
import { useAuth } from '~/composables/auth'

interface Support {
  name: string
  icon: string
}

interface NavList {
  name: string
  icon: string
  lists?: string[]
}

interface Data {
  clipped: boolean
  drawer: boolean
  keywords: string
}

export default defineComponent({
  head() {
    return {
      link: [
        {
          hid: 'icon',
          rel: 'icon',
          type: 'image/x-icon',
          href: `${process.env.ASSETS_DOMAIN}/favicon.ico`,
        },
      ],
    }
  },
  setup() {
    const data = reactive<Data>({
      clipped: false,
      drawer: false,
      keywords: '',
    })
    const router = useRouter()
    const { currentUser, signOut } = useAuth()
    const signOutEx = () => {
      signOut()
      router.push('/')
    }
    const doSearch = () => {
      router.push({ path: 'search', query: { keywords: data.keywords } })
    }
    return { data, currentUser, signOutEx, doSearch }
  },
})
</script>

<style>
.codeout-head-area {
  
}
.codeout-content-area {
  background: #F8F8F8;
}
.codeout-text-leftline {
  border-radius: 0 !important;
  border-left: 2px solid black;
  padding-left: 10px;
}

.codeout-btn-size-default {
  width: 100%;
  max-width: 270px !important;
  min-height: 65px;
  border-radius: 32.5px;
}
.codeout-btn-size-large {
  width: 100%;
  max-width: 340px !important;
  min-height: 65px;
  border-radius: 32.5px;
}
.codeout-icon {
  margin-right: 5px;
}
.codeout-btn-size-large .codeout-icon {
  margin-right: 10px;
  padding-bottom: 2px;
}

.codeout-btn-grad {
  background: -webkit-linear-gradient(to right, #1E47B5, #50C5FF);
  background: linear-gradient(to right, #1E47B5, #50C5FF);
}
.codeout-bg-grad {
  background: -webkit-linear-gradient(to bottom #1E47B5, #50C5FF);
  background: linear-gradient(to bottom, #275DC2, #44A8EE);
}

.codeout-card-align-stretch a {
  height: 100%;
}
</style>