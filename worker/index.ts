import { schools } from './data'

function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...init?.headers },
  })
}

export default {
  async fetch(request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/schools' && request.method === 'GET') {
      const q = url.searchParams.get('q')?.toLowerCase()
      const district = url.searchParams.get('district')
      const type = url.searchParams.get('type')

      let results = schools
      if (q) results = results.filter((s) => s.name.toLowerCase().includes(q))
      if (district) results = results.filter((s) => s.district === district)
      if (type) results = results.filter((s) => s.type === type)

      return jsonResponse(results)
    }

    const match = url.pathname.match(/^\/api\/schools\/(.+)$/)
    if (match && request.method === 'GET') {
      const school = schools.find((s) => s.id === match[1])
      if (!school) return jsonResponse({ error: 'Not found' }, { status: 404 })
      return jsonResponse(school)
    }

    return new Response('Not found', { status: 404 })
  },
} satisfies ExportedHandler<Env>
