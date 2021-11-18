import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import pick = require('lodash.pick')
import * as equal from 'fast-deep-equal'

class PickedTask {
  name = ''
  thumbnail_url = ''
}
const props = Object.keys(new PickedTask())

export const onUpdateTask = functions
  .region('asia-northeast1')
  .firestore.document('tasks/{task}')
  .onUpdate(async (change) => {
    try {
      const taskBefore = pick(change.before.data(), props) as PickedTask
      const taskAfter = pick(change.after.data(), props) as PickedTask
      if (equal(taskBefore, taskAfter)) {
        functions.logger.info('target fields are same. so do nothing')
        return
      }
      const purchasesSnapshot = await admin
        .firestore()
        .collectionGroup('purchases')
        .where('task.ref', '==', change.after.ref)
        .get()
      const batch = admin.firestore().batch()
      for (const purchase of purchasesSnapshot.docs) {
        batch.update(purchase.ref, {
          'task.name': taskAfter.name,
          'task.thumbnail_url': taskAfter.thumbnail_url,
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
