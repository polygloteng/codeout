<template>
  <v-app>
    <v-app-bar color="white" app clipped-right>
      <router-link to="/">
        <v-img :src="require('~/assets/logo.png')" contain max-width="90"></v-img>
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
      ></v-text-field>
      <v-toolbar-items v-if="signedIn" class="d-none d-md-block">
        <v-btn text to="/mypage">マイページ</v-btn>
        <v-btn text @click="signOut">サインアウト</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else class="d-none d-md-block">
        <v-btn text to="/signin">サインイン</v-btn>
        <v-btn text to="/signup">会員登録</v-btn>
      </v-toolbar-items>
      <v-app-bar-nav-icon class="d-block d-md-none" @click.stop="data.drawer = !data.drawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <!-- absoluteを指定することでドロワーが表示されていない場合でも領域が確保されてしまうことを防止する -->
    <!-- absoluteが指定されるとv-app-barで上部が一部隠れてしまうが、temporaryを指定して最前部に表示することでこれを防止している -->
    <v-navigation-drawer v-model="data.drawer" absolute right clipped temporary class="d-block d-md-none">
      <v-container v-if="signedIn">
        <v-list nav dense>
          <v-list-item to="/mypage">
            <v-list-item-content>
              <v-list-item-title>マイページ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="signOut">
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
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
    <v-footer color="primary" app>CODEOUT</v-footer>
  </v-app>
</template>

<script lang="ts">
import { getAuth } from 'firebase/auth'
import { defineComponent, useContext, reactive, computed, useRouter } from '@nuxtjs/composition-api'
import { authStore } from '~/store'

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
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const data = reactive<Data>({
      clipped: false,
      drawer: false,
    })
    const signOut = () => {
      const auth = getAuth()
      auth.signOut()
      router.push('/')
    }
    const signedIn = computed(() => authStore.isSignedIn)
    return { data, signedIn, signOut }
  },
})
</script>
