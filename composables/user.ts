import { onBeforeMount, useAsync, ref, reactive, inject } from '@nuxtjs/composition-api'
import {
  Firestore,
  doc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  DocumentReference,
  serverTimestamp,
} from 'firebase/firestore'
import { UserInfo } from '~/types/auth'
import { User, PublicProfile, Purchase } from '~/types/db'
import { userConverter, profileConverter, purchaseConverter } from '~/lib/converters'
import { UpdateCurrentUser } from '~/lib/constants'

export const useUser = ({ $db }: { $db: Firestore }, currentUser: UserInfo | null) => {
  const user = ref<User>()
  const profile = ref<PublicProfile>()
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
      const profileSnapshot = await getDoc(
        doc($db, 'public-profiles', currentUser.systemUserId).withConverter(profileConverter)
      )
      if (!profileSnapshot.exists()) {
        throw new Error('public profile does not exist')
      }
      profile.value = profileSnapshot.data()
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
  return { user, profile, purchases }
}

const makeProfileRef = ($db: Firestore, user_id: string): DocumentReference<PublicProfile> => {
  return doc($db, 'public-profiles', user_id).withConverter(profileConverter)
}

interface ProfileData {
  nickname: string
  thumbnail_url: string
}

export const useProfile = ({ $db }: { $db: Firestore }, uid: string) => {
  const profile = ref<PublicProfile>()
  const data = reactive<ProfileData>({
    nickname: '',
    thumbnail_url: '',
  })
  useAsync(async () => {
    const profileSnapshot = await getDoc(makeProfileRef($db, uid).withConverter(profileConverter))
    if (!profileSnapshot.exists()) {
      throw new Error('public profile does not exist')
    }
    profile.value = profileSnapshot.data()
    data.nickname = profile.value.nickname
    data.thumbnail_url = profile.value.thumbnail_url
  })
  const updateCurrentUser = inject(UpdateCurrentUser)
  if (updateCurrentUser === undefined) {
    throw new Error('updateCurrentUser is not provided')
  }
  const doEdit = async (currentUser: UserInfo | null, nickname: string, thumbnail_url: string) => {
    if (!currentUser) throw new Error('User must be logged in')
    if (nickname.length <= 0) throw new Error('nickname is required')
    if (thumbnail_url.length <= 0) throw new Error('thumbnail_url is required')

    const profileRef = makeProfileRef($db, uid)
    const profileSnapshot = await getDoc(profileRef)
    if (!profileSnapshot.exists()) {
      throw new Error('public profile does not exist')
    }
    const now = serverTimestamp()
    try {
      await updateDoc(profileRef, {
        nickname: nickname,
        thumbnail_url: thumbnail_url,
        updated: now,
      })
      updateCurrentUser({
        systemUserId: currentUser.systemUserId,
        githubUserId: currentUser.githubUserId,
        githubUserName: currentUser.githubUserName,
        nickname: nickname,
        thumbnailURL: thumbnail_url,
      })
      console.log('doEdit completed')
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  return { profile, data, doEdit }
}
