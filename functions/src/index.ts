import * as functions from "firebase-functions";
import { Octokit } from "@octokit/rest";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const purchaseTask = functions.https.onCall(async (data, context) => {
  functions.logger.info("purchaseTask called");
  // 認証されていなければエラーを返す
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'authentication required')
  }

  const octokit = new Octokit({
    auth: functions.config().github.token
  });

  try {
    const res = await octokit.request('POST /repos/{template_owner}/{template_repo}/generate', {
      template_owner: 'zskclassroom01',
      template_repo: 'github-starter-course',
      name: 'hoge',
      owner: 'zskclassroom01',
      private: true,
    })
    console.log(JSON.stringify(res))
  } catch (error) {
    console.log(JSON.stringify(error))
    throw new functions.https.HttpsError('internal', 'GitHub API call failed')
  }

  // try {
  //   Templateリポジトリからユーザー用のリポジトリを作成するGitHub APIをコール
  //   1秒スリープ(Secondary limit rates対策)
  // } catch {
  //   if エラーが「既にリポジトリが作成されている」ことによるエラーの場合 {
  //     なにもしない
  //   } else {
  //     エラーを返す
  //   }
  // }

  // try {
  //   ユーザー用のリポジトリにブランチ保護設定をおこなうGitHub APIをコール
  //   1秒スリープ(Secondary limit ratest対策)
  // } catch {
  //   エラーを返す(このAPIは冪等性があるのでエラーが発生するのはNG)
  // }

  // try {
  //   トランザクションを開始する {
  //     // read
  //     userドキュメントとtaskドキュメントとuser/taskドキュメントを取得する

  //     // validation
  //     user.pointがtask.point未満ならばエラーを返す
  //     user/taskドキュメントが既に存在するならばエラーを返す

  //     // update or insert
  //     userのpointを減算して更新
  //     user/taskドキュメントを新規作成
  //     ユーザー用リポジトリの外部コラボレータとしてユーザを招待するGitHub APIをコール
  //   }
  // } catch {
  //   ユーザーをリポジトリの外部コラボレーターから削除するGitHub APIをコール
  // }
  return { message: "hoge" }
});
