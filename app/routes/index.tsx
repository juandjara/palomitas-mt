import { providerMap } from "@/lib/getTorrentProvider"
import { ContentCategory, type AnimeMetadata, type TVMetadata, type Torrent } from "@/lib/types"
import { Form, Link, useLoaderData, useNavigation, useSearchParams, useSubmit } from "@remix-run/react"
import type { SearchResults, SearchResultsNoGroup, SearchResultsNoMeta } from './api/$category/index'
import type { LoaderArgs } from "@remix-run/node"
import isValidCategory from "@/lib/isValidCategory"
import debounce from 'just-debounce'
import { useMemo } from "react"

const categories = [
  ContentCategory.TV,
  ContentCategory.ANIME,
  ContentCategory.MOVIES,
]

export async function loader({ request }: LoaderArgs) {
  const providers = [...providerMap.entries()]
  .map(e => {
    return e[1].map(p => ({
      id: p.id,
      label: p.label,
      category: e[0]
    }))
  }).flat()

  const sp = new URL(request.url).searchParams

  const category = sp.get('category') || ContentCategory.TV
  if (!isValidCategory(category)) {
    const validCategories = [
      ContentCategory.TV,
      ContentCategory.ANIME,
      ContentCategory.MOVIES
    ]
    throw new Error(`Invalid category found in URL: "${category}". Valid categories are ${validCategories.join(', ')}`)
  }

  const url = `${new URL(request.url).origin}/api/${category}?${sp.toString()}`

  const res = await fetch(url)
  let data
  try {
    data = await res.json() as (SearchResults | SearchResultsNoGroup | SearchResultsNoMeta)
  } catch (e) {
    console.error('Error', e)
    data = null
  }

  return { providers, data }
}

export default function Index() {
  const { data, providers } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const [sp, setSearchParams] = useSearchParams()
  const category = sp.get('category') || ContentCategory.TV
  const tp = sp.get('tp') || ''
  const nogroup = sp.get('nogroup') === 'on'
  const nometa = sp.get('nometa') === 'on'
  const guessit = sp.get('guessit') === 'on'
  const query = sp.get('q') || ''
  const page = Number(sp.get('page') || '1')
  const submit = useSubmit()
  const debouncedSubmit = useMemo(() => debounce(submit, 500), [submit])

  function categoryHasProviders(category: ContentCategory) {
    return providers.some(p => p.category === category)
  }

  const isLoading = navigation.state !== 'idle'
  const isEmpty = data?.uncategorized_results?.length === 0 && (data as SearchResults)?.results?.length === 0

  return (
    <div className="px-2">
      <Form className="py-6" onChange={(ev) => {
        const data = new FormData(ev.currentTarget)
        if (category !== data.get('category')) {
          data.delete('tp')
        }
        submit(data)
      }}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div>
            <label
              htmlFor="category"
              className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Search
            </label>
            <select
              name="category"
              defaultValue={category}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {categories.map((c) => (
                <option
                  key={c}
                  value={c}
                  className="capitalize"
                  disabled={!categoryHasProviders(c)}
                >{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="tp"
              className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Search
            </label>
            <select
              name="tp"
              defaultValue={tp}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {providers.filter(p => p.category === category).map((p) => (
                <option className="capitalize" key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-grow flex gap-3">
            <div className="flex items-center gap-1">
              <input
                name="nogroup"
                type="checkbox"
                defaultChecked={nogroup}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="nogroup"
                className="text-sm font-medium text-gray-900 dark:text-gray-300"
              >nogroup</label>
            </div>
            <div className="flex items-center gap-1">
              <input
                name="nometa"
                type="checkbox"
                defaultChecked={nometa}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="nometa"
                className="text-sm font-medium text-gray-900 dark:text-gray-300"
              >nometa</label>
            </div>
            <div className="flex items-center gap-1">
              <input
                name="guessit"
                type="checkbox"
                defaultChecked={guessit}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="guessit"
                className="text-sm font-medium text-gray-900 dark:text-gray-300"
              >guessit</label>
            </div>
          </div>
        </div>
        <div className="relative flex-grow">
          <input
            name="q"
            type="search"
            defaultValue={query}
            onChange={(ev) => {
              ev.stopPropagation()
              debouncedSubmit(ev.currentTarget.form)
            }}
            className="py-4 pl-3 pr-28 block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search TV, Anime, Movies, and more..."
          />
          <button
            type="submit"
            className="flex gap-2 items-center pl-2 pr-4 py-2 absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="h-4 w-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </Form>
      {isLoading && (
        <p className="py-4 text-gray-400">... Loading</p>
      )}
      {isEmpty && (
        <p className="pb-2 text-gray-400">No results found</p>
      )}
      <div id="player" className="webtor" />
      <main className="text-slate-700 dark:text-white pb-8" style={{ opacity: isLoading ? 0.5 : 1 }}>
        <ResultsList />
        <div className="flex items-center gap-4 my-8">
          <button
            className="aria-disabled:opacity-50 aria-disabled:pointer-events-none bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={page <= 1}
            aria-disabled={page <= 1}
            onClick={() => {
              setSearchParams((params) => {
                params.set('page', String(page - 1))
                return params
              })
            }}
          >
            ⬅️ Prev page
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              setSearchParams((params) => {
                params.set('page', String(page + 1))
                return params
              })
            }}
          >
            Next page ➡️
          </button>
        </div>
        <UncategorizedList />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 container mx-auto p-3">
        <Link to="/api" className="text-blue-500 underline">API docs</Link>
      </footer>
    </div>
  )
}

function UncategorizedList() {
  const { data } = useLoaderData<typeof loader>()
  const uncategorized = data?.uncategorized_results || []

  if (!uncategorized.length) {
    return null
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Uncategorized results</h1>
      <TorrentList torrents={{ '': uncategorized }} />
    </>
  )
}

function formatEpNumber(season?: string | number, episode?: string | number) {
  if (!season) {
    return `Ep. ${episode}`
  }
  const formatedEp = typeof episode === 'number' ? String(episode).padStart(2, '0') : episode
  const formatedSeason = typeof season === 'number' ? String(season).padStart(2, '0') : season
  return `S${formatedSeason}E${formatedEp}`
}

function ResultsList() {
  const { data } = useLoaderData<typeof loader>()
  const categorized = ((data as SearchResults)?.results || [])

  const [sp] = useSearchParams()
  const category = sp.get('category') || ContentCategory.TV

  if (!categorized.length) {
    return null
  }

  const metadata = (data as SearchResults)?.metadata

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Results</h1>
      <ul className="mb-8">
        {categorized.map((ep) => (
          <li key={ep.key} className="mb-4">
            {category === ContentCategory.TV && (
              <TVEpisode ep={ep} show={metadata![ep.slug] as TVMetadata} />
            )}
            {category === ContentCategory.ANIME && (
              <AnimeEpisode ep={ep} show={metadata![ep.slug] as AnimeMetadata} />
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

type Episode = SearchResults['results'][number]

function TVEpisode({ ep, show }: { ep: Episode, show?: TVMetadata }) {
  return (
    <div className="flex items-start gap-2">
      <img
        alt=""
        src={show?.images?.backdrop_w500}
        className="block h-24 min-w-[100px] w-auto rounded-md bg-gray-100"
      />
      <div className="flex-grow">
        <h2>
          {show?.name as string || ep.slug}
        </h2>
        <p>
          {formatEpNumber(ep.season, ep.episode)}
          {' '}{ep.episode_title === ep.episode ? '' : ep.episode_title}
        </p>
        <TorrentList torrents={ep.torrents} />
      </div>
    </div>
  )
}

function AnimeEpisode({ ep, show }: { ep: Episode, show?: AnimeMetadata }) {
  return (
    <div className="flex items-start gap-2">
      <img
        alt=""
        src={show?.posterImage?.small}
        className="block h-24 min-w-[100px] w-auto rounded-md bg-gray-100"
      />
      <div className="flex-grow">
        <h2>
          {show?.titles.en as string || ep.slug}
        </h2>
        <p>
          {formatEpNumber(ep.season, ep.episode)}
          {' '}{ep.episode_title === ep.episode ? '' : ep.episode_title}
        </p>
        <TorrentList torrents={ep.torrents} />
      </div>
    </div>
  )
}

function TorrentList({ torrents }: { torrents: Record<string, Torrent[]> }) {
  return (
    <ul className="mt-2 mb-6 dark:bg-gray-700 bg-gray-100 p-2 rounded-md">
      {Object.keys(torrents).map((quality) => (
        torrents[quality].map((torrent) => (
          <li key={torrent.id} className="flex items-center gap-2">
            <span className="truncate flex-shrink min-w-0">{torrent.title}</span>
            <span className="flex-grow"></span>
            <span>{quality || ''}</span>
            -<span className="flex-shrink-0">{torrent.peers} Peers / {torrent.seeds} Seeds</span>
            -<span className="flex-shrink-0">{torrent.filesize}</span>
            -<span className="flex-shrink-0">
              {new Date(torrent.date).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
            </span>
            {torrent.magnet && (
              <a
                href={torrent.magnet}
                className="text-blue-500 hover:underline"
              >Magnet</a>
            )}
          </li>
        ))
      ))}
    </ul>
  )
}
