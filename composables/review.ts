import { ref, reactive, onBeforeMount } from '@nuxtjs/composition-api'
import { Firestore, doc, getDoc, DocumentReference, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { UserInfo } from '~/types/auth'
import { Review } from '~/types/db'
import { reviewConverter } from '~/lib/converters'

interface Data {
  rating: number
  comment: string
}

const makeReviewRef = ($db: Firestore, task_id: string, user_id: string): DocumentReference<Review> => {
  return doc($db, `tasks/${task_id}/reviews`, user_id).withConverter(reviewConverter)
}

export const useReview = ({ $db }: { $db: Firestore }, task_id: string, currentUser: UserInfo | null) => {
  const review = ref<Review>()
  const data = reactive<Data>({
    rating: 0,
    comment: '',
  })
  onBeforeMount(async () => {
    if (currentUser) {
      const reviewRef = makeReviewRef($db, task_id, currentUser.systemUserId)
      const reviewSnapshot = await getDoc(reviewRef)
      if (reviewSnapshot.exists()) {
        review.value = reviewSnapshot.data()
        data.rating = review.value.rating
        data.comment = review.value.comment
      }
    }
  })
  const doPost = async (rating: number, comment: string) => {
    if (!currentUser) throw new Error('User must be logged in')
    if (rating < 1) throw new Error('rating must be at least 1')
    if (comment.length <= 0) throw new Error('comment is required')

    const reviewRef = makeReviewRef($db, task_id, currentUser.systemUserId)
    const now = serverTimestamp()
    try {
      if (review.value) {
        await updateDoc(reviewRef, {
          comment: comment,
          rating: rating,
          updated: now,
        })
      } else {
        await setDoc(reviewRef, {
          profile: {
            ref: reviewRef,
            nickname: currentUser.nickname,
            thumbnail_url: currentUser.thumbnailURL,
          },
          comment: comment,
          rating: rating,
          updated: now,
          created: now,
        })
      }
      console.log('doPost completed')
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  return { data, doPost }
}
