import { Firestore } from 'firebase/firestore'
import { UserInfo } from '~/types/auth'

declare module '@nuxt/types' {
  interface Context {
    $db: Firestore
    $currentUser: UserInfo | null
  }
}
