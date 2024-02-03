import Redis from 'ioredis'
import type { ContentCategory } from './types'

const db = new Redis()

export async function getCacheData(category: ContentCategory, id: string) {
  const key = `${category}-${id}`
  const cached = await db.get(key)
  return cached && JSON.parse(cached)
}

export async function setCacheData(category: ContentCategory, id: string, data: unknown) {
  const key = `${category}-${id}`
  await db.set(key, JSON.stringify(data))
}
