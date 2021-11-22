import { Ref, UnwrapRef } from '@nuxtjs/composition-api'
import { Firestore } from 'firebase/firestore'
import { UserInfo } from '~/types/auth'
import { SearchIndex } from 'algoliasearch/lite'

declare module '@nuxt/types' {
  interface Context {
    $db: Firestore
    $currentUser: Ref<UnwrapRef<UserInfo | null>>
    $taskIndex: SearchIndex
  }
}
