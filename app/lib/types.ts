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

export type ParsedTorrent = MinimalMediaInfo & { torrent: Torrent }

export type TorrentGroup = Omit<MinimalMediaInfo, 'quality'> & {
  torrents: Record<string, Torrent[]>
}
