import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import pick = require('lodash.pick')
import * as equal from 'fast-deep-equal'

class PickedPublicProfile {
  nickname = ''
  thumbnail_url = ''
}
const props = Object.keys(new PickedPublicProfile())

export const onUpdatePublicProfile = functions
  .region('asia-northeast1')
  .firestore.document('public-profiles/{uid}')
  .onUpdate(async (change) => {
    try {
      const profileBefore = pick(change.before.data(), props) as PickedPublicProfile
      const profileAfter = pick(change.after.data(), props) as PickedPublicProfile
      if (equal(profileBefore, profileAfter)) {
        functions.logger.info('target fields are same. so do nothing')
        return
      }
      const reviewSnapshot = await admin
        .firestore()
        .collectionGroup('reviews')
        .where('profile.ref', '==', change.after.ref)
        .get()
      const batch = admin.firestore().batch()
      for (const review of reviewSnapshot.docs) {
        batch.update(review.ref, {
          'profile.nickname': profileAfter.nickname,
          'profile.thumbnail_url': profileAfter.thumbnail_url,
          updated: admin.firestore.FieldValue.serverTimestamp(),
        })
      }
      await batch.commit()
      functions.logger.info('completed')
    } catch (error) {
      functions.logger.error(JSON.stringify(error))
      throw error
    }
  })
