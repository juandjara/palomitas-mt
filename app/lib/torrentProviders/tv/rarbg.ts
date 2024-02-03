import { RARBG_URL } from "@/lib/env.server"
import getDOM from "@/lib/getDOM"
import { type Torrent } from "@/lib/types"

export default async function rarbg(query = "", page = 1) {
  const torrents = [] as Torrent[]

  const $ = await getDOM(`${RARBG_URL}/search/${page}/?search=${query}`)
  if (!$) return null

  $("table.lista2t tbody").each(() => {
    $("tr.lista2").each((_, el) => {
      const td = $(el).children("td")
      const Name = $(td).eq(1).find("a").attr("title")
      const DateUploaded = $(td).eq(3).text()
      const Size = $(td).eq(4).text()
      const Seeders = $(td).eq(5).find("font").text()
      const Leechers = $(td).eq(6).text()
      const Url = RARBG_URL + $(td).eq(1).find("a").attr("href")
      const Category = $(td).eq(2).find('a').text()
      const UploadedBy = $(td).eq(7).text()

      torrents.push({
        title: Name || "",
        filesize: Size,
        seeds: Seeders || '',
        peers: Leechers || '',
        date: DateUploaded,
        id: Url,
        magnet: "",
        category: Category,
        uploader: UploadedBy,
      })
    })
  })

  await Promise.all(
    torrents.map(async ({ id: url }, i) => {
      const $ = await getDOM(url)
      if (!$) return null

      torrents[i].magnet = $("tr:nth-child(1) > td:nth-child(2) > a:nth-child(3)").attr("href") || ""

      let poster = RARBG_URL + $("tr:nth-child(4) > td:nth-child(2) > img:nth-child(1)").attr('src') || ""
      if (poster.endsWith('undefined')) {
        poster = ''
      }

      torrents[i].poster = poster
    })
  )

  return torrents
}
