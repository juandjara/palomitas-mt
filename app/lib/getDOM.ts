import { load } from "cheerio"

export default async function getDOM(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
      }
    })
    if (!res.ok) {
      throw new Error(`Error fetching data from ${url}, status: ${res.status} ${res.statusText}`)
    }
    const html = await res.text()
    const $ = load(html)
    return $
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
    return null
  }
}
