import { Plugin } from '@nuxt/types'
import { getAuth } from 'firebase/auth'
import { authStore } from '~/store'

const plugin: Plugin = (context) => {
  const auth = getAuth()
  auth.onAuthStateChanged((user) => {
    if (user) {
      authStore.setUser({
        uid: user.uid,
      })
    } else {
      authStore.setUser(null)
    }
  })
}

export default plugin
