import { InjectionKey, Ref } from '@nuxtjs/composition-api'
import { UserInfo } from '~/types/auth'

export const CurrentUser: InjectionKey<Ref<UserInfo | null>> = Symbol()
export const UpdateCurrentUser: InjectionKey<(_: UserInfo) => void> = Symbol()
