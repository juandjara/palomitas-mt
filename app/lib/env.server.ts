import invariant from "tiny-invariant"
import isValidUrl from "./isValidURL"

// external services
export const REDIS_URL = process.env.REDIS_URL as string
export const GUESSIT_URL = process.env.GUESSIT_URL as string
invariant(REDIS_URL, `process.env.REDIS_URL must be defined`)
invariant(GUESSIT_URL, `process.env.GUESSIT_URL must be defined`)

// metadata providers urls
export const TMDB_API_KEY = process.env.TMDB_API_KEY as string
export const TMDB_API_URL = process.env.TMDB_API_URL as string
export const TMDB_IMAGE_URL = process.env.TMDB_IMAGE_URL as string
export const KITSU_URL = process.env.KITSU_URL as string
invariant(TMDB_API_KEY, `process.env.TMDB_API_KEY must be defined`)
invariant(isValidUrl(TMDB_API_URL), `process.env.TMDB_API_URL must be a valid URL. Received ${TMDB_API_URL}`)
invariant(isValidUrl(TMDB_IMAGE_URL), `process.env.TMDB_IMAGE_URL must be a valid URL. Received ${TMDB_IMAGE_URL}`)
invariant(isValidUrl(KITSU_URL), `process.env.KITSU_URL must be a valid URL. Received ${KITSU_URL}`)

// torrent providers urls
export const NYAA_URL = process.env.NYAA_URL as string
export const BITSEARCH_URL = process.env.BITSEARCH_URL as string
export const RARBG_URL = process.env.RARBG_URL as string
export const TORRENTGALAXY_URL = process.env.TORRENTGALAXY_URL as string
invariant(isValidUrl(NYAA_URL), `process.env.NYAA_URL must be a valid URL. Received ${NYAA_URL}`)
invariant(isValidUrl(BITSEARCH_URL), `process.env.BITSEARCH_URL must be a valid URL. Received ${BITSEARCH_URL}`)
invariant(isValidUrl(RARBG_URL), `process.env.RARBG_URL must be a valid URL. Received ${RARBG_URL}`)
invariant(isValidUrl(TORRENTGALAXY_URL), `process.env.TORRENTGALAXY_URL must be a valid URL. Received ${TORRENTGALAXY_URL}`)
