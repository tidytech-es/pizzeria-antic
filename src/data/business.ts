/**
 * Dades reals del negoci. Edita aquí qualsevol canvi d'horari, telèfon o adreça.
 */
export const business = {
  name: 'Pizzeria Antic',
  address: {
    street: 'Plaça Mercè Rodoreda',
    postalCode: '08470',
    city: 'Sant Celoni',
    province: 'Barcelona',
    plusCode: 'MFPQ+96',
  },
  phone: {
    display: '931 46 48 89',
    href: 'tel:+34931464889',
  },
  priceRange: '10 € – 20 €',
  /** Comptes que apareixen a la carta impresa */
  social: {
    instagram: { handle: '@pizzeriaantic', url: 'https://www.instagram.com/pizzeriaantic/' },
    facebook: { handle: 'fornantic', url: 'https://www.facebook.com/fornantic' },
  },
  rating: { score: 4.4, reviews: 411, source: 'Google' },
  timeZone: 'Europe/Madrid',
  maps: {
    place:
      'https://www.google.com/maps/search/?api=1&query=Pizzeria+Antic+Pla%C3%A7a+Merc%C3%A8+Rodoreda+08470+Sant+Celoni',
    plusCode: 'https://www.google.com/maps/search/?api=1&query=MFPQ%2B96+Sant+Celoni',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Pizzeria+Antic+Pla%C3%A7a+Merc%C3%A8+Rodoreda+08470+Sant+Celoni',
    embed:
      'https://maps.google.com/maps?q=Pizzeria%20Antic%2C%20Pla%C3%A7a%20Merc%C3%A8%20Rodoreda%2C%2008470%20Sant%20Celoni&z=17&output=embed',
  },
} as const

/**
 * Horari setmanal. 0 = diumenge … 6 = dissabte (com Date.getDay()).
 * `close` és l'hora de tancament (horari de Google Maps).
 */
export type DaySchedule = { open: string; close: string } | null

export const schedule: Record<number, DaySchedule> = {
  0: { open: '19:00', close: '23:00' },
  1: null,
  2: null,
  3: { open: '19:00', close: '23:00' },
  4: { open: '19:00', close: '23:00' },
  5: { open: '19:00', close: '23:00' },
  6: { open: '19:00', close: '23:00' },
}

/** Ordre de visualització: dilluns → diumenge */
export const weekOrder = [1, 2, 3, 4, 5, 6, 0] as const
