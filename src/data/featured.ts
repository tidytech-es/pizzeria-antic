import { menu, type Localized, type MenuItem } from './menu'

/**
 * Plats que giren al carrusel "Plats estrella".
 * - `id`: ha de coincidir amb un plat de menu.ts (en treu nom, descripció i preu).
 * - `image`: foto del plat vista des de dalt (es retalla en rodó sobre la taula de fusta).
 *   De moment són fotos d'estoc d'Unsplash; substitueix-les
 *   per fotos reals de les pizzes d'Antic quan en tinguis).
 * - `band`: color de la franja quan el plat és al centre (fosc: hi va text crema).
 * - `tagline`: la segona línia del títol, en lletra fina.
 * - `note`: el text de la targeta.
 */
interface FeaturedConfig {
  id: string
  image: string
  band: string
  tagline: Localized
  note: Localized
}

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=72`

const config: FeaturedConfig[] = [
  {
    id: 'antic',
    image: unsplash('photo-1593560708920-61dd98c46a4e'),
    band: '#1C1917',
    tagline: { ca: 'la que porta el nostre nom', es: 'la que lleva nuestro nombre' },
    note: {
      ca: 'Rodanxes de tomàquet, espinacs, encenalls de parmesà i un toc d’olivada: la pizza de la casa.',
      es: 'Rodajas de tomate, espinacas, virutas de parmesano y un toque de olivada: la pizza de la casa.',
    },
  },
  {
    id: 'de-foie',
    image: unsplash('photo-1555072956-7758afb20e8f'),
    band: '#7A2E3A',
    tagline: { ca: 'la més gurmet', es: 'la más gourmet' },
    note: {
      ca: 'Patata violeta, foie i un fil d’oli de tòfona sobre mozzarella. Per a les nits especials.',
      es: 'Patata violeta, foie y un hilo de aceite de trufa sobre mozzarella. Para las noches especiales.',
    },
  },
  {
    id: 'serranita',
    image: unsplash('photo-1574071318508-1cdbab80d002'),
    band: '#2E5A44',
    tagline: { ca: 'novetat de la carta', es: 'novedad de la carta' },
    note: {
      ca: 'Pernil salat i formatge de cabra: senzilla, de la terra i amb caràcter.',
      es: 'Jamón serrano y queso de cabra: sencilla, de la tierra y con carácter.',
    },
  },
  {
    id: 'la-pera',
    image: unsplash('photo-1594007654729-407eedc4be65'),
    band: '#9A5F1C',
    tagline: { ca: 'dolça i salada', es: 'dulce y salada' },
    note: {
      ca: 'Base blanca, peres al Pedro Ximénez, ceba caramel·litzada, gorgonzola i pols d’avellanes.',
      es: 'Base blanca, peras al Pedro Ximénez, cebolla caramelizada, gorgonzola y polvo de avellanas.',
    },
  },
  {
    id: 'napolitana',
    image: unsplash('photo-1595854341625-f33ee10dbf94'),
    band: '#C83E2B',
    tagline: { ca: 'la clàssica de sempre', es: 'la clásica de siempre' },
    note: {
      ca: 'Tàperes, olives negres i anxoves sobre tomàquet i mozzarella, com mana la tradició.',
      es: 'Alcaparras, aceitunas negras y anchoas sobre tomate y mozzarella, como manda la tradición.',
    },
  },
]

export interface FeaturedDish extends FeaturedConfig {
  item: MenuItem
}

/** Només plats que existeixen i estan disponibles */
export const featured: FeaturedDish[] = config.flatMap((c) => {
  const item = menu.find((m) => m.id === c.id)
  return item && item.available ? [{ ...c, item }] : []
})
