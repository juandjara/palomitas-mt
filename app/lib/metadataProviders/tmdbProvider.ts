import { ContentCategory } from '../types'
import { showMap } from '@/lib/config/showMap'
import { getCacheData, setCacheData } from '../cache'
import { TMDB_API_KEY, TMDB_API_URL, TMDB_IMAGE_URL } from '@/lib/env.server'

function formatTMDBResponse(data: any) {
  return {
    ...data,
    images: {
      backdrop_w500: `${TMDB_IMAGE_URL}/w500${data.backdrop_path}`,
      poster_w300: `${TMDB_IMAGE_URL}/w300${data.poster_path}`
    }
  }
}

export async function searchTMDB(slug: string) {
  if (showMap.has(slug)) {
    slug = showMap.get(slug)!
  }

  const cached = await getCacheData(ContentCategory.TV, slug)
  if (cached) {
    return {
      from_cache: true,
      ...cached
    }
  }

  const url = `${TMDB_API_URL}/search/tv?query=${slug}&api_key=${TMDB_API_KEY}&include_adult=false`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`[tmdbProvider] Invalid status code calling TMDB API: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  if (!json.results.length) {
    throw new Error(`[tmdbProvider] Show not found for slug "${slug}"`)
  }

  const metadata = formatTMDBResponse(json.results[0])
  await setCacheData(ContentCategory.TV, slug, metadata)

  return {
    from_cache: false,
    ...metadata
  }
}

async function getShowDetails(id: string) {
  const url = `${TMDB_API_URL}/tv/${id}?api_key=${TMDB_API_KEY}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`[tmdbProvider] Invalid status code calling TMDB API: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  return json
}

export default {
  id: 'tmdb',
  search: async (slug: string) => {
    try {
      const metadata = await searchTMDB(slug)
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
    const metadata = await searchTMDB(slug)
    const details = await getShowDetails(metadata.id)
    return details
  }
}
