export default function tvTitleParser(title: string) {
  const seasonBased = /(.*).[sS](\d{1,2})[eE](\d{2})(.*)(\d{3,4}p)/i
  const seasonBasedOld = /(.*).(\d{1,2})[x](\d{2})(.*)(\d{3,4}p)/i
  const dateBased = /(.*).(\d{4}|\d{2}).(\d{2}.\d{2})(.*)(\d{3,4}p)/i

  if (seasonBased.test(title)) {
    const [_, show, season, episode, _other, quality] = title.match(seasonBased)!
    return processTitleParts({ regex: 'seasonBased', show, season, episode, quality })
  }
  if (seasonBasedOld.test(title)) {
    const [_, show, season, episode, _other, quality] = title.match(seasonBasedOld)!
    return processTitleParts({ regex: 'seasonBasedOld', show, season, episode, quality })
  }
  if (dateBased.test(title)) {
    const [_, show, season, episode, _other, quality] = title.match(dateBased)!
    return processTitleParts({ regex: 'dateBased', show, season, episode, quality })
  }

  console.error('[tvTitleParser] Filtering out torrent that could not match any regex: ', title)
  return null
}

function processTitleParts({ regex, show, season, episode, quality }: Record<string, string>) {
  let slug = show.replace(/[^a-zA-Z0-9. ]/gi, "").replace(/[\s.]+/g, "-").toLowerCase()
  if (slug.endsWith('-')) {
    slug = slug.substring(0, slug.length - 1)
  }

  return {
    regex,
    slug,
    show,
    key: `${slug}-S${season}E${episode}`,
    season: Number(season),
    episode: isNaN(Number(episode)) ? episode : Number(episode),
    quality
  }
}
