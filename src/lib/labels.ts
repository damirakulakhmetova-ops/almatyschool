import type { School } from '../../shared/school'

export const typeLabels: Record<School['type'], string> = {
  school: 'Школа',
  gymnasium: 'Гимназия',
  lyceum: 'Лицей',
}

export const fundingLabels: Record<School['funding'], string> = {
  public: 'Государственная',
  private: 'Частная',
}
