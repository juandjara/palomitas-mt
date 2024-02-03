import { ContentCategory } from '@/lib/types'
import NyaaProvider from '@/lib/torrentProviders/nyaaProvider'
import type AbstactTorrentProvider from '@/lib/torrentProviders/AbstactTorrentProvider'
import TVProvider, { TVProviderService } from './torrentProviders/tvProvider'

export const providerMap = new Map<string, AbstactTorrentProvider[]>([
  [ContentCategory.ANIME, [
    new NyaaProvider({ user: 'Erai-raws', label: 'Erai Raws - eng' }),
    new NyaaProvider({ user: 'puyero', label: 'PuyaSubs - esp' }),
    new NyaaProvider({ user: 'Mayansito', label: 'CameEsp - esp' }),
    new NyaaProvider({ user: 'SubsPlease', label: 'SubsPlease - eng' }),
  ]],
  [ContentCategory.TV, [
    new TVProvider({ label: 'BitSearch', service: TVProviderService.BITSEARCH }),
    new TVProvider({ label: 'RARBG', service: TVProviderService.RARBG }),
    new TVProvider({ label: 'TorrentGalaxy', service: TVProviderService.TORRENTGALAXY }),
  ]],
  [ContentCategory.MOVIES, []]
])

/**
 * Return default / selected provider for a content category
 * @param category Category selected in URL
 * @param cookies Parsed cookies object from request headers. Used to switch default provider for a category when there is more than one.
 */
export default function getTorrentProvider(category: ContentCategory, providerId: string | null) {
  const categoryProviders = providerMap.get(category)
  if (!categoryProviders || !categoryProviders.length) {
    throw new Error(`There are no providers for category "${category}"`)
  }

  const selectedProvider = providerId
    ? categoryProviders.find(p => p.id === providerId)
    : categoryProviders[0]

  if (!selectedProvider) {
    throw new Error(`[getTorrentProvider] Provider "${providerId}" not found for category "${category}"`)
  }

  return selectedProvider
}

