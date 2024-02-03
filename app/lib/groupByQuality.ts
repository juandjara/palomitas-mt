import { type GuessitResponse } from "./getTitleParser"
import groupBy from "./groupBy"
import type { MinimalMediaInfo, Torrent } from "./types"

export default function groupByQuality(torrents: (MinimalMediaInfo & GuessitResponse & { torrent: Torrent })[]) {
  const grouped = groupBy(torrents, t => t.key)
  return Object.values(grouped).map(group => {
    const { quality, torrent, season, episode, episode_title, key, slug, ...info } = group[0]
    const data = {
      season, episode, episode_title, key, slug,
      torrents: {
        [quality]: [
          { 
            ...torrent,
            title_parts: { season, episode, episode_title, key, slug, ...info }
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
