import { Plugin } from '@nuxt/types'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const plugin: Plugin = (context) => {
  console.log("plugin firebase initializeApp")
  const firebaseApp = initializeApp(context.$config.firebaseConfig)
  context.$db = getFirestore(firebaseApp)
}

export default plugin
