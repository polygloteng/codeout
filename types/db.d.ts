import { Timestamp, DocumentReference } from 'firebase/firestore'

export interface User {
  id?: string
  github_uid: string
  github_username: string
  point: number
  created: Timestamp
  updated: Timestamp
}

export interface PublicProfile {
  id?: string
  nickname: string
  thumbnail_url: string
  score: number
  created: Timestamp
  updated: Timestamp
}

export interface Task {
  id?: string
  name: string
  description: string
  thumbnail_url: string
  repo_url: string
  point: number
  score: number
  tags: string[]
  level: number
  avg_rating: number
  created: Timestamp
  updated: Timestamp
}

export interface Purchase {
  id?: string
  task: {
    ref: DocumentReference<Task>
    name: string
    thumbnail_url: string
  }
  task_completed: boolean
  repo_url: string
  point: number
  created: Timestamp
  updated: Timestamp
}

export interface Review {
  id?: string
  profile: {
    ref: DocumentReference<PublicProfile>
    nickname: string
    thumbnail_url: string
  }
  comment: string
  rating: number
  created: Timestamp
  updated: Timestamp
}
