import { Store } from 'vuex'
import { initializeStores } from '~/lib/store-accessor'

const initializer = (store: Store<any>) => initializeStores(store)

// 参考：https://vuex.vuejs.org/ja/guide/plugins.html
// 参考：https://nuxtjs.org/docs/directory-structure/store/#plugins-in-the-store
// 上記の参考ドキュメントを読めば分かるが、このコードによってinitializeStores関数が1回だけ実行され、
// 各ストアが初期化される(purchaseStore等の変数に値が設定される)
export const plugins = [initializer]
export * from '~/lib/store-accessor'
