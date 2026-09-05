export type SchoolType = 'school' | 'gymnasium' | 'lyceum'
export type Funding = 'public' | 'private'

export interface School {
  id: string
  name: string
  type: SchoolType
  funding: Funding
  district: string | null
  address: string | null
  languages: string[]
  grades: string | null
  phone: string | null
  email: string | null
  website: string | null
  tuition: string | null
  lat: number | null
  lon: number | null
}
