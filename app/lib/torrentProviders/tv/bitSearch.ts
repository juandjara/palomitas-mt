import { BITSEARCH_URL } from "@/lib/env.server"
import getDOM from "@/lib/getDOM"
import { type Torrent } from "@/lib/types"

export default async function searchBitSearch(query = "", page = 1) {
  const torrents = [] as Torrent[]

  const url = `${BITSEARCH_URL}/search?q=${query}&page=${page}&sort=seeders&category=1`
  console.log('BitSearch URL:', url)
  const $ = await getDOM(url)
  if (!$) return null

  $(".card.search-result").each((_, element) => {
    const title = $(element).find(".info h5 a").text().trim()
    const category = $(element).find(".category").text().trim()
    const filesize = $(element).find(".stats div").eq(1).text().trim()
    const seeds = $(element).find(".stats div").eq(2).text().trim() || 0
    const peers = $(element).find(".stats div").eq(3).text().trim() || 0
    const date = $(element).find(".stats div").eq(4).text().trim()
    const id = BITSEARCH_URL + $(element).find(".info h5 a").attr("href")
    let torrent = $(element).find('.links a').attr('href') || ''
    if (!torrent.startsWith('http')) {
      torrent = ''
    }

    let magnet = $(element).find(".links a").next().attr("href") || ''
    if (!magnet.startsWith('magnet:')) {
      magnet = ''
    }

    if (torrent || magnet) {
      torrents.push({
        title,
        filesize,
        seeds,
        peers,
        date,
        id,
        magnet,
        torrent,
        category
      })
    }
    
  })

  return torrents
}
