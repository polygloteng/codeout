import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as path from 'path'
import { Octokit } from '@octokit/rest'
import { RequestError } from '@octokit/request-error'
import { userConverter, taskConverter, purchaseConverter } from './lib/converters'

interface PurchaseRequest {
  task_id: string
}

interface PurchaseResponse {
  message: string
}

export const purchase = functions.region('asia-northeast1').https.onCall(async (req: PurchaseRequest, context) => {
  functions.logger.info('purchase called')
  functions.logger.info(JSON.stringify(req))
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'authentication required')
  }

  const octokit = new Octokit({ auth: functions.config().github.token })
  const owner = functions.config().github.organization

  try {
    await admin.firestore().runTransaction(async (transaction) => {
      // トランザクションの実行時間が長くなるのは望ましくないが、GitHub APIのコール回数が増える方がデメリットが大きい。
      // (rate limitに抵触してAPIが実行できなくなる可能性がある)
      // userドキュメントとtaskドキュメントは滅多にupdateされないので、
      // 現時点ではとりあえずトランザクションが長くなってもGitHub APIのコール回数を少なくする方を優先する。
      functions.logger.info('purchase transaction start')
      const purchaseRef = admin
        .firestore()
        .doc(`users/${context.auth!.uid}/purchases/${req.task_id}`)
        .withConverter(purchaseConverter)
      const purchaseSnapshot = await transaction.get(purchaseRef)
      if (purchaseSnapshot.exists) throw new functions.https.HttpsError('internal', 'Already purchased')
      const userRef = admin.firestore().doc(`users/${context.auth!.uid}`).withConverter(userConverter)
      const userSnapshot = await transaction.get(userRef)
      const taskRef = admin.firestore().doc(`tasks/${req.task_id}`).withConverter(taskConverter)
      const taskSnapshot = await transaction.get(taskRef)
      const user = userSnapshot.data()
      const task = taskSnapshot.data()
      if (!user) throw new functions.https.HttpsError('internal', 'User does not exist')
      if (!task) throw new functions.https.HttpsError('internal', 'Task does not exist')
      if (user.point < task.point) throw new functions.https.HttpsError('internal', 'Not enough points')

      const srcRepoName = path.basename(task.repo_url)
      functions.logger.info(`srcRepoName = ${srcRepoName}`)
      const dstRepoName = `${srcRepoName}-${user.github_uid}`
      functions.logger.info(`dstRepoName = ${dstRepoName}`)

      // Templateリポジトリのclone
      try {
        const res = await octokit.request('POST /repos/{template_owner}/{template_repo}/generate', {
          template_owner: owner,
          template_repo: srcRepoName,
          name: dstRepoName,
          owner: owner,
          private: true,
        })
        functions.logger.info('cloning repo API call succeeded')
        functions.logger.info(JSON.stringify(res))
        await new Promise((resolve) => setTimeout(resolve, 1000)) // for avoiding secondary rate limits
      } catch (error) {
        functions.logger.error('error occurred in cloning repo API')
        functions.logger.error(JSON.stringify(error))
        if (error instanceof RequestError && error.status === 422) {
          // 既にリポジトリがclone済みの場合は422エラーが返されるのでこの場合は何もしない
        } else {
          throw error
        }
      }

      // mainブランチの保護設定
      try {
        const res = await octokit.request('PUT /repos/{owner}/{repo}/branches/{branch}/protection', {
          owner: owner,
          repo: dstRepoName,
          branch: 'main',
          required_status_checks: {
            strict: true,
            contexts: ['check'],
          },
          enforce_admins: true,
          required_pull_request_reviews: null,
          restrictions: null,
        })
        functions.logger.info('protecting branch API call succeeded')
        functions.logger.info(JSON.stringify(res))
        await new Promise((resolve) => setTimeout(resolve, 1000)) // for avoiding secondary rate limits
      } catch (error) {
        functions.logger.error('error occurred in protecting branch API for main branch')
        throw error
      }

      // リポジトリの外部コラボレータとしてユーザを招待
      try {
        const res = await octokit.request('PUT /repos/{owner}/{repo}/collaborators/{username}', {
          owner: owner,
          repo: dstRepoName,
          username: user.github_username,
          permission: 'push',
        })
        functions.logger.info('inviting collaborator API call succeeded')
        functions.logger.info(JSON.stringify(res))
      } catch (error) {
        functions.logger.error('error occurred in inviting collaborator API')
        throw error
      }

      // ポイントの減算処理と購入処理を実行
      const now = admin.firestore.Timestamp.now() // transactionを使う場合はserverTimestampは使用不可のようである
      transaction.update(userRef, { point: user.point - task.point, updated: now })
      transaction.set(purchaseRef, {
        task: {
          ref: taskRef,
          name: task.name,
          thumbnail_url: task.thumbnail_url,
        },
        task_completed: false,
        repo_url: `https://github.com/${owner}/${dstRepoName}`,
        point: task.point,
        created: now,
        updated: now,
      })
    })
  } catch (error) {
    functions.logger.error('error occurred in puchase transaction')
    functions.logger.error(JSON.stringify(error))
    if (error instanceof functions.https.HttpsError) {
      throw error
    } else {
      throw new functions.https.HttpsError('internal', 'Purchase transaction failed')
    }
  }

  return { message: 'purchase completed' } as PurchaseResponse
})
