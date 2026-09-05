import type { School } from '../shared/school'

function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...init?.headers },
  })
}

interface SchoolRow {
  id: string
  name: string
  type: string
  funding: string
  district: string | null
  address: string | null
  languages: string
  grades: string | null
  phone: string | null
  email: string | null
  website: string | null
  tuition: string | null
  lat: number | null
  lon: number | null
}

function rowToSchool(row: SchoolRow): School {
  return {
    ...row,
    type: row.type as School['type'],
    funding: row.funding as School['funding'],
    languages: JSON.parse(row.languages) as string[],
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/schools' && request.method === 'GET') {
      const q = url.searchParams.get('q')
      const district = url.searchParams.get('district')
      const type = url.searchParams.get('type')

      const { results } = await env.DB.prepare(
        `SELECT * FROM schools
         WHERE (?1 IS NULL OR name LIKE '%' || ?1 || '%')
         AND (?2 IS NULL OR district = ?2)
         AND (?3 IS NULL OR type = ?3)
         ORDER BY name`,
      )
        .bind(q, district, type)
        .all<SchoolRow>()

      return jsonResponse(results.map(rowToSchool))
    }

    const match = url.pathname.match(/^\/api\/schools\/(.+)$/)
    if (match && request.method === 'GET') {
      const row = await env.DB.prepare('SELECT * FROM schools WHERE id = ?')
        .bind(match[1])
        .first<SchoolRow>()
      if (!row) return jsonResponse({ error: 'Not found' }, { status: 404 })
      return jsonResponse(rowToSchool(row))
    }

    return new Response('Not found', { status: 404 })
  },
} satisfies ExportedHandler<Env>
