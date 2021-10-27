import { Plugin } from '@nuxt/types'
import { getAuth } from 'firebase/auth'
import { authStore } from '~/store'

const plugin: Plugin = (context) => {
  const auth = getAuth()
  auth.onAuthStateChanged((user) => {
    if (user) {
      authStore.setUser({
        email: user.email ?? undefined,
      })
    } else {
      authStore.setUser(null)
    }
  })
}

export default plugin
