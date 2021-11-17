import { ref, provide, onGlobalSetup, onUnmounted } from '@nuxtjs/composition-api'
import { Plugin } from '@nuxt/types'
import { doc, getDoc } from 'firebase/firestore'
import { getAuth, Unsubscribe } from 'firebase/auth'
import { UserInfo } from '~/types/auth'
import { userConverter, publicProfileConverter } from '~/lib/converters'
import { CurrentUser } from '~/lib/constants'

const plugin: Plugin = async (context) => {
  const currentUser = ref<UserInfo | null>(null)
  context.$currentUser = currentUser
  const auth = getAuth()
  const unsubscribe = await new Promise<Unsubscribe>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log('in plugin, auth state changed, user not signed in')
        currentUser.value = null
      } else {
        console.log('in plugin, auth state changed, user signed in')
        const userSnapshot = await getDoc(doc(context.$db, 'users', user.uid).withConverter(userConverter))
        if (!userSnapshot.exists) throw new Error('cannot find user document')
        const publicProfileSnapshot = await getDoc(
          doc(context.$db, 'public-profiles', user.uid).withConverter(publicProfileConverter)
        )
        if (!publicProfileSnapshot.exists) throw new Error('cannot find public profile document')
        currentUser.value = {
          systemUserId: user.uid,
          githubUserId: userSnapshot.data()!.github_uid,
          githubUserName: userSnapshot.data()!.github_username,
          nickname: publicProfileSnapshot.data()!.nickname,
          thumbnailURL: user.photoURL ?? '',
        }
      }
      resolve(unsubscribe)
    })
  })

  onGlobalSetup(() => {
    console.log('onGlobalSetup called')
    provide(CurrentUser, currentUser)
    onUnmounted(unsubscribe)
  })
}

export default plugin
