import { ref, useAsync } from '@nuxtjs/composition-api'
import { Timestamp } from 'firebase/firestore'
import { SearchIndex } from 'algoliasearch/lite'

export interface AlgoliaTask {
  objectID: string
  name: string
  description: string
  thumbnail_url: string
  point: number
  score: number
  tags: string[]
  level: number
  avg_rating: number
  created: Timestamp
  updated: Timestamp
}

function queryToString(value: string | (string | null)[]): string | undefined {
  return Array.isArray(value) ? value[0] || undefined : value
}

export const useTaskSearch = (
  { $taskIndex }: { $taskIndex: SearchIndex },
  queryKeywords: string | (string | null)[]
) => {
  const tasks = ref<AlgoliaTask[]>([])
  const doSearch = async (queryKeywords: string | (string | null)[]) => {
    const keywords = queryToString(queryKeywords)
    const res = await $taskIndex.search<AlgoliaTask>(keywords || '')
    tasks.value = res.hits.map((hit) => hit)
  }
  useAsync(async () => {
    doSearch(queryKeywords)
  })
  return { tasks, doSearch }
}
