import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import auth from '~/store/auth'

let authStore: auth

function initializeStores(store: Store<any>): void {
  authStore = getModule(auth, store)
  // ストアを追加する場合はここに追記していく。
}

export { initializeStores, authStore }
