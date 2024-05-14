import groupBy from "./groupBy"
import type { MinimalMediaInfo, OptionalTvInfo, Torrent } from "./types"

export default function groupByQuality(torrents: ({ parts: MinimalMediaInfo & OptionalTvInfo, torrent: Torrent })[]) {
  const grouped = groupBy(torrents, t => t.parts.key)
  return Object.values(grouped).map(group => {
    const torrent = group[0].torrent
    const { quality, season, episode, episode_title, key, slug, ...info } = group[0].parts
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
    for (const { torrent, parts } of group.slice(1)) {
      const { quality, ...item_info } = parts
      data.torrents[quality] = data.torrents[quality] || []
      data.torrents[quality].push({
        ...torrent,
        title_parts: item_info as any
      })
    }
    return data
  })
}
