import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import auth from '~/store/auth'
import purchase from '~/store/purchase'

let authStore: auth
let purchaseStore: purchase

function initializeStores(store: Store<any>): void {
  authStore = getModule(auth, store)
  // ストアを追加する場合はここに追記していく。
  purchaseStore = getModule(purchase, store)
}

export { initializeStores, authStore, purchaseStore }
