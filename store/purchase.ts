import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

type PurchasingList = { [key: string]: boolean }

@Module({
  name: 'purchase',
  stateFactory: true, // 参考：https://github.com/championswimmer/vuex-module-decorators#module-re-use-use-with-nuxtjs
  namespaced: true,
})
export default class Purchase extends VuexModule {
  private purchasingList: PurchasingList = {}

  public get getPurchasingList() {
    return this.purchasingList
  }

  @Mutation
  public addPurchasing(key: string) {
    this.purchasingList[key] = true
    // See: https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
    this.purchasingList = { ...this.purchasingList }
  }

  @Mutation
  public deletePurchasing(key: string) {
    delete this.purchasingList[key]
    // See: https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
    this.purchasingList = { ...this.purchasingList }
  }
}
