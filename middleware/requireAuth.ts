import { Middleware } from '@nuxt/types'
import { authStore } from '~/store'

const middlware: Middleware = ({ route, redirect }) => {
  if (!authStore.isSignedIn && route.name !== "signup" && route.name !== "signin") {
    redirect('/signin')
  }
  if (authStore.isSignedIn && (route.name === "signup" || route.name === "signin")) {
    redirect('/')
  }
}

export default middlware
