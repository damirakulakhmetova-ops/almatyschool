/** Русское склонение по числу: 1 школа, 2 школы, 5 школ. */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/** Номер школы из названия: «Общеобразовательная школа №204» → «204». */
export function schoolNumber(name: string): string | null {
  const match = name.match(/№\s*(\d+)/)
  return match ? match[1] : null
}

/** Запасной вариант для школ без номера: «Abai International School» → «AI». */
export function initials(name: string): string {
  const words = name
    .replace(/[«»"'()]/g, ' ')
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
  return words.slice(0, 2).map((word) => word[0].toUpperCase()).join('')
}
