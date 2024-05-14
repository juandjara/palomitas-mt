import { providerMap } from "@/lib/getTorrentProvider"

export async function loader() {
  const entries = [...providerMap.entries()]
  .map(e => {
    return [
      e[0],
      e[1].map(p => ({
        id: p.id,
        label: p.label
      }))
    ]
  })

  return Object.fromEntries(entries) as Record<string, { id: string, label: string }[]>
}
