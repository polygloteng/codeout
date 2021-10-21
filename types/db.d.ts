import { Timestamp } from 'firebase/firestore'

export interface User {
  id?: string
  github_uid: string
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
