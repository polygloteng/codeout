import { Auth, GithubAuthProvider, User, UserInfo, AdditionalUserInfo } from 'firebase/auth'
import { Firestore, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { userConverter, publicProfileConverter } from '~/lib/converters'

export const onUserSingedIn = (auth: Auth, callback: Function) => {
  // required in case of direct access while the user is signed in
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('auth state changed, now user signed in')
      callback()
    }
    // after the page is displayed, page transition will be monitored by the middleware, so unsubscribe it
    unsubscribe()
  })
}

interface GitHubUserInfo extends UserInfo {
  username: string
}

export const retrieveGitHubUserInfo = (user: User, additionalUserInfo: AdditionalUserInfo | null): GitHubUserInfo => {
  // メールアドレスが登録されていないケースは発生しないと思われるが一応チェックしておく
  if (!user.email) throw new Error('failed to get email')
  const githubUserProfile = user.providerData.find((profile) => profile.providerId === GithubAuthProvider.PROVIDER_ID)
  if (!githubUserProfile) throw new Error('failed to retrieve GitHub user profile')

  if (
    !additionalUserInfo ||
    additionalUserInfo.providerId !== GithubAuthProvider.PROVIDER_ID ||
    !additionalUserInfo.username
  ) {
    throw new Error('failed to retrieve requreid GitHub additional user information')
  }
  return {
    ...githubUserProfile,
    username: additionalUserInfo.username,
  }
}

export const createUserIfNotExist = async (
  db: Firestore,
  firebaseUserId: string,
  githubUserInfo: GitHubUserInfo
): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const userSnapshot = await getDoc(doc(db, 'users', firebaseUserId))
      if (!userSnapshot.exists()) {
        const userRef = doc(db, 'users', firebaseUserId).withConverter(userConverter)
        const publicProfileRef = doc(db, 'public-profiles', firebaseUserId).withConverter(publicProfileConverter)
        const now = serverTimestamp()
        const batch = writeBatch(db)
        batch.set(userRef, {
          github_uid: githubUserInfo.uid,
          github_username: githubUserInfo.username,
          point: 0,
          created: now,
          updated: now,
        })
        batch.set(publicProfileRef, {
          nickname: githubUserInfo.username,
          thumbnail_url: githubUserInfo.photoURL ?? '',
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
