import type { Allergen, Localized } from './menu'

/** Llegenda d'al·lèrgens amb els mateixos colors que la carta impresa */
export const allergenInfo: Record<Allergen, { label: Localized; color: string }> = {
  gluten: { label: { ca: 'Gluten', es: 'Gluten' }, color: '#8A6A2E' },
  lactics: { label: { ca: 'Làctics', es: 'Lácteos' }, color: '#8C8C8C' },
  ous: { label: { ca: 'Ous', es: 'Huevos' }, color: '#F2A11F' },
  peix: { label: { ca: 'Peix', es: 'Pescado' }, color: '#1F3A93' },
  crustacis: { label: { ca: 'Crustacis', es: 'Crustáceos' }, color: '#D7263D' },
  mostassa: { label: { ca: 'Mostassa', es: 'Mostaza' }, color: '#E0457B' },
  soja: { label: { ca: 'Soja', es: 'Soja' }, color: '#1E8C4E' },
  'fruits-closca': { label: { ca: 'Fruits de closca', es: 'Frutos de cáscara' }, color: '#E8642C' },
  cacauets: { label: { ca: 'Cacauets', es: 'Cacahuetes' }, color: '#A0522D' },
  api: { label: { ca: 'Api', es: 'Apio' }, color: '#9BC53D' },
  sesam: { label: { ca: 'Grans de sèsam', es: 'Granos de sésamo' }, color: '#3FA9F5' },
  sulfits: { label: { ca: 'Diòxid de sofre i sulfits', es: 'Dióxido de azufre y sulfitos' }, color: '#8E44AD' },
}

export const allergenOrder: Allergen[] = [
  'gluten',
  'lactics',
  'ous',
  'peix',
  'crustacis',
  'mostassa',
  'soja',
  'fruits-closca',
  'cacauets',
  'api',
  'sesam',
  'sulfits',
]
