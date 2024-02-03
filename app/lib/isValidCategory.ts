import { ContentCategory } from "./types"

export default function isValidCategory(category?: string): category is ContentCategory {
  return [
    ContentCategory.TV,
    ContentCategory.ANIME,
    ContentCategory.MOVIES
  ].indexOf(category as ContentCategory) !== -1
}
