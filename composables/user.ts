import { onBeforeMount, ref } from '@nuxtjs/composition-api'
import { Firestore, doc, collection, getDoc, getDocs, query, orderBy } from 'firebase/firestore'
import { UserInfo } from '~/types/auth'
import { User, PublicProfile, Purchase } from '~/types/db'
import { userConverter, publicProfileConverter, purchaseConverter } from '~/lib/converters'

export const useUser = ({ $db }: { $db: Firestore }, currentUser: UserInfo | null) => {
  const user = ref<User>()
  const publicProfile = ref<PublicProfile>()
  const purchases = ref<Purchase[]>([])
  onBeforeMount(async () => {
    if (currentUser) {
      const userSnapshot = await getDoc(doc($db, 'users', currentUser.systemUserId).withConverter(userConverter))
      if (!userSnapshot.exists()) {
        throw new Error('user does not exist')
      }
      user.value = userSnapshot.data()
    }
  })
  onBeforeMount(async () => {
    if (currentUser) {
      const publicProfileSnapshot = await getDoc(
        doc($db, 'public-profiles', currentUser.systemUserId).withConverter(publicProfileConverter)
      )
      if (!publicProfileSnapshot.exists()) {
        throw new Error('public profile does not exist')
      }
      publicProfile.value = publicProfileSnapshot.data()
    }
  })
  onBeforeMount(async () => {
    if (currentUser) {
      const querySnapshot = await getDocs(
        query(
          collection($db, `users/${currentUser.systemUserId}/purchases`).withConverter(purchaseConverter),
          orderBy('created', 'desc')
        )
      )
      purchases.value = querySnapshot.docs.map((doc) => doc.data())
    }
  })
  return { user, publicProfile, purchases }
}
