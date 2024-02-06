import getTorrentProvider from '@/lib/getTorrentProvider'
import getMetadataProvider from '@/lib/getMetadataProvider'
import isValidCategory from '@/lib/isValidCategory'
import { type ParsedTorrent, ContentCategory, type TorrentMetadata } from "@/lib/types"
import { type LoaderArgs } from '@remix-run/node'
import groupByQuality from '@/lib/groupByQuality'
import parseTorrentTitle from '@/lib/parseTorrentTitle'

const DEFAULT_PAGE = 1
const DEFAULT_RPP = 20

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

  const torrentProvider = getTorrentProvider(category, providerId)
  const torrents = await torrentProvider.search({
    page: Number(sp.get('page')) || DEFAULT_PAGE,
    rpp: (Number(sp.get('rpp')) || DEFAULT_RPP) * 3, // torrents will be grouped by quality, and usually every episode release has 3 qualities
    query: sp.get('q') || ''
  })

  if (nogroup) {
    return torrents
  }

  const infos = await Promise.all(
    torrents.map(t => (
      parseTorrentTitle(t.title, category, useGuessit)
    ))
  )

  const torrentsWithInfo = torrents
    .map((t, i) => infos[i] && ({ ...infos[i], torrent: t }))
    .filter(Boolean) as ParsedTorrent[]

  const uncategorized = torrentsWithInfo.filter(r => !r.slug)
  const categorized = torrentsWithInfo.filter(r => r.slug)
  const groups = groupByQuality(categorized)

  if (nometa) {
    return {
      torrentProviderId: torrentProvider.id,
      uncategorized_results: uncategorized,
      results: groups,
    }
  }

  const shows = {} as Record<string, TorrentMetadata>
  const metadataProvider = getMetadataProvider(category)
  await Promise.all(groups.map(async g => {
    const data = await metadataProvider.search(g.slug)
    shows[g.slug] = data
  }))

  return {
    metadataProviderId: metadataProvider.id,
    torrentProviderId: torrentProvider.id,
    uncategorized_results: uncategorized,
    results: groups,
    metadata: shows
  }
}
