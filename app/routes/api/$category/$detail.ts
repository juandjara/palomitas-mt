import wrapAsync from '@/lib/wrapAsync'
import isValidCategory from "@/lib/isValidCategory"
import { ContentCategory } from "@/lib/types"
import getTorrentProvider from "@/lib/getTorrentProvider"
import getMetadataProvider from "@/lib/getMetadataProvider"
import type { LoaderArgs } from '@remix-run/node'

const DEFAULT_PAGE = 1
const DEFAULT_RPP = 20

const handler = wrapAsync(async (req: Request, params: Record<string, string | undefined>) => {
  const category = params.category
  if (!isValidCategory(category)) {
    const validCategories = [
      ContentCategory.TV,
      ContentCategory.ANIME,
      ContentCategory.MOVIES
    ]
    throw new Error(`Invalid category found in URL: "${category}". Valid categories are ${validCategories.join(', ')}`)
  }

  const slug = params.detail || ''
  const sp = new URL(req.url).searchParams
  const providerId = sp.get('tp')
  const torrentProvider = getTorrentProvider(category, providerId)
  const torrents = await torrentProvider.search({
    page: DEFAULT_PAGE,
    rpp: DEFAULT_RPP,
    query: slug
  })

  const first = torrents[0]
  if (!first) {
    throw new Error(`[detail] No torrents found for slug "${slug}"`)
  }

  const torrentsWithInfo = torrentProvider.processList(torrents)
  const groups = torrentProvider.groupByQuality(torrentsWithInfo)
  const metadataProvider = getMetadataProvider(category)
  const show = await metadataProvider.fetchDetail(slug)

  return { show, episodes: groups }
})

export async function loader({ request, params }: LoaderArgs) {
  return handler(request, params)
}
