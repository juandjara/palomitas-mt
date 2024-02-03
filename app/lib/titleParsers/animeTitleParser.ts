export default function animeTitleParser(title: string) {
  title = title.trim().replace(/_/g, " ").replace(/\./g, " ")
  // season group can be "S2", "Season 2" or "2nd Season"
  const secondSeasonQuality = /\[.*\].(.*)\W+(S?e?a?s?o?n?\s?\d+|\d+\w{2}\sseason|Part\s\d+)\s\W\s(\d{2,})\D+(\d{3,4}p)/i // [HorribleSubs] Fairy Tail S2 - 70 [1080p].mkv
  const oneSeasonQuality = /\[.*\].(\D+)\s\W\s(\d{2,})\D+(\d{3,4}p)/i // [HorribleSubs] Gangsta - 06 [480p].mkv
  const secondSeason = /\[.*\].(\D+).(S?e?a?s?o?n?\s?\d+|\d+\w{2}\sseason)\s\W\s(\d{2,}).*\.mkv/i // [Commie] The World God Only Knows S2 - 12 [C0A4301E].mkv
  const oneSeason = /\[.*\].(\D+)\s\W\s(\d{2,}).*\.mkv/i // [Commie] Battery - 05 [38EC4270].mkv

  if (secondSeasonQuality.test(title)) {
    const parts = title.match(secondSeasonQuality)
    const [_, show, season, episode, quality] = parts!
    return processTitleParts({ regex: 'secondSeasonQuality', show, season, episode, quality })
  }
  if (oneSeasonQuality.test(title)) {
    const parts = title.match(oneSeasonQuality)
    const [_, show, episode, quality] = parts!
    return processTitleParts({ regex: 'oneSeasonQuality', show, episode, quality })
  }
  if (secondSeason.test(title)) {
    const parts = title.match(secondSeason)
    const [_, show, season, episode] = parts!
    return processTitleParts({ regex: 'secondSeason', show, season, episode })
  }
  if (oneSeason.test(title)) {
    const parts = title.match(oneSeason)
    const [_, show, episode] = parts!
    return processTitleParts({ regex: 'oneSeason', show, episode })
  }

  console.error('[animeTitleParser] Filtering out torrent that could not match any regex: ', title)
  return null
}

function processTitleParts({ regex, show, season = 'S1', episode, quality = '480p' }: Record<string, string>) {
  let slug = show.replace(/[^a-zA-Z0-9 ]/gi, "").replace(/\s+/g, "-").toLowerCase()
  if (slug.endsWith('-')) {
    slug = slug.substring(0, slug.length - 1)
  }

  return {
    regex,
    slug,
    show,
    key: `${slug}-S${season}E${episode}`,
    season: Number(season.match(/\d+/)?.[0]),
    episode: Number(episode),
    quality
  }
}
