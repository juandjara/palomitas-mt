import type { Torrent } from "../types"

export type ListParams = {
  page: number
  rpp: number
  query: string
}

export default abstract class AbstactTorrentProvider<AbstractConfig = Record<string, unknown>> {
  abstract id: string
  abstract label: string
  config: AbstractConfig

  constructor(config?: AbstractConfig) {
    this.config = config || ({} as AbstractConfig)
  }

  abstract search(params: ListParams): Promise<Torrent[]>
}
