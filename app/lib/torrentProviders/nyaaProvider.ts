import { NYAA_URL } from "@/lib/env.server"
import AbstactTorrentProvider, { type ListParams } from "./AbstactTorrentProvider"
import nyaapi from 'nyaapi'

nyaapi.si.config.updateBaseUrl(NYAA_URL)

type NyaaConfig = {
  id: string
  user: string
  label: string
}

export default class NyaaProvider extends AbstactTorrentProvider<NyaaConfig> {
  id: string
  get label() {
    return `Nyaa (${this.config.label})`
  }

  constructor(config: NyaaConfig) {
    super(config)
    this.id = `nyaa__${config.id}`
  }

  async search({ page, rpp, query }: ListParams) {
    const torrents = await nyaapi.si.searchByUserAndByPage(this.config.user, query, page, rpp, {
      filter: 1, // 0 - no filter, 1 - no remakes, 2 - trusted only
      category: '1_0' // ANIME
    })
    return torrents.map(t => ({
      title: t.name,
      magnet: t.magnet,
      peers: Number(t.leechers || 0),
      seeds: Number(t.seeders || 0),
      filesize: t.filesize,
      date: t.date,
      id: t.id
    }))
  }
}
