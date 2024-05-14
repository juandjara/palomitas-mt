export enum ContentCategory {
  TV = 'tv',
  ANIME = 'anime',
  MOVIES = 'movie'
}

export type Torrent = {
  title: string
  magnet: string
  peers: number | string
  seeds: number | string
  filesize: string
  date: string
  id: string
  uploader?: string
  category?: string
  torrent?: string
  poster?: string
}

export type ParsedEpisode = {
  quality: string
  episode: number | string
  season: number
  show: string
  key: string
  slug: string
}

export type TorrentMetadata = {
  id: string | number | null
  from_cache: boolean
  error?: boolean
  error_message?: string
  [key: string]: unknown
}

export type MinimalMediaInfo = {
  quality: string
  slug: string
  key: string
}

export type ParsedTorrent = {
  parts: MinimalMediaInfo
  torrent: Torrent
}

export type TorrentGroup = Omit<MinimalMediaInfo, 'quality'> & {
  torrents: Record<string, Torrent[]>
}

export type OptionalTvInfo = {
  season?: number
  episode?: number | string
  episode_title?: string
}

export type TVMetadata = TorrentMetadata & {
  adult: boolean
  first_air_date: string // YYYY-MM-DD
  genre_ids: number[]
  id: number
  images: {
    backdrop_w500: string
    poster_w300: string
  }
  name: string
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  backdrop_path: string
  poster_path: string
  vote_average: number
  vote_count: number
}

type KitsuImages = {
  original: string
  large: string
  small: string
  tiny: string
  meta: {
    dimensions: {
      large: {
        width: number
        height: number
      }
      small: {
        width: number
        height: number
      }
      tiny: {
        width: number
        height: number
      }
    }
  }
}

export type AnimeMetadata = TorrentMetadata & {
  abbreviatedTitles: string[]
  canonicalTitle: string
  coverImage: KitsuImages
  posterImage: KitsuImages
  description: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  episodeCount: number
  episodeLength: number
  id: string
  status: string
  titles: {
    en: string
    en_jp?: string
    en_us?: string
    ja_jp?: string
    th_th?: string
  }
  youtubeVideoId: string
}
