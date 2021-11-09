import { ref, provide, onGlobalSetup, onUnmounted } from '@nuxtjs/composition-api'
import { Plugin } from '@nuxt/types'
import { doc, getDoc } from 'firebase/firestore'
import { getAuth, Unsubscribe } from 'firebase/auth'
import { UserInfo } from '~/types/auth'
import { userConverter } from '~/lib/converters'
import { CurrentUser } from '~/lib/constants'

const plugin: Plugin = async (context) => {
  const currentUser = ref<UserInfo | null>(null)
  context.$currentUser = currentUser.value
  const auth = getAuth()
  const unsubscribe = await new Promise<Unsubscribe>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        currentUser.value = null
      } else {
        const userSnapshot = await getDoc(doc(context.$db, 'users', user.uid).withConverter(userConverter))
        if (!userSnapshot.exists) throw new Error('cannot find user document')
        currentUser.value = {
          systemUserId: user.uid,
          githubUserId: userSnapshot.data()!.github_uid,
          githubUserName: userSnapshot.data()!.github_username,
          thumbnailURL: user.photoURL,
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
