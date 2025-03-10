import { FirestoreDataConverter, Timestamp, DocumentReference } from 'firebase/firestore'
import { User, PublicProfile, Task, Purchase, Review } from '~/types/db'

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
    const data = { id: snapshot.id, ...snapshot.data() }
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

export const profileConverter: FirestoreDataConverter<PublicProfile> = {
  fromFirestore(snapshot, options) {
    const data = { id: snapshot.id, ...snapshot.data() }
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
    const data = { id: snapshot.id, ...snapshot.data() }
    assertTask(data)
    return data
  },
  toFirestore: (model: Task) => model,
}

export function assertPurchase(data: any): asserts data is Purchase {
  const d = data as Partial<Purchase>
  if (
    !(
      typeof d?.task === 'object' &&
      d?.task.ref instanceof DocumentReference &&
      typeof d?.task.name === 'string' &&
      typeof d?.task.thumbnail_url === 'string' &&
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
    const data = { id: snapshot.id, ...snapshot.data() }
    assertPurchase(data)
    return data
  },
  toFirestore: (model: Purchase) => model,
}

export function assertReview(data: any): asserts data is Review {
  const d = data as Partial<Review>
  if (
    !(
      typeof d?.profile === 'object' &&
      d?.profile.ref instanceof DocumentReference &&
      typeof d?.profile.nickname === 'string' &&
      typeof d?.profile.thumbnail_url === 'string' &&
      typeof d?.comment === 'string' &&
      typeof d?.rating === 'number' &&
      d?.created instanceof Timestamp &&
      d?.updated instanceof Timestamp
    )
  ) {
    throw new Error('data is not Review type')
  }
}

export const reviewConverter: FirestoreDataConverter<Review> = {
  fromFirestore(snapshot) {
    const data = { id: snapshot.id, ...snapshot.data() }
    assertReview(data)
    return data
  },
  toFirestore: (model: Review) => model,
}
