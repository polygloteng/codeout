import { onBeforeMount, computed, InjectionKey, Ref, inject } from '@nuxtjs/composition-api'
import {
  User as FirebaseUser,
  AdditionalUserInfo,
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
  getAdditionalUserInfo,
} from 'firebase/auth'
import { Firestore, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { UserInfo } from '~/types/auth'
import { PublicProfile } from '~/types/db'
import { userConverter, profileConverter } from '~/lib/converters'
import { CurrentUser } from '~/lib/constants'

const retrieveUserInfo = (
  firebaseUser: FirebaseUser,
  additionalUserInfo: AdditionalUserInfo | null,
  profile: PublicProfile | undefined
): UserInfo => {
  // メールアドレスが登録されていないケースは発生しないと思われるが一応チェックしておく
  if (!firebaseUser.email) throw new Error('failed to get email')
  const githubUserProfile = firebaseUser.providerData.find(
    (profile) => profile.providerId === GithubAuthProvider.PROVIDER_ID
  )
  if (!githubUserProfile) throw new Error('failed to retrieve GitHub user profile')

  if (
    !additionalUserInfo ||
    additionalUserInfo.providerId !== GithubAuthProvider.PROVIDER_ID ||
    !additionalUserInfo.username
  ) {
    throw new Error('failed to retrieve required GitHub additional user information')
  }
  const nickname = profile?.nickname ?? ''
  const thumbnailURL = profile?.thumbnail_url ?? firebaseUser.photoURL ?? ''
  return {
    systemUserId: firebaseUser.uid,
    githubUserId: githubUserProfile.uid,
    githubUserName: additionalUserInfo.username,
    nickname: nickname,
    thumbnailURL: thumbnailURL,
  }
}

export const useAuth = () => {
  const currentUser = inject(CurrentUser)
  if (currentUser === undefined) {
    throw new Error('currentUser is not provided')
  }
  const auth = getAuth()
  const provider = new GithubAuthProvider()
  const signIn = ({ $db }: { $db: Firestore }) => {
    return new Promise<UserInfo>(async (resolve, reject) => {
      try {
        const result = await signInWithPopup(auth, provider)
        const firebaseUser = result.user
        const additionalUserInfo = getAdditionalUserInfo(result)
        // Firestoreにアクセスしているが、
        // useAuthが実行されてもsignIn関数が実行されない限りはここのコードは実行されないので問題ない。
        const profileSnapshot = await getDoc(
          doc($db, 'public-profiles', firebaseUser.uid).withConverter(profileConverter)
        )
        const userInfo = retrieveUserInfo(firebaseUser, additionalUserInfo, profileSnapshot.data())
        resolve(userInfo)
      } catch (error) {
        reject(error)
      }
    })
  }
  const signOut = () => {
    auth.signOut()
  }
  const onUserSignedInStateSettled = ({
    signedInCallback,
    notSignedInCallback,
  }: {
    signedInCallback?: Function
    notSignedInCallback?: Function
  }) => {
    onBeforeMount(() => {
      // required in case of direct access while the user is signed in
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          console.log('auth state changed, user signed in')
          if (signedInCallback) signedInCallback()
        } else {
          console.log('auth state changed, user not signed in')
          if (notSignedInCallback) notSignedInCallback()
        }
        // after the page is displayed, page transition will be monitored by the middleware, so unsubscribe it
        unsubscribe()
      })
    })
  }

  return { currentUser, signIn, signOut, onUserSignedInStateSettled }
}

export const createUserIfNotExist = async ({ $db }: { $db: Firestore }, userInfo: UserInfo): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const userSnapshot = await getDoc(doc($db, 'users', userInfo.systemUserId))
      if (!userSnapshot.exists()) {
        const userRef = doc($db, 'users', userInfo.systemUserId).withConverter(userConverter)
        const profileRef = doc($db, 'public-profiles', userInfo.systemUserId).withConverter(profileConverter)
        const now = serverTimestamp()
        const batch = writeBatch($db)
        batch.set(userRef, {
          github_uid: userInfo.githubUserId,
          github_username: userInfo.githubUserName,
          point: 0,
          created: now,
          updated: now,
        })
        batch.set(profileRef, {
          nickname: userInfo.githubUserName,
          thumbnail_url: userInfo.thumbnailURL,
          score: 0,
          created: now,
          updated: now,
        })
        await batch.commit()
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
