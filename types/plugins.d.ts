import { Firestore } from 'firebase/firestore'

declare module '@nuxt/types' {
  interface Context {
    $db: Firestore
  }
}
