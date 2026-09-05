import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { School } from '../shared/school'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ThemeToggle } from '@/components/theme-toggle'

const typeLabels: Record<School['type'], string> = {
  school: 'Школа',
  gymnasium: 'Гимназия',
  lyceum: 'Лицей',
}

const fundingLabels: Record<School['funding'], string> = {
  public: 'Государственная',
  private: 'Частная',
}

const ALL_DISTRICTS = 'all'

function App() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState(ALL_DISTRICTS)

  useEffect(() => {
    fetch('/api/schools')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<School[]>
      })
      .then(setSchools)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const districts = useMemo(
    () =>
      Array.from(new Set(schools.map((s) => s.district).filter((d): d is string => d !== null))).sort(),
    [schools],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return schools.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false
      if (district !== ALL_DISTRICTS && s.district !== district) return false
      return true
    })
  }, [schools, query, district])

  return (
    <div className="mx-auto min-h-svh max-w-3xl px-4 py-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Школы Алматы
          </h1>
          <p className="mt-1 text-muted-foreground">
            Агрегатор школ, гимназий и лицеев города Алматы · {schools.length} школ
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск по названию…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={district} onValueChange={(value) => setDistrict(value ?? ALL_DISTRICTS)}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Все районы">
              {(value: unknown) => (value === ALL_DISTRICTS ? 'Все районы' : String(value))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_DISTRICTS}>Все районы</SelectItem>
            {districts.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && <p className="text-muted-foreground">Загрузка…</p>}
      {error && <p className="text-destructive">Ошибка загрузки: {error}</p>}

      <div className="flex flex-col gap-3">
        {filtered.map((school) => (
          <Card key={school.id} className="gap-2 py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-base">{school.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{typeLabels[school.type]}</Badge>
                <Badge variant="outline">{fundingLabels[school.funding]}</Badge>
                {school.district && <span>{school.district} р-н</span>}
                {school.grades && <span>{school.grades} классы</span>}
              </div>
              {school.address && (
                <p className="text-sm text-muted-foreground">{school.address}</p>
              )}
              {school.languages.length > 0 && (
                <div className="flex gap-1.5">
                  {school.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="uppercase">
                      {lang}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-muted-foreground">Ничего не найдено.</p>
      )}
    </div>
  )
}

export default App
