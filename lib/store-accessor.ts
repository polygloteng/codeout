import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import purchase from '~/store/purchase'

let purchaseStore: purchase

function initializeStores(store: Store<any>): void {
  purchaseStore = getModule(purchase, store)
  // ストアを追加する場合はここに追記していく。
}

export { initializeStores, purchaseStore }
