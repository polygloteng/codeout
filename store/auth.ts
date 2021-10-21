import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { StoredUser } from '~/types/store'

type PossiblyUser = StoredUser | null

@Module({
  name: 'auth',
  stateFactory: true, // 参考：https://github.com/championswimmer/vuex-module-decorators#module-re-use-use-with-nuxtjs
  namespaced: true
})
export default class Auth extends VuexModule {
  private user: PossiblyUser = null

  public get isSignedIn() {
    return this.user != null
  }

  @Mutation
  public setUser(user: PossiblyUser) {
    this.user = user
  }
}
