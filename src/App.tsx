import { GraduationCap, Loader2, MapPin, School as SchoolIcon, Search, SearchX } from 'lucide-react'
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
import { cn } from '@/lib/utils'

const typeLabels: Record<School['type'], string> = {
  school: 'Школа',
  gymnasium: 'Гимназия',
  lyceum: 'Лицей',
}

const typeColors: Record<School['type'], string> = {
  school: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  gymnasium: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  lyceum: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
}

const fundingLabels: Record<School['funding'], string> = {
  public: 'Государственная',
  private: 'Частная',
}

const fundingColors: Record<School['funding'], string> = {
  public: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  private: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
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
    <div className="min-h-svh bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Школы Алматы
              </h1>
              <p className="mt-1 text-muted-foreground">
                Агрегатор школ, гимназий и лицеев ·{' '}
                <span className="font-medium text-foreground">{schools.length}</span> школ
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск по названию…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={district} onValueChange={(value) => setDistrict(value ?? ALL_DISTRICTS)}>
            <SelectTrigger className="sm:w-56">
              <MapPin className="size-4 text-muted-foreground" />
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

        {loading && (
          <div className="flex items-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Загрузка…
          </div>
        )}
        {error && <p className="text-destructive">Ошибка загрузки: {error}</p>}

        <div className="flex flex-col gap-3">
          {filtered.map((school) => (
            <Card
              key={school.id}
              className="gap-2 border-border/60 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="px-4">
                <CardTitle className="flex items-start gap-2 text-base">
                  <SchoolIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                  {school.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 px-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge className={cn('border-transparent font-medium', typeColors[school.type])}>
                    {typeLabels[school.type]}
                  </Badge>
                  <Badge className={cn('border-transparent font-medium', fundingColors[school.funding])}>
                    {fundingLabels[school.funding]}
                  </Badge>
                  {school.district && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {school.district} р-н
                    </span>
                  )}
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
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <SearchX className="size-8" />
            Ничего не найдено.
          </div>
        )}
      </div>
    </div>
  )
}

export default App
