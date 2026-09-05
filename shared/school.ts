export type SchoolType = 'school' | 'gymnasium' | 'lyceum' | 'private'
export type Funding = 'public' | 'private'

export interface School {
  id: string
  name: string
  type: SchoolType
  funding: Funding
  district: string
  address: string
  languages: string[]
  grades: string
  phone?: string
  website?: string
  rating?: number
}
