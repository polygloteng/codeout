import { FirestoreDataConverter, DocumentReference, Timestamp } from '@google-cloud/firestore'
import { User, Task, Purchase } from '../types/db'

export function assertUser(data: any): asserts data is User {
  const d = data as Partial<User>
  if (
    !(
      typeof d?.github_uid === 'string' &&
      typeof d?.point === 'number' &&
      d?.created instanceof Timestamp &&
      d?.updated instanceof Timestamp
    )
  ) {
    throw new Error('data is not User type')
  }
}

export const userConverter: FirestoreDataConverter<User> = {
  fromFirestore(snapshot) {
    const data = snapshot.data()
    assertUser(data)
    return data as User
  },
  toFirestore: (model: User) => model,
}

export function assertTask(data: any): asserts data is Task {
  const d = data as Partial<Task>
  if (
    !(
      typeof d?.name === 'string' &&
      typeof d?.description === 'string' &&
      typeof d?.thumbnail_url === 'string' &&
      typeof d?.repo_url === 'string' &&
      typeof d?.point === 'number' &&
      typeof d?.score === 'number' &&
      Array.isArray(d?.tags) &&
      typeof d?.level === 'number' &&
      typeof d?.avg_rating === 'number' &&
      d?.created instanceof Timestamp &&
      d?.updated instanceof Timestamp
    )
  ) {
    throw new Error('data is not Task type')
  }
}

export const taskConverter: FirestoreDataConverter<Task> = {
  fromFirestore(snapshot) {
    const data = snapshot.data()
    assertTask(data)
    return data as Task
  },
  toFirestore: (model: Task) => model,
}

export function assertPurchase(data: any): asserts data is Purchase {
  const d = data as Partial<Purchase>
  if (
    !(
      d?.task_ref instanceof DocumentReference &&
      typeof d?.repo_url === 'string' &&
      typeof d?.point === 'number' &&
      d?.created instanceof Timestamp &&
      d?.updated instanceof Timestamp
    )
  ) {
    throw new Error('data is not Purchase type')
  }
}

export const purchaseConverter: FirestoreDataConverter<Purchase> = {
  fromFirestore(snapshot) {
    const data = snapshot.data()
    assertPurchase(data)
    return data as Purchase
  },
  toFirestore: (model: Purchase) => model,
}
