import { Middleware } from '@nuxt/types'

const middlware: Middleware = ({ $currentUser, route, redirect }) => {
  if (!$currentUser && route.name !== 'signup' && route.name !== 'signin' && route.name !== 'mypage') {
    redirect('/signin')
  }
  if ($currentUser && (route.name === 'signup' || route.name === 'signin')) {
    redirect('/')
  }
}

export default middlware
