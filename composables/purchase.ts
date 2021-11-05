import { ref, computed, watch, onMounted } from '@nuxtjs/composition-api'
import { Firestore, doc, getDoc, onSnapshot, DocumentReference } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { authStore, purchaseStore } from '~/store'
import { Purchase } from '~/types/db'
import { purchaseConverter } from '~/lib/converters'

interface PurchaseRequest {
  task_id: string
}

interface PurchaseResponse {
  message: string
}

const makePurchaseRef = ($db: Firestore, user_id: string, task_id: string): DocumentReference<Purchase> => {
  return doc($db, `users/${user_id}/purchases`, task_id).withConverter(purchaseConverter)
}

export const usePurchase = ({ $db }: { $db: Firestore }, task_id: string) => {
  const isPurchasing = computed(() => {
    const user = authStore.getUser
    if (!user) return false
    const purchasingList = purchaseStore.getPurchasingList
    const purchaseRef = makePurchaseRef($db, user.uid, task_id)
    return purchaseRef.path in purchasingList
  })

  const purchase = ref<Purchase>()
  const refreshPurchaseStates = async () => {
    const user = authStore.getUser
    if (user) {
      const purchaseRef = makePurchaseRef($db, user.uid, task_id)
      const purchaseSnapshot = await getDoc(purchaseRef)
      if (purchaseSnapshot.exists()) {
        purchaseStore.deletePurchasing(purchaseRef.path)
        purchase.value = purchaseSnapshot.data()
      }
    }
  }
  onMounted(() => refreshPurchaseStates())
  const signedIn = computed(() => authStore.isSignedIn)
  watch(signedIn, () => refreshPurchaseStates())

  const doPurchase = async () => {
    const user = authStore.getUser
    if (!user) throw new Error('User must be logged in')
    const githubUserName = authStore.getGitHubUserName
    if (!githubUserName) throw new Error('GitHub username had to be retrieved')
    const purchaseRef = makePurchaseRef($db, user.uid, task_id)
    purchaseStore.addPurchasing(purchaseRef.path)
    const functions = getFunctions(undefined, 'asia-northeast1')
    const purchaseFunc = httpsCallable<PurchaseRequest, PurchaseResponse>(functions, 'purchase')
    const result = await purchaseFunc({ task_id: task_id })
    startListener(purchaseRef)
    console.log(result.data.message)
  }
  const startListener = (purchaseRef: DocumentReference<Purchase>) => {
    const unsubscribe = onSnapshot(
      purchaseRef,
      (purchaseSnapshot) => {
        if (purchaseSnapshot.exists()) {
          console.log('purchase document created')
          purchaseStore.deletePurchasing(purchaseRef.path)
          purchase.value = purchaseSnapshot.data()
          unsubscribe()
        }
      },
      (error) => {
        console.error(error)
        purchaseStore.deletePurchasing(purchaseRef.path)
        unsubscribe()
      }
    )
  }
  return { purchase, isPurchasing, doPurchase }
}
