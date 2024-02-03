import { ContentCategory, type TorrentMetadata } from './types'
import kitsuProvider from '@/lib/metadataProviders/kitsuProvider'
import tmdbProvider from './metadataProviders/tmdbProvider'

export type MetadataProvider = {
  id: string,
  search: (slug: string) => Promise<TorrentMetadata>,
  detail: (slug: string) => Promise<unknown>
}

const providerMap = new Map<ContentCategory, MetadataProvider>([
  [ContentCategory.ANIME, kitsuProvider],
  [ContentCategory.TV, tmdbProvider]
])

export default function getMetadataProvider(category: ContentCategory) {
  const provider = providerMap.get(category)
  if (!provider) {
    throw new Error(`There is no metadata provider for category "${category}"`)
  }

  return provider satisfies MetadataProvider
}
