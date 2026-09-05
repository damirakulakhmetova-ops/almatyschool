import { useEffect, useMemo, useState } from 'react'
import type { School } from '../shared/school'
import './App.css'

const typeLabels: Record<School['type'], string> = {
  school: 'Школа',
  gymnasium: 'Гимназия',
  lyceum: 'Лицей',
  private: 'Частная школа',
}

function App() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('')

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
    () => Array.from(new Set(schools.map((s) => s.district))).sort(),
    [schools],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return schools.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false
      if (district && s.district !== district) return false
      return true
    })
  }, [schools, query, district])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Школы Алматы</h1>
        <p>Агрегатор школ, гимназий и лицеев города Алматы</p>
      </header>

      <div className="controls">
        <input
          type="search"
          placeholder="Поиск по названию…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">Все районы</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Загрузка…</p>}
      {error && <p className="error">Ошибка загрузки: {error}</p>}

      <ul className="school-list">
        {filtered.map((school) => (
          <li key={school.id} className="school-card">
            <h2>{school.name}</h2>
            <div className="school-meta">
              <span className="badge">{typeLabels[school.type]}</span>
              <span>{school.district} р-н</span>
              <span>{school.grades} классы</span>
            </div>
            <div className="school-langs">
              {school.languages.map((lang) => (
                <span key={lang} className="lang">
                  {lang}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {!loading && filtered.length === 0 && <p>Ничего не найдено.</p>}
    </div>
  )
}

export default App
