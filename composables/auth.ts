import { useContext } from '@nuxtjs/composition-api'
import {
  User as FirebaseUser,
  AdditionalUserInfo,
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
  getAdditionalUserInfo,
} from 'firebase/auth'
import { Firestore, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { userConverter, publicProfileConverter } from '~/lib/converters'
import { authStore } from '~/store'

export const useAuth = () => {
  const auth = getAuth()
  const provider = new GithubAuthProvider()
  const signIn = () => {
    return new Promise<UserInfo>(async (resolve, reject) => {
      try {
        const result = await signInWithPopup(auth, provider)
        const firebaseUser = result.user
        const additionalUserInfo = getAdditionalUserInfo(result)
        const userInfo = retrieveUserInfo(firebaseUser, additionalUserInfo)
        authStore.setGitHubUserName(userInfo.githubUserName)
        resolve(userInfo)
      } catch (error) {
        reject(error)
      }
    })
  }
  const signOut = () => {
    auth.signOut()
    authStore.setGitHubUserName(null)
  }
  const onUserSingedIn = (callback: Function) => {
    // required in case of direct access while the user is signed in
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        console.log('auth state changed, now user signed in')
        callback()
      }
      // after the page is displayed, page transition will be monitored by the middleware, so unsubscribe it
      unsubscribe()
    })
  }
  return { signIn, signOut, onUserSingedIn }
}

const retrieveUserInfo = (firebaseUser: FirebaseUser, additionalUserInfo: AdditionalUserInfo | null): UserInfo => {
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
    throw new Error('failed to retrieve requreid GitHub additional user information')
  }
  return {
    systemUserId: firebaseUser.uid,
    githubUserId: githubUserProfile.uid,
    githubUserName: additionalUserInfo.username,
    thumbnailURL: firebaseUser.photoURL,
  }
}

export const createUserIfNotExist = async (db: Firestore, userInfo: UserInfo): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const userSnapshot = await getDoc(doc(db, 'users', userInfo.systemUserId))
      if (!userSnapshot.exists()) {
        const userRef = doc(db, 'users', userInfo.systemUserId).withConverter(userConverter)
        const publicProfileRef = doc(db, 'public-profiles', userInfo.systemUserId).withConverter(publicProfileConverter)
        const now = serverTimestamp()
        const batch = writeBatch(db)
        batch.set(userRef, {
          github_uid: userInfo.githubUserId,
          github_username: userInfo.githubUserName,
          point: 0,
          created: now,
          updated: now,
        })
        batch.set(publicProfileRef, {
          nickname: userInfo.githubUserName,
          thumbnail_url: userInfo.thumbnailURL ?? '',
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
