import { ContentCategory, type MinimalMediaInfo } from "./types"
import animeTitleParser from "./titleParsers/animeTitleParser"
import tvTitleParser from "./titleParsers/tvTitleParser"

const parserMap = {
  [ContentCategory.TV]: tvTitleParser,
  [ContentCategory.ANIME]: animeTitleParser,
  [ContentCategory.MOVIES]: null,
}

const GUESSIT_API_URL = 'http://localhost:5000'

function slugFromShow(show: string) {
  let slug = show.replace(/[^a-zA-Z0-9 ]/gi, "").replace(/\s+/g, "-").toLowerCase()
  if (slug.endsWith('-')) {
    slug = slug.substring(0, slug.length - 1)
  }
  return slug
}

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
  language?: string
  subtitle_language?: string
}

export default function getTitleParser(category: ContentCategory) {
  const parser = parserMap[category]
  return async (title: string) => {
    const res = await fetch(`${GUESSIT_API_URL}/?filename=${title}`)
    if (!res.ok) {
      console.error(`Error ${res.status} ${res.statusText} guessit URL for title "${title}"`)
      return parser ? parser(title) : null
    }

    const json = await res.json() as GuessitResponse
    if (!json || !json.screen_size || !json.title || !json.type) {
      return parser ? parser(title) : null
    }

    const slug = slugFromShow(json.title)
    if (category === ContentCategory.MOVIES && json.type === 'movie') {
      return {
        ...json,
        slug,
        key: slug,
        quality: json.screen_size,
      } satisfies MinimalMediaInfo
    }
    if (category !== ContentCategory.MOVIES && json.type === 'movie') {
      console.error(`[getTitleParser] Filtering out type "movie" torrent: "${title}"`)
      return null
    }

    const isPack = Array.isArray(json.season) || Array.isArray(json.episode)
    const episode = json.episode || json.episode_title
    if (isPack || !episode) {
      console.error(`[getTitleParser] Filtering out torrent that is a pack: "${title}"`)
      return null
    }

    return {
      ...json,
      slug,
      key: `${slug}-S${json.season}E${json.episode}`,
      quality: json.screen_size,
      episode: episode as number | string,
    } satisfies MinimalMediaInfo & { episode: number | string }
  }
}
