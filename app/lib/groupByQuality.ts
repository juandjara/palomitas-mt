import groupBy from "./groupBy"
import type { MinimalMediaInfo, Torrent } from "./types"

type OptionalTvInfo = {
  season?: number
  episode?: number | string
  episode_title?: string
}

export default function groupByQuality(torrents: (MinimalMediaInfo & OptionalTvInfo & { torrent: Torrent })[]) {
  const grouped = groupBy(torrents, t => t.key)
  return Object.values(grouped).map(group => {
    const { quality, torrent, season, episode, episode_title, key, slug, ...info } = group[0]
    const data = {
      key,
      slug,
      season,
      episode,
      episode_title,
      torrents: {
        [quality]: [
          { 
            ...torrent,
            title_parts: { key, slug, season, episode, episode_title, ...info }
          }
        ]
      }
    }
    for (const item of group.slice(1)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { quality, torrent, ...item_info } = item
      data.torrents[quality] = data.torrents[quality] || []
      data.torrents[quality].push({
        ...item.torrent,
        title_parts: item_info as any
      })
    }
    return data
  })
}
