import type { Localized } from './menu'
import type { Lang } from '@/i18n/dictionary'

/**
 * Ressenyes reals de Google Maps, citades literalment en l'idioma original
 * (només s'han escurçat amb «…» on la ressenya continuava).
 * Per afegir-ne una de nova, copia el text tal com apareix a Google.
 */
export interface Review {
  id: string
  author: string
  /** Idioma original de la ressenya (no es tradueix: és una cita) */
  lang: Lang
  /** Etiqueta nostra que resumeix el tema destacat */
  highlight: Localized
  text: string
}

export const reviews: Review[] = [
  {
    id: 'marta',
    author: 'Marta',
    lang: 'ca',
    highlight: { ca: 'La massa', es: 'La masa' },
    text:
      'El diumenge vam demanar 4 pizzes i estaven delicioses! Qualitat preu immillorable! Pizzes amb molt bon sabor. El tomàquet molt bo i la massa fina amb vores gruixudes molt ben cuita en un forn de llenya.',
  },
  {
    id: 'albert-loaso',
    author: 'Albert Loaso',
    lang: 'ca',
    highlight: { ca: 'Receptes pròpies', es: 'Recetas propias' },
    text:
      'Pizzeria cèntrica. No pertany a cap cadena. Receptes pròpies i originals. Servei eficient per recollides. Dispsen de terrassa. Parlen català. Bona relació qualitat-preu €.',
  },
  {
    id: 'yolanda-rodriguez',
    author: 'Yolanda Rodríguez',
    lang: 'es',
    highlight: { ca: 'La terrassa', es: 'La terraza' },
    text:
      'Estuvimos cenando en la terraza. Las pizzas son muy buenas, el servicio muy atento en todo momento y la relación calidad-precio muy ajustada. Volveremos!!!!',
  },
]
