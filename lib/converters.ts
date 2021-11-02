import { FirestoreDataConverter, Timestamp, DocumentReference } from 'firebase/firestore'
import { User, PublicProfile, Task, Purchase } from '~/types/db'

export function assertUser(data: any): asserts data is User {
  const d = data as Partial<User>
  if (
    !(
      typeof d?.github_uid === 'string' &&
      typeof d?.github_username === 'string' &&
      typeof d?.point === 'number' &&
      d?.created instanceof Timestamp &&
      d?.updated instanceof Timestamp
    )
  ) {
    throw new Error('data is not User type')
  }
}

export const userConverter: FirestoreDataConverter<User> = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)
    data.id = snapshot.id
    assertUser(data)
    return data
  },
  toFirestore: (model: User) => model,
}

export function assertPublicProfile(data: any): asserts data is PublicProfile {
  const d = data as Partial<PublicProfile>
  if (
    !(
      typeof d?.nickname === 'string' &&
      typeof d?.thumbnail_url === 'string' &&
      typeof d?.score === 'number' &&
      d?.created instanceof Timestamp &&
      d?.updated instanceof Timestamp
    )
  ) {
    throw new Error('data is not PublicProfile type')
  }
}

export const publicProfileConverter: FirestoreDataConverter<PublicProfile> = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)
    data.id = snapshot.id
    assertPublicProfile(data)
    return data
  },
  toFirestore: (model: PublicProfile) => model,
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
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)
    data.id = snapshot.id
    assertTask(data)
    return data
  },
  toFirestore: (model: Task) => model,
}

export function assertPurchase(data: any): asserts data is Purchase {
  const d = data as Partial<Purchase>
  if (
    !(
      d?.task_ref instanceof DocumentReference &&
      typeof d?.task_completed === 'boolean' &&
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
    data.id = snapshot.id
    assertPurchase(data)
    return data as Purchase
  },
  toFirestore: (model: Purchase) => model,
}
