import { Timestamp, DocumentReference } from '@google-cloud/firestore'

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

// DocumentReferenceはクライアント用SDKとサーバー用SDKの両方で異なる定義が行われているため、
// DocumentReferenceを含む型はクライアント用とサーバー用で別々に定義する必要がある
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
