import { GraduationCap, MapPin, RotateCcw, Search, SearchX, TriangleAlert } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { School } from '../shared/school'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SchoolCard, SchoolCardSkeleton } from '@/components/school-card'
import { Segmented } from '@/components/segmented'
import { ThemeToggle } from '@/components/theme-toggle'
import { plural } from '@/lib/format'
import { typeLabels } from '@/lib/labels'

const ALL = 'all'

type TypeFilter = School['type'] | typeof ALL
type FundingFilter = School['funding'] | typeof ALL

const typeOptions = [
  { value: ALL, label: 'Все типы' },
  { value: 'school', label: typeLabels.school },
  { value: 'gymnasium', label: typeLabels.gymnasium },
  { value: 'lyceum', label: typeLabels.lyceum },
] as const satisfies readonly { value: TypeFilter; label: string }[]

const fundingOptions = [
  { value: ALL, label: 'Любая' },
  { value: 'public', label: 'Государственные' },
  { value: 'private', label: 'Частные' },
] as const satisfies readonly { value: FundingFilter; label: string }[]

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-heading text-2xl leading-none font-semibold tracking-tight tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function App() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState<string>(ALL)
  const [type, setType] = useState<TypeFilter>(ALL)
  const [funding, setFunding] = useState<FundingFilter>(ALL)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/schools')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<School[]>
      })
      .then(setSchools)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  const districts = useMemo(
    () =>
      Array.from(
        new Set(schools.map((s) => s.district).filter((d): d is string => d !== null)),
      ).sort((a, b) => a.localeCompare(b, 'ru')),
    [schools],
  )

  const stats = useMemo(
    () => ({
      total: schools.length,
      public: schools.filter((s) => s.funding === 'public').length,
      private: schools.filter((s) => s.funding === 'private').length,
      districts: districts.length,
    }),
    [schools, districts],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return schools.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false
      if (district !== ALL && s.district !== district) return false
      if (type !== ALL && s.type !== type) return false
      if (funding !== ALL && s.funding !== funding) return false
      return true
    })
  }, [schools, query, district, type, funding])

  const filtersActive = query !== '' || district !== ALL || type !== ALL || funding !== ALL

  const reset = () => {
    setQuery('')
    setDistrict(ALL)
    setType(ALL)
    setFunding(ALL)
  }

  return (
    <div className="min-h-svh">
      <header className="relative overflow-hidden border-b border-foreground/8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-72 bg-primary/12 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Школы Алматы
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Справочник школ, гимназий и лицеев города
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {!loading && !error && (
            <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
              <Stat value={stats.total} label="всего школ" />
              <Stat value={stats.public} label="государственных" />
              <Stat value={stats.private} label="частных" />
              <Stat value={stats.districts} label={plural(stats.districts, 'район', 'района', 'районов')} />
            </div>
          )}
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-foreground/8 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-2.5 px-4 py-3">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                aria-label="Поиск по названию школы"
                placeholder="Поиск по названию…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 rounded-xl pl-10"
              />
            </div>
            <Select value={district} onValueChange={(value) => setDistrict(value ?? ALL)}>
              <SelectTrigger aria-label="Район" className="h-10 rounded-xl sm:w-56">
                <MapPin className="size-4 text-muted-foreground" />
                <SelectValue placeholder="Все районы">
                  {(value: unknown) => (value === ALL ? 'Все районы' : String(value))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Все районы</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-0.5">
            <Segmented
              aria-label="Тип учреждения"
              value={type}
              onChange={setType}
              options={typeOptions}
            />
            <Segmented
              aria-label="Форма собственности"
              value={funding}
              onChange={setFunding}
              options={fundingOptions}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-16 text-center">
            <TriangleAlert className="size-8 text-destructive" />
            <div>
              <p className="font-heading font-medium">Не удалось загрузить список школ</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={load}>
              <RotateCcw />
              Повторить
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-8 items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  'Загрузка…'
                ) : (
                  <>
                    {filtersActive ? 'Найдено' : 'Всего'}{' '}
                    <span className="font-medium text-foreground tabular-nums">
                      {filtered.length}
                    </span>{' '}
                    {plural(filtered.length, 'школа', 'школы', 'школ')}
                  </>
                )}
              </p>
              {filtersActive && (
                <Button variant="ghost" size="sm" onClick={reset}>
                  <RotateCcw />
                  Сбросить
                </Button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {loading
                ? Array.from({ length: 9 }, (_, i) => <SchoolCardSkeleton key={i} />)
                : filtered.map((school) => <SchoolCard key={school.id} school={school} />)}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <SearchX className="size-8 text-muted-foreground" />
                <div>
                  <p className="font-heading font-medium">Ничего не найдено</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Попробуйте изменить запрос или снять фильтры
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw />
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mx-auto max-w-6xl border-t border-foreground/8 px-4 py-6 text-xs text-muted-foreground">
        Данные: open-almaty.kz и chastnye-shkoly.kz · районы определены по OpenStreetMap
      </footer>
    </div>
  )
}

export default App
