<template>
  <v-app>
    <v-app-bar color="white" app clipped-right>
      <router-link to="/">
        <v-img :src="`${$config.assetsDomain}/images/logo.png`" contain max-width="90"></v-img>
      </router-link>
      <v-spacer></v-spacer>
      <v-text-field
        placeholder="タスクを検索"
        outlined
        single-line
        hide-details
        dense
        filled
        rounded
        append-icon="mdi-magnify"
        class="d-none d-md-block shrink"
        v-model="data.keywords"
        @keydown.enter="doSearch"
      ></v-text-field>
      <client-only>
        <v-toolbar-items v-if="currentUser" class="d-none d-md-block">
          <v-btn text to="/mypage">マイページ</v-btn>
          <v-btn text @click="signOutEx">サインアウト</v-btn>
        </v-toolbar-items>
        <v-toolbar-items v-else class="d-none d-md-block">
          <v-btn text to="/signin">サインイン</v-btn>
          <v-btn text to="/signup">会員登録</v-btn>
        </v-toolbar-items>
        <v-app-bar-nav-icon class="d-block d-md-none" @click.stop="data.drawer = !data.drawer"></v-app-bar-nav-icon>
      </client-only>
    </v-app-bar>
    <!-- absoluteを指定することでドロワーが表示されていない場合でも領域が確保されてしまうことを防止する -->
    <!-- absoluteが指定されるとv-app-barで上部が一部隠れてしまうが、temporaryを指定して最前部に表示することでこれを防止している -->

    <v-navigation-drawer v-model="data.drawer" absolute right clipped temporary class="d-block d-md-none">
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
    <v-footer color="primary" app>CODEOUT</v-footer>
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
