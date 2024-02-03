import { providerMap } from "@/lib/getTorrentProvider"
import wrapAsync from "@/lib/wrapAsync"
import type { LoaderArgs } from "@remix-run/node"

export const handler = wrapAsync(() => {
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

  return Promise.resolve(Object.fromEntries(entries))
})

export async function loader({ request, params }: LoaderArgs) {
  return handler(request, params)
}
