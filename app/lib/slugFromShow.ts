export default function slugFromShow(show: string) {
  let slug = show.replace(/[^a-zA-Z0-9 ]/gi, "").replace(/\s+/g, "-").toLowerCase()
  if (slug.endsWith('-')) {
    slug = slug.substring(0, slug.length - 1)
  }
  return slug
}
