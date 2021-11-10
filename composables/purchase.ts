import { ref, computed, onBeforeMount } from '@nuxtjs/composition-api'
import { Firestore, doc, getDoc, onSnapshot, DocumentReference } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { purchaseStore } from '~/store'
import { UserInfo } from '~/types/auth'
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

export const usePurchase = ({ $db }: { $db: Firestore }, currentUser: UserInfo | null, task_id: string) => {
  const isPurchasing = computed(() => {
    if (!currentUser) return false
    const purchasingList = purchaseStore.getPurchasingList
    const purchaseRef = makePurchaseRef($db, currentUser.systemUserId, task_id)
    return purchaseRef.path in purchasingList
  })

  const purchase = ref<Purchase>()
  onBeforeMount(async () => {
    if (currentUser) {
      const purchaseRef = makePurchaseRef($db, currentUser.systemUserId, task_id)
      const purchaseSnapshot = await getDoc(purchaseRef)
      if (purchaseSnapshot.exists()) {
        purchaseStore.deletePurchasing(purchaseRef.path)
        purchase.value = purchaseSnapshot.data()
      }
    }
  })

  const doPurchase = async () => {
    if (!currentUser) throw new Error('User must be logged in')
    const purchaseRef = makePurchaseRef($db, currentUser.systemUserId, task_id)
    purchaseStore.addPurchasing(purchaseRef.path)
    const functions = getFunctions(undefined, 'asia-northeast1')
    const purchaseFunc = httpsCallable<PurchaseRequest, PurchaseResponse>(functions, 'purchase')
    try {
      const result = await purchaseFunc({ task_id: task_id })
      console.log(result.data.message)
      startListener(purchaseRef)
    } catch (error) {
      purchaseStore.deletePurchasing(purchaseRef.path)
      console.error(error)
    }
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
