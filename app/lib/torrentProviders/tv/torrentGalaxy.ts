import { TORRENTGALAXY_URL } from "@/lib/env.server"
import getDOM from "@/lib/getDOM"
import { type Torrent } from "@/lib/types"

export default async function searchTorrentGalaxy(query = "", page = 0) {
  if (page !== 0) {
    page = Number(page) - 1
  }

  const torrents = [] as Torrent[]
  const $ = await getDOM(`${TORRENTGALAXY_URL}/torrents.php?search=${query}&sort=id&order=desc&page=${page}&c41=1&c5=1&c6=1&nox=2&nox=1`)
  if (!$) return null

  $("div.tgxtablerow.txlight").each((i, element) => {
    const title = $(element).find(":nth-child(4) div a b").text()
    const url = TORRENTGALAXY_URL + $(element).find("a.txlight").attr("href")
    const filesize = $(element).find(":nth-child(8)").text()
    const Seeders = $(element)
      .find(":nth-child(11) span font:nth-child(1)")
      .text()
    const Leechers = $(element)
      .find(":nth-child(11) span font:nth-child(2)")
      .text()
    const DateUploaded = $(element).find(":nth-child(12)").text()
    const magnet = $(element)
      .find(".tgxtablecell.collapsehide.rounded.txlight a")
      .next()
      .attr("href") || ""
    const category = $(element).find(":nth-child(1) a small").text()
    const UploadedBy = $(element).find(':nth-child(7) span a span').text()
    const Torrent = $(element).find(".tgxtablecell.collapsehide.rounded.txlight a").attr("href")
    
    const posterRegex = /\bhttps?:[^)''"]+\.(?:jpg|jpeg|gif|png)(?![a-z])/g
    let poster = ''
    poster = ($(element).attr('onmouseover'))?.match(posterRegex)?.[0] || ''
    
    torrents.push({
      title,
      filesize,
      seeds: Seeders || '',
      peers: Leechers || '',
      date: DateUploaded,
      id: url,
      magnet,
      category,
      uploader: UploadedBy,
      torrent: Torrent,
      poster
    })
  })
  return torrents
}
