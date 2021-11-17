import { Middleware } from '@nuxt/types'

const middlware: Middleware = ({ $currentUser, route, redirect }) => {
  if (!$currentUser.value && route.name !== 'signup' && route.name !== 'signin') {
    redirect('/signin')
  }
  if ($currentUser.value && (route.name === 'signup' || route.name === 'signin')) {
    redirect('/')
  }
}

export default middlware
