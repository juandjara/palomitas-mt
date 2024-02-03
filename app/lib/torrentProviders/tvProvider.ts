import type { Torrent } from "../types"
import AbstactTorrentProvider, { type ListParams } from "./AbstactTorrentProvider"
import bitSearch from "./tv/bitSearch"
import rarbg from "./tv/rarbg"
import torrentGalaxy from "./tv/torrentGalaxy"

export enum TVProviderService {
  BITSEARCH = 'bitsearch',
  RARBG = 'rarbg',
  TORRENTGALAXY = 'torrentgalaxy',
}

type TVProviderConfig = {
  label: string
  service: TVProviderService
}

const serviceMap = {
  [TVProviderService.BITSEARCH]: bitSearch,
  [TVProviderService.RARBG]: rarbg,
  [TVProviderService.TORRENTGALAXY]: torrentGalaxy,
}

export default class TVProvider extends AbstactTorrentProvider<TVProviderConfig> {
  id: string
  service: (query?: string, page?: number) => Promise<Torrent[] | null>

  get label() {
    return this.config.label
  }

  constructor(config: TVProviderConfig) {
    super(config)
    this.id = `tv__${config.service}`
    this.service = serviceMap[config.service]
  }

  async search(params: ListParams) {
    const torrents = await this.service(params.query, params.page)
    return torrents || []
  }
}