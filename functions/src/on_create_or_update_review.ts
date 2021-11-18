import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { reviewConverter } from './lib/converters'

// onCreateもonUpdateもonDeleteもトリガされた時点で既にドキュメントの状態は確定しているため、
// その時点でタスクに紐づいているreviewのratingを全て加算して計算するだけでよい。
const updateAvgRatingOfTask = async (task_id: string) => {
  const reviewsSnapshot = await admin
    .firestore()
    .collection(`tasks/${task_id}/reviews`)
    .withConverter(reviewConverter)
    .get()
  let totalRating = 0
  for (const review of reviewsSnapshot.docs) {
    totalRating += review.data().rating
  }
  const avgRating = totalRating / reviewsSnapshot.docs.length
  await admin.firestore().doc(`tasks/${task_id}`).update({
    avg_rating: avgRating,
    updated: admin.firestore.FieldValue.serverTimestamp(),
  })
}

export const onCreateReview = functions
  .region('asia-northeast1')
  .firestore.document('tasks/{taskId}/reviews/{reviewId}')
  .onCreate(async (_, context) => {
    try {
      await updateAvgRatingOfTask(context.params.taskId)
      functions.logger.info('completed')
    } catch (error) {
      functions.logger.error(JSON.stringify(error))
      throw error
    }
  })

export const onUpdateReview = functions
  .region('asia-northeast1')
  .firestore.document('tasks/{taskId}/reviews/{reviewId}')
  .onUpdate(async (change, context) => {
    try {
      const reviewBefore = reviewConverter.fromFirestore(change.before)
      const reviewAfter = reviewConverter.fromFirestore(change.after)
      if (reviewBefore.rating === reviewAfter.rating) {
        functions.logger.info('target fields are same. so do nothing')
        return
      }
      await updateAvgRatingOfTask(context.params.taskId)
      functions.logger.info('completed')
    } catch (error) {
      functions.logger.error(JSON.stringify(error))
      throw error
    }
  })

export const onDeleteReview = functions
  .region('asia-northeast1')
  .firestore.document('tasks/{taskId}/reviews/{reviewId}')
  .onDelete(async (_, context) => {
    try {
      await updateAvgRatingOfTask(context.params.taskId)
      functions.logger.info('completed')
    } catch (error) {
      functions.logger.error(JSON.stringify(error))
      throw error
    }
  })
