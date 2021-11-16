import * as admin from 'firebase-admin'
import { purchase } from './purchase'
import { mergeHook } from './merge_hook'
import { onUpdateTask } from './on_update_task'

admin.initializeApp()
admin.firestore().settings({
  ignoreUndefinedProperties: true,
})

export { purchase, mergeHook, onUpdateTask }
