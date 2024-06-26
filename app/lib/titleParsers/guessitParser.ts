import { GUESSIT_URL } from "../env.server"
import slugFromShow from "../slugFromShow"
import { ContentCategory, type OptionalTvInfo, type MinimalMediaInfo } from "../types"

export type GuessitResponse = {
  type: 'episode' | 'movie'
  title: string
  alternative_title?: string
  container?: string
  mimetype?: string
  date?: string
  year?: number
  week?: number
  season?: number | number[]
  episode?: number | number[]
  episode_title?: string
  screen_size?: string
  release_group?: string
  website?: string
  streaming_service?: string
  source?: string
  video_codec?: string
  video_profile?: string
  audio_codec?: string
  audio_channels?: string
  color_depth?: string
  country?: string
  language?: string | string[]
  subtitle_language?: string
}

export async function asyncGuessitParser(
  title: string,
  category: ContentCategory
): Promise<null | GuessitResponse & MinimalMediaInfo & OptionalTvInfo> {
  const res = await fetch(`${GUESSIT_URL}/?filename=${title}`)
  if (!res.ok) {
    console.error(`Error ${res.status} ${res.statusText} guessit URL for title "${title}"`)
    return null
  }

  const json = await res.json() as GuessitResponse
  if (!json || !json.screen_size || !json.title || !json.type) {
    return null
  }

  const slug = slugFromShow(json.title)
  if (category === ContentCategory.MOVIES && json.type === 'movie') {
    return {
      ...json,
      slug,
      key: slug,
      quality: json.screen_size,
      episode: undefined,
      season: undefined,
    } satisfies GuessitResponse & MinimalMediaInfo & OptionalTvInfo
  }
  if (category !== ContentCategory.MOVIES && json.type === 'movie') {
    console.error(`[getTitleParser] Filtering out type "movie" torrent: "${title}"`)
    return null
  }

  const isPack = Array.isArray(json.season) || Array.isArray(json.episode)
  const episode = json.episode || Number(json.episode_title) || undefined
  if (isPack || !episode) {
    console.error(`[getTitleParser] Filtering out torrent that is a pack: "${title}"`)
    return null
  }

  return {
    ...json,
    slug,
    key: `${slug}-S${json.season || 1}E${json.episode}`,
    quality: json.screen_size,
    episode: episode as number | undefined,
    season: json.season as number | undefined,
  } satisfies GuessitResponse & MinimalMediaInfo & OptionalTvInfo
}
