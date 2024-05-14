import getTorrentProvider from '@/lib/getTorrentProvider'
import getMetadataProvider from '@/lib/getMetadataProvider'
import isValidCategory from '@/lib/isValidCategory'
import { ContentCategory } from '@/lib/types'
import type { TorrentMetadata, Torrent } from "@/lib/types"
import { type LoaderArgs } from '@remix-run/node'
import groupByQuality from '@/lib/groupByQuality'
import parseTorrentTitle from '@/lib/parseTorrentTitle'

const DEFAULT_PAGE = 1
const DEFAULT_RPP = 20

export type SearchResultsNoGroup = {
  torrentProviderId: string,
  uncategorized_results: Torrent[],
}

export type SearchResultsNoMeta = SearchResultsNoGroup & {
  results: ReturnType<typeof groupByQuality>,
}

export type SearchResults = SearchResultsNoMeta & {
  metadataProviderId: string,
  metadata?: Record<string, TorrentMetadata>
}

export type SearchParams = {
  category: ContentCategory
  providerId: string | null
  nogroup: boolean
  nometa: boolean
  useGuessit: boolean
  query: string
  page?: number
  rpp?: number
}

export async function search({
  category,
  providerId,
  nogroup,
  nometa,
  useGuessit,
  query,
  page = DEFAULT_PAGE,
  rpp = DEFAULT_RPP,
}: SearchParams) {
  rpp = rpp * 3 // torrents will be grouped by quality, and usually every episode release has 3 qualities
  const torrentProvider = getTorrentProvider(category, providerId)
  const torrents = await torrentProvider.search({ page, rpp, query })

  if (nogroup) {
    return {
      torrentProviderId: torrentProvider.id,
      uncategorized_results: torrents
    }
  }

  const parts = await Promise.all(
    torrents.map(t => (
      parseTorrentTitle(t.title, category, useGuessit)
    ))
  )

  const uncategorized = torrents.filter((_, i) => !parts[i]?.slug)
  const categorized = torrents
    .map((t, i) => ({
      parts: parts[i]!,
      torrent: t
    }))
    .filter((_, i) => parts[i]?.slug)

  const grouped = groupByQuality(categorized)
    .sort((a, b) => {
      if (a.key < b.key) {
        return 1
      }
      if (a.key > b.key) {
        return -1
      }
      return 0
    })

  if (nometa) {
    return {
      torrentProviderId: torrentProvider.id,
      uncategorized_results: uncategorized,
      results: grouped,
    }
  } 

  const shows = {} as Record<string, TorrentMetadata>
  const metadataProvider = getMetadataProvider(category)
  await Promise.all(grouped.map(async g => {
    const data = await metadataProvider.search(g.slug)
    shows[g.slug] = data
  }))

  return {
    metadataProviderId: metadataProvider.id,
    torrentProviderId: torrentProvider.id,
    uncategorized_results: uncategorized,
    results: grouped,
    metadata: shows
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const category = params.category
  if (!isValidCategory(category)) {
    const validCategories = [
      ContentCategory.TV,
      ContentCategory.ANIME,
      ContentCategory.MOVIES
    ]
    throw new Error(`Invalid category found in URL: "${category}". Valid categories are ${validCategories.join(', ')}`)
  }

  const sp = new URL(request.url).searchParams
  const providerId = sp.get('tp')
  const nogroup = !!sp.get('nogroup')
  const nometa = !!sp.get('nometa')
  const useGuessit = !!sp.get('guessit')

  const page = sp.get('page') ? Number(sp.get('page')) : undefined
  const rpp = sp.get('rpp') ? Number(sp.get('rpp')) : undefined
  const query = sp.get('q') || ''

  const data = await search({
    category,
    providerId,
    nogroup,
    nometa,
    useGuessit,
    page,
    rpp,
    query
  })

  return data
}
