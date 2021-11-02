import { Plugin } from '@nuxt/types'
import { getAuth } from 'firebase/auth'
import { authStore } from '~/store'

const plugin: Plugin = (context) => {
  const auth = getAuth()
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Authenticationのuserオブジェクトは巨大すぎてstoreに保存できないので、
      // 一部の情報だけを抽出する
      authStore.setUser({
        uid: user.uid,
      })
    } else {
      authStore.setUser(null)
    }
  })
}

export default plugin
