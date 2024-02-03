import { getCacheData, setCacheData } from '@/lib/cache'
import { ContentCategory } from '../types'
import { animeMap } from '@/lib/config/animeMap'
import { KITSU_URL } from '@/lib/env.server'

function formatKitsuResponse(meta: any) {
  return {
    id: meta.id,
    canonicalTitle: meta.canonicalTitle,
    titles: meta.titles,
    abbreviatedTitles: meta.abbreviatedTitles,
    description: meta.synopsis,
    startDate: meta.startDate,
    endDate: meta.endDate,
    status: meta.status,
    posterImage: meta.posterImage,
    coverImage: meta.coverImage,
    episodeCount: meta.episodeCount,
    episodeLength: meta.episodeLength,
    youtubeVideoId: meta.youtubeVideoId
  }
}

type KitsuResponse = ReturnType<typeof formatKitsuResponse>

export async function searchAnime(slug: string) {
  if (animeMap.has(slug)) {
    slug = animeMap.get(slug)!
  }

  const cached = await getCacheData(ContentCategory.ANIME, slug) as KitsuResponse | null
  if (cached) {
    return {
      from_cache: true,
      ...cached
    }
  }

  const res = await fetch(`${KITSU_URL}/api/edge/anime?filter[text]=${slug}`)
  if (!res.ok) {
    throw new Error(`[kitsuProvider] Invalid status code calling Kitsu API: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()

  if (!json.data.length) {
    throw new Error(`[kitsuProvider] Anime not found for slug "${slug}"`)
  }

  const data = {
    ...json.data[0].attributes,
    id: json.data[0].id
  }

  const metadata = formatKitsuResponse(data)
  await setCacheData(ContentCategory.ANIME, slug, metadata)

  return {
    from_cache: false,
    ...metadata
  }
}

async function getAnimeDetails(id: string) {
  const res = await fetch(`https://kitsu.io/api/edge/anime/${id}`)
  if (!res.ok) {
    throw new Error(`[kitsuProvider] Invalid status code calling Kitsu API: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  const data = {
    ...json.data.attributes,
    id: json.data.id
  }

  return data
}

export default {
  id: 'kitsu',
  search: async (slug: string) => {
    try {
      const metadata = await searchAnime(slug)
      return metadata
    } catch (err) {
      console.error(err)
      return {
        id: null,
        from_cache: false,
        error: true,
        error_message: err instanceof Error ? err.message : String(err)
      }
    }
  },
  detail: async (slug: string) => {
    const { id } = await searchAnime(slug)
    const details = await getAnimeDetails(id)
    return details
  }
}
