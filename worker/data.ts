import type { School } from '../shared/school'

// Seed data for local development. Names are real, well-known Almaty schools,
// but address/phone/rating fields are placeholders — replace with verified
// data before shipping to production.
export const schools: School[] = [
  {
    id: 'nis-almaty',
    name: 'НИШ ФМН г. Алматы',
    type: 'lyceum',
    funding: 'public',
    district: 'Бостандыкский',
    address: 'уточняется',
    languages: ['kk', 'ru', 'en'],
    grades: '7–11',
  },
  {
    id: 'rfmsh',
    name: 'Республиканская физико-математическая школа (РФМШ)',
    type: 'lyceum',
    funding: 'public',
    district: 'Алмалинский',
    address: 'уточняется',
    languages: ['kk', 'ru'],
    grades: '8–11',
  },
  {
    id: 'ktl',
    name: 'Казахстанско-Турецкий лицей (КТЛ)',
    type: 'lyceum',
    funding: 'public',
    district: 'Медеуский',
    address: 'уточняется',
    languages: ['kk', 'ru', 'tr', 'en'],
    grades: '7–11',
  },
  {
    id: 'gymnasium-5',
    name: 'Гимназия №5',
    type: 'gymnasium',
    funding: 'public',
    district: 'Алмалинский',
    address: 'уточняется',
    languages: ['ru'],
    grades: '1–11',
  },
  {
    id: 'lyceum-165',
    name: 'Лицей №165',
    type: 'lyceum',
    funding: 'public',
    district: 'Бостандыкский',
    address: 'уточняется',
    languages: ['kk', 'ru'],
    grades: '1–11',
  },
]
