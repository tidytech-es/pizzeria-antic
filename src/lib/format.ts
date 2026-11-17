import type { Lang } from '@/i18n/dictionary'

const formatters: Record<Lang, Intl.NumberFormat> = {
  ca: new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR' }),
  es: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }),
}

export const formatPrice = (value: number, lang: Lang) => formatters[lang].format(value)

export const formatRating = (value: number, lang: Lang) =>
  value.toLocaleString(lang === 'ca' ? 'ca-ES' : 'es-ES', { minimumFractionDigits: 1 })
