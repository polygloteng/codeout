<template>
  <div class="mx-auto mt-10" style="width: 200px">
    <v-btn @click="signUp">GitHubログインして会員登録</v-btn>
  </div>
</template>

<script lang="ts">
import { getAuth, signInWithPopup, GithubAuthProvider } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { defineComponent, useContext, useRouter, onBeforeMount } from '@nuxtjs/composition-api'
import { retrieveGitHubProfile } from '~/lib/auth'
import { userConverter, publicProfileConverter } from '~/lib/converters'
import RequireAuth from '~/middleware/requireAuth'

export default defineComponent({
  middleware: RequireAuth,
  setup() {
    const context = useContext() // this must be called within setup function
    const router = useRouter() // this must be called within setup function
    const auth = getAuth()
    onBeforeMount(() => {
      // required in case of direct access while the user is signed in
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          context.redirect('/')
        }
        // after the page is displayed, page transition will be monitored by the middleware, so unsubscribe it
        unsubscribe()
      })
    })
    const signUp = async () => {
      const provider = new GithubAuthProvider()
      try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        console.log(user)

        // validation
        if (!user.email) throw new Error('failed to get email')
        if (!user.displayName) throw new Error('failed to get nickname')
        const githubUserProfile = retrieveGitHubProfile(user)
        if (!githubUserProfile) throw new Error('failed to retrieve GitHub user profile')

        // create user information if it does not exist
        const userSnapshot = await getDoc(doc(context.$db, 'users', user.uid))
        if (!userSnapshot.exists()) {
          const userRef = doc(context.$db, 'users', user.uid).withConverter(userConverter)
          const publicProfileRef = doc(context.$db, 'public-profiles', user.uid).withConverter(publicProfileConverter)
          const now = serverTimestamp()
          const batch = writeBatch(context.$db)
          batch.set(userRef, {
            github_uid: githubUserProfile.uid,
            point: 0,
            created: now,
            updated: now,
          })
          batch.set(publicProfileRef, {
            nickname: user.displayName,
            thumbnail_url: user.photoURL ?? '',
            score: 0,
            created: now,
            updated: now,
          })
          await batch.commit()
        }
        router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
    return { signUp }
  },
})
</script>

<style>
</style>
