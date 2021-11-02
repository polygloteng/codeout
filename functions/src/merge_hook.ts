import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as crypto from 'crypto'
import { userConverter, publicProfileConverter, taskConverter, purchaseConverter } from './lib/converters'

const ERROR_MSG_INVALID_HTTP_METHOD = 'invalid HTTP method'
const ERROR_MSG_INVALID_BASE_BRANCH = 'invalid base branch'
// const ERROR_MSG_INVALID_PR_STATUS = 'invalid pull request status'
const ERROR_MSG_INVALID_SIGNATURE = 'invalid signature'
const ERROR_MSG_TASK_DOES_NOT_EXIST = 'task does not exist, probably not a learning repository'
const ERROR_MSG_USER_DOES_NOT_EXIST = 'user does not exist'
const ERROR_MSG_PURCHASE_DOES_NOT_EXIST = 'purchase does not exist'
const ERROR_MSG_PUBLIC_PROFILE_DOES_NOT_EXIST = 'publicProfile does not exist'
const ERROR_MSG_TASK_ALREADY_COMPLETED = 'task has already been completed'
const ERROR_MSG_UNEXPECTED = 'unexpected error occurred'
const MSG_COMPLETED = 'completed'

export const mergeHook = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'POST') {
      functions.logger.error(ERROR_MSG_INVALID_HTTP_METHOD)
      res.status(405).send(ERROR_MSG_INVALID_HTTP_METHOD)
      return
    }

    if (String(req.body.pull_request.base.ref) !== 'main') {
      functions.logger.error(ERROR_MSG_INVALID_BASE_BRANCH)
      res.status(400).send(ERROR_MSG_INVALID_BASE_BRANCH)
      return
    }

    // ここを厳密にするとテストがやりづらいので一旦コメントアウトしておく
    // if (String(req.body.action) !== 'closed' || !req.body.pull_request.merged) {
    //   functions.logger.error(ERROR_MSG_INVALID_PR_STATUS)
    //   res.status(400).send(ERROR_MSG_INVALID_PR_STATUS)
    //   return
    // }

    const expectedSignature =
      'sha256=' +
      crypto
        .createHmac('sha256', functions.config().github.webhook.secret)
        .update(JSON.stringify(req.body))
        .digest('hex')
    if (req.header('X-Hub-Signature-256') !== expectedSignature) {
      functions.logger.error(ERROR_MSG_INVALID_SIGNATURE)
      res.status(400).send(ERROR_MSG_INVALID_SIGNATURE)
      return
    }

    const targetRepoUrl = `https://github.com/${req.body.pull_request.head.repo.full_name}`
    functions.logger.info('targetRepoUrl is:', targetRepoUrl)
    const githubUid = String(req.body.pull_request.user.id)
    const srcRepoUrl = targetRepoUrl.replace(`-${githubUid}`, '')
    const taskCollectionSnapshot = await admin
      .firestore()
      .collection('tasks')
      .where('repo_url', '==', srcRepoUrl)
      .withConverter(taskConverter)
      .get()
    if (taskCollectionSnapshot.empty) {
      functions.logger.error(ERROR_MSG_TASK_DOES_NOT_EXIST)
      res.status(400).send(ERROR_MSG_TASK_DOES_NOT_EXIST)
      return
    }
    const task = taskCollectionSnapshot.docs[0].data()
    functions.logger.info('task is:', task)

    const userCollectionSnapshot = await admin
      .firestore()
      .collection('users')
      .where('github_uid', '==', githubUid)
      .withConverter(userConverter)
      .get()
    if (userCollectionSnapshot.empty) {
      functions.logger.error(ERROR_MSG_USER_DOES_NOT_EXIST)
      res.status(400).send(ERROR_MSG_USER_DOES_NOT_EXIST)
      return
    }
    const user = userCollectionSnapshot.docs[0].data()
    functions.logger.info('user is:', user)

    await admin.firestore().runTransaction(async (transaction) => {
      functions.logger.info('transaction start')
      const purchaseRef = admin
        .firestore()
        .doc(`users/${user.id}/purchases/${task.id}`)
        .withConverter(purchaseConverter)
      const purchaseSnapshot = await transaction.get(purchaseRef)
      const purchase = purchaseSnapshot.data()
      functions.logger.info('purchase is:', purchase)
      if (!purchase) throw new Error(ERROR_MSG_PURCHASE_DOES_NOT_EXIST)
      if (purchase.task_completed) {
        functions.logger.error(ERROR_MSG_TASK_ALREADY_COMPLETED)
        res.status(400).send(ERROR_MSG_TASK_ALREADY_COMPLETED)
        return
      }

      const publicProfileRef = admin.firestore().doc(`public-profiles/${user.id}`).withConverter(publicProfileConverter)
      const publicProfileSnapshot = await transaction.get(publicProfileRef)
      const publicProfile = publicProfileSnapshot.data()
      functions.logger.info('publicProfile is:', publicProfile)
      if (!publicProfile) throw new Error(ERROR_MSG_PUBLIC_PROFILE_DOES_NOT_EXIST)

      const now = admin.firestore.Timestamp.now() // transactionを使う場合はserverTimestampは使用不可のようである
      transaction.update(purchaseRef, { task_completed: true, updated: now })
      transaction.update(publicProfileRef, { score: publicProfile.score + task.score, updated: now })

      functions.logger.info(MSG_COMPLETED)
      res.send(MSG_COMPLETED)
    })
  } catch (error) {
    functions.logger.error(JSON.stringify(error))
    res.status(500).send(ERROR_MSG_UNEXPECTED)
    return
  }
})
