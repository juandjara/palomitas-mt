export default function wrapAsync(fn: (req: Request, params: Record<string, string | undefined>) => Promise<unknown>) {
  return async (req: Request, params: Record<string, string | undefined>) => {
    try {
      const json = await fn(req, params)
      return new Response(JSON.stringify(json), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (err) {
      console.error(err)
      return new Response(
        `Internal Server Error: \n${err instanceof Error ? err.message : String(err)}`,
        { status: 500, statusText: 'Internal Server Error' }
      )
    }
  }
}
