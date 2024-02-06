import { ContentCategory } from "./types"
import animeTitleParser from "./titleParsers/animeTitleParser"
import tvTitleParser from "./titleParsers/tvTitleParser"
import { asyncGuessitParser } from "./titleParsers/guessitParser"

const parserMap = {
  [ContentCategory.TV]: tvTitleParser,
  [ContentCategory.ANIME]: animeTitleParser,
  [ContentCategory.MOVIES]: null,
}

export default async function parseTorrentTitle(
  title: string,
  category: ContentCategory,
  useGuessit: boolean
) {
  if (useGuessit) {
    return asyncGuessitParser(title, category)
  }

  const parser = parserMap[category]
  if (parser) {
    return parser(title)
  }

  return null
}
