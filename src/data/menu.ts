/**
 * La carta de Pizzeria Antic (transcrita de la carta impresa).
 * - Per amagar un plat temporalment: `available: false` (es mostra com "Esgotat").
 * - Per desactivar la massa sense gluten (p. ex. quan s'acaba la del dia):
 *   `specialOptions.glutenFreeDough.available = false`.
 * - `allergens`: llegits de les icones de la carta impresa. Revisa'ls amb la cuina:
 *   si un plat no en té, no es mostra cap icona (no vol dir que no en tingui).
 */
export type Localized = { ca: string; es: string }

export type CategoryId =
  | 'classiques'
  | 'especialitats'
  | 'calzones'
  | 'pastes'
  | 'tambe-tenim'
  | 'postres'
  | 'begudes'

export type VariantId = 'unica' | 'mitjana' | 'familiar' | 'oberta' | 'tancada'

export type Allergen =
  | 'gluten'
  | 'lactics'
  | 'ous'
  | 'peix'
  | 'crustacis'
  | 'mostassa'
  | 'soja'
  | 'fruits-closca'
  | 'cacauets'
  | 'api'
  | 'sesam'
  | 'sulfits'

export interface Variant {
  id: VariantId
  price: number
}

export interface MenuItem {
  id: string
  category: CategoryId
  name: Localized
  description?: Localized
  variants: Variant[]
  available: boolean
  isNew?: boolean
  allergens?: Allergen[]
  /** Es pot demanar en massa sense gluten (mida petita, amb suplement) */
  allowsGlutenFreeDough?: boolean
  /** Pasta on el client tria la salsa */
  hasSauce?: boolean
}

export interface SpecialOption {
  id: string
  label: Localized
  note: Localized
  surcharge: number
  available: boolean
}

export const specialOptions = {
  glutenFreeDough: {
    id: 'gluten-free-dough',
    label: { ca: 'Pizza sense gluten (mida petita)', es: 'Pizza sin gluten (tamaño pequeño)' },
    note: { ca: 'Supl. 2,50 € · disponibilitat limitada diària', es: 'Supl. 2,50 € · disponibilidad limitada diaria' },
    surcharge: 2.5,
    available: true,
  },
  glutenFreePasta: {
    id: 'gluten-free-pasta',
    label: { ca: 'Pasta sense gluten', es: 'Pasta sin gluten' },
    note: { ca: 'Disponible', es: 'Disponible' },
    surcharge: 0,
    available: true,
  },
} satisfies Record<string, SpecialOption>

export const sauces: { id: string; label: Localized }[] = [
  { id: 'bolonyesa', label: { ca: 'Bolonyesa', es: 'Boloñesa' } },
  { id: 'ceps', label: { ca: 'Ceps', es: 'Ceps' } },
  { id: 'pesto', label: { ca: 'Pesto', es: 'Pesto' } },
  { id: 'pesto-rosso', label: { ca: 'Pesto rosso', es: 'Pesto rosso' } },
  { id: 'carbonara', label: { ca: 'Carbonara', es: 'Carbonara' } },
  { id: 'formatge', label: { ca: 'Formatge', es: 'Queso' } },
  { id: 'pernil', label: { ca: 'Pernil', es: 'Jamón' } },
]

/** Suplements de la carta (informatius; es confirmen per telèfon) */
export const supplements: { label: Localized; price: Localized }[] = [
  { label: { ca: 'Ingredient extra · pizza mitjana', es: 'Ingrediente extra · pizza mediana' }, price: { ca: '1 €', es: '1 €' } },
  { label: { ca: 'Ingredient extra · pizza familiar', es: 'Ingrediente extra · pizza familiar' }, price: { ca: '1,50 €', es: '1,50 €' } },
  { label: { ca: 'Formatge vegà i sense lactosa', es: 'Queso vegano y sin lactosa' }, price: { ca: '2 €', es: '2 €' } },
  { label: { ca: 'Pot d’olivada, oli picant…', es: 'Bote de olivada, aceite picante…' }, price: { ca: '1 €', es: '1 €' } },
  { label: { ca: 'Pizza familiar meitat i meitat', es: 'Pizza familiar mitad y mitad' }, price: { ca: '1,50 €', es: '1,50 €' } },
]

export type FilterId = CategoryId | 'totes'

export const categories: { id: FilterId; label: Localized; note?: Localized }[] = [
  { id: 'totes', label: { ca: 'Totes', es: 'Todas' } },
  {
    id: 'classiques',
    label: { ca: 'Pizzes Clàssiques', es: 'Pizzas Clásicas' },
    note: { ca: 'Mitjana 33 cm · Familiar 40 cm', es: 'Mediana 33 cm · Familiar 40 cm' },
  },
  {
    id: 'especialitats',
    label: { ca: 'Especialitats de la Casa', es: 'Especialidades de la Casa' },
    note: { ca: 'Mitjana 33 cm · Familiar 40 cm', es: 'Mediana 33 cm · Familiar 40 cm' },
  },
  { id: 'calzones', label: { ca: 'Calzones', es: 'Calzones' }, note: { ca: 'Oberta o tancada', es: 'Abierta o cerrada' } },
  {
    id: 'pastes',
    label: { ca: 'Pastes', es: 'Pastas' },
    note: { ca: 'Acompanya la teva pasta amb les nostres salses', es: 'Acompaña tu pasta con nuestras salsas' },
  },
  { id: 'tambe-tenim', label: { ca: 'També tenim', es: 'También tenemos' } },
  { id: 'postres', label: { ca: 'Postres', es: 'Postres' } },
  { id: 'begudes', label: { ca: 'Begudes', es: 'Bebidas' } },
]

// ─── Ajudants per escriure la carta de manera compacta ──────────────
const GL: Allergen[] = ['gluten', 'lactics']
const pizza = (
  id: string,
  category: 'classiques' | 'especialitats',
  name: string | Localized,
  ca: string,
  es: string,
  mitjana: number,
  familiar: number,
  extra: Partial<MenuItem> = {},
): MenuItem => ({
  id,
  category,
  name: typeof name === 'string' ? { ca: name, es: name } : name,
  description: { ca, es },
  variants: [
    { id: 'mitjana', price: mitjana },
    { id: 'familiar', price: familiar },
  ],
  available: true,
  allergens: GL,
  allowsGlutenFreeDough: true,
  ...extra,
})
const simple = (
  id: string,
  category: CategoryId,
  name: Localized,
  price: number,
  description?: Localized,
  extra: Partial<MenuItem> = {},
): MenuItem => ({ id, category, name, description, variants: [{ id: 'unica', price }], available: true, ...extra })
const same = (s: string): Localized => ({ ca: s, es: s })

export const menu: MenuItem[] = [
  // ─── Pizzes clàssiques ────────────────────────────────────────────
  pizza('marinara', 'classiques', 'Marinara', 'Doble de tomàquet i all.', 'Doble de tomate y ajo.', 7.5, 10, { allergens: ['gluten'] }),
  pizza('margherita', 'classiques', 'Margherita', 'Tomàquet i mozzarella.', 'Tomate y mozzarella.', 8, 10.5),
  pizza('prosciutto', 'classiques', 'Prosciutto', 'Tomàquet, mozzarella i prosciutto.', 'Tomate, mozzarella y prosciutto.', 9, 12),
  pizza(
    'caprichosa',
    'classiques',
    'Caprichosa',
    'Tomàquet, mozzarella, pernil dolç, speck, xampinyons i olives negres.',
    'Tomate, mozzarella, jamón dulce, speck, champiñones y aceitunas negras.',
    10.5,
    15.5,
  ),
  pizza(
    '4-formatges',
    'classiques',
    { ca: '4 Formatges', es: '4 Quesos' },
    'Tomàquet, mozzarella, emmental, formatge blau i formatge de cabra.',
    'Tomate, mozzarella, emmental, queso azul y queso de cabra.',
    11.5,
    16,
  ),
  pizza('peperoni', 'classiques', 'Peperoni', 'Tomàquet, mozzarella i peperoni.', 'Tomate, mozzarella y peperoni.', 10.5, 14.5),
  pizza(
    'tonno-cipolla',
    'classiques',
    'Tonno e Cipolla',
    'Tomàquet, mozzarella, tonyina i ceba.',
    'Tomate, mozzarella, atún y cebolla.',
    11,
    15,
    { allergens: ['gluten', 'lactics', 'peix'] },
  ),
  pizza(
    'tropical',
    'classiques',
    'Tropical',
    'Tomàquet, mozzarella, pernil dolç, pinya i gambes.',
    'Tomate, mozzarella, jamón dulce, piña y gambas.',
    11,
    15,
    { allergens: ['gluten', 'lactics', 'crustacis'] },
  ),
  pizza(
    'noruega',
    'classiques',
    'Noruega',
    'Tomàquet, mozzarella, salsa suau de formatge, salmó, tàperes i vinagreta de mostassa.',
    'Tomate, mozzarella, salsa suave de queso, salmón, alcaparras y vinagreta de mostaza.',
    13,
    17.5,
    { allergens: ['gluten', 'lactics', 'peix', 'mostassa'] },
  ),
  pizza(
    'napolitana',
    'classiques',
    'Napolitana',
    'Tomàquet, mozzarella, tàperes, olives negres i anxoves.',
    'Tomate, mozzarella, alcaparras, aceitunas negras y anchoas.',
    12,
    16,
    { allergens: ['gluten', 'lactics', 'peix'] },
  ),
  pizza(
    'gambereti',
    'classiques',
    'Gambereti',
    'Tomàquet, mozzarella, carbassó i gambes.',
    'Tomate, mozzarella, calabacín y gambas.',
    11,
    15.5,
    { allergens: ['gluten', 'lactics', 'crustacis'] },
  ),

  // ─── Especialitats de la casa ─────────────────────────────────────
  pizza(
    'antic',
    'especialitats',
    'Antic',
    'Tomàquet, mozzarella, rodanxes de tomàquet, espinacs, encenalls de parmesà i olivada.',
    'Tomate, mozzarella, rodajas de tomate, espinacas, virutas de parmesano y olivada.',
    11,
    15,
  ),
  pizza(
    'de-lhort',
    'especialitats',
    { ca: "De l'Hort", es: 'De la Huerta' },
    'Tomàquet, mozzarella, carbassó, albergínia, pebrot verd, pebrot vermell i ceba.',
    'Tomate, mozzarella, calabacín, berenjena, pimiento verde, pimiento rojo y cebolla.',
    11,
    15,
  ),
  pizza(
    'veggie',
    'especialitats',
    'Pizza Veggie',
    'Tomàquet amb all i verdura escalivada.',
    'Tomate con ajo y verdura asada.',
    11,
    14,
    { isNew: true, allergens: undefined },
  ),
  pizza(
    'indian-curry',
    'especialitats',
    'Indian Curry',
    'Tomàquet, mozzarella, pollastre, pebrot vermell i salsa de curry.',
    'Tomate, mozzarella, pollo, pimiento rojo y salsa de curry.',
    11.5,
    15.5,
  ),
  pizza(
    'grega',
    'especialitats',
    { ca: 'Grega', es: 'Griega' },
    'Tomàquet, mozzarella, albergínia, formatge feta, ruca i vinagreta de mel.',
    'Tomate, mozzarella, berenjena, queso feta, rúcula y vinagreta de miel.',
    11,
    15.5,
  ),
  pizza(
    'montseny',
    'especialitats',
    'Montseny',
    'Tomàquet, mozzarella, verdura escalivada i botifarra.',
    'Tomate, mozzarella, verdura asada y butifarra.',
    12,
    16.5,
    { allergens: ['gluten', 'lactics', 'sulfits'] },
  ),
  pizza(
    'toscana',
    'especialitats',
    'Toscana',
    'Tomàquet, mozzarella, bresaola, búfala, ruca i encenalls de parmesà.',
    'Tomate, mozzarella, bresaola, búfala, rúcula y virutas de parmesano.',
    12.5,
    17.5,
  ),
  pizza(
    'siciliana',
    'especialitats',
    'Siciliana',
    'Tomàquet, mozzarella, prosciutto de Parma, ruca i encenalls de parmesà.',
    'Tomate, mozzarella, prosciutto de Parma, rúcula y virutas de parmesano.',
    12.5,
    17.5,
  ),
  pizza(
    'de-foie',
    'especialitats',
    'De Foie',
    'Mozzarella, patata violeta, foie i oli de tòfona.',
    'Mozzarella, patata violeta, foie y aceite de trufa.',
    14.5,
    18.5,
    { allergens: ['gluten', 'lactics', 'sulfits'] },
  ),
  pizza(
    'mallorquina',
    'especialitats',
    'Mallorquina',
    'Tomàquet, mozzarella, sobrassada i mel.',
    'Tomate, mozzarella, sobrasada y miel.',
    11,
    15.5,
  ),
  pizza(
    'new-york',
    'especialitats',
    'New York',
    'Tomàquet, mozzarella, carn picada i salsa barbacoa artesana.',
    'Tomate, mozzarella, carne picada y salsa barbacoa artesana.',
    12,
    16.5,
    { allergens: ['gluten', 'lactics', 'mostassa', 'soja', 'peix'] },
  ),
  pizza(
    'la-santa',
    'especialitats',
    'La Santa',
    'Tomàquet, mozzarella, bacó, salsa carbonara i parmesà.',
    'Tomate, mozzarella, bacon, salsa carbonara y parmesano.',
    12,
    16.5,
  ),
  pizza(
    'la-pera',
    'especialitats',
    'La Pera',
    "Base blanca, mozzarella, peres al Pedro Ximénez, ceba caramel·litzada, gorgonzola i pols d'avellanes.",
    'Base blanca, mozzarella, peras al Pedro Ximénez, cebolla caramelizada, gorgonzola y polvo de avellanas.',
    14,
    17.5,
    { isNew: true, allergens: undefined },
  ),
  pizza(
    'hot-dog',
    'especialitats',
    'Hot Dog',
    'Tomàquet, mozzarella, bacó, frankfurt i crunchy de ceba.',
    'Tomate, mozzarella, bacon, frankfurt y crunchy de cebolla.',
    10.5,
    15.5,
    { isNew: true, allergens: ['gluten', 'lactics', 'sulfits'] },
  ),
  pizza(
    'serranita',
    'especialitats',
    'Serranita',
    'Tomàquet, mozzarella, pernil salat i formatge de cabra.',
    'Tomate, mozzarella, jamón serrano y queso de cabra.',
    11,
    15.5,
    { isNew: true },
  ),
  pizza(
    'bolets',
    'especialitats',
    { ca: 'Bolets', es: 'Setas' },
    'Tomàquet, mozzarella, bolets i botifarra.',
    'Tomate, mozzarella, setas y butifarra.',
    14.5,
    18.5,
    { isNew: true },
  ),

  // ─── Calzones ─────────────────────────────────────────────────────
  {
    id: 'calzone-bomba',
    category: 'calzones',
    name: same('Calzone Bomba'),
    description: {
      ca: 'Tomàquet, mozzarella, formatge de cabra, bacó, xampinyons, ou i parmesà.',
      es: 'Tomate, mozzarella, queso de cabra, bacon, champiñones, huevo y parmesano.',
    },
    variants: [
      { id: 'oberta', price: 14.5 },
      { id: 'tancada', price: 16.5 },
    ],
    available: true,
    allergens: ['gluten', 'lactics', 'ous'],
  },
  {
    id: 'calzone-vegetal',
    category: 'calzones',
    name: same('Calzone Vegetal'),
    description: {
      ca: 'Tomàquet, mozzarella, ricotta, shiitake, carbassó i espinacs.',
      es: 'Tomate, mozzarella, ricotta, shiitake, calabacín y espinacas.',
    },
    variants: [
      { id: 'oberta', price: 12.5 },
      { id: 'tancada', price: 14.5 },
    ],
    available: true,
    allergens: GL,
  },
  {
    id: 'calzone-napolitano',
    category: 'calzones',
    name: same('Calzone Napolitano'),
    description: {
      ca: 'Tomàquet, mozzarella, pernil dolç, ou dur, ricotta i parmesà.',
      es: 'Tomate, mozzarella, jamón dulce, huevo duro, ricotta y parmesano.',
    },
    variants: [
      { id: 'oberta', price: 13.5 },
      { id: 'tancada', price: 15.5 },
    ],
    available: true,
    allergens: ['gluten', 'lactics', 'ous'],
  },

  // ─── Pastes ───────────────────────────────────────────────────────
  simple('spaghetti', 'pastes', same('Spaghetti'), 10.5, { ca: 'Amb la salsa que triïs.', es: 'Con la salsa que elijas.' }, { hasSauce: true }),
  simple('penne', 'pastes', same('Penne'), 10.5, { ca: 'Amb la salsa que triïs.', es: 'Con la salsa que elijas.' }, { hasSauce: true }),
  simple('ravioli-pollastre', 'pastes', { ca: 'Ravioli de pollastre rostit', es: 'Ravioli de pollo asado' }, 13.5),
  simple('ravioli-bolets', 'pastes', { ca: 'Ravioli de bolets', es: 'Ravioli de setas' }, 13.5),
  simple('ravioli-carxofa', 'pastes', { ca: 'Ravioli de carxofa amb pernil', es: 'Ravioli de alcachofa con jamón' }, 13.5),
  simple('ravioli-provolone', 'pastes', { ca: 'Ravioli de provolone amb ceba', es: 'Ravioli de provolone con cebolla' }, 13.5),

  // ─── També tenim ──────────────────────────────────────────────────
  simple('carpaccio', 'tambe-tenim', { ca: 'Carpaccio de vedella', es: 'Carpaccio de ternera' }, 12.25, {
    ca: 'Carpaccio de vedella, ruca i encenalls de parmesà, amb llesques de pa.',
    es: 'Carpaccio de ternera, rúcula y virutas de parmesano, con rebanadas de pan.',
  }),
  simple('don-vitto', 'tambe-tenim', same('Don Vitto'), 12, {
    ca: 'Entrepà farcit de mozzarella, mandonguilles amb la seva salseta de tomàquet, mozzarella de búfala i encenalls de parmesà.',
    es: 'Bocadillo relleno de mozzarella, albóndigas con su salsita de tomate, mozzarella de búfala y virutas de parmesano.',
  }),
  simple('pa-artesa', 'tambe-tenim', { ca: 'Pa artesà cuit a forn de llenya', es: 'Pan artesano cocido en horno de leña' }, 2),

  // ─── Postres ──────────────────────────────────────────────────────
  simple(
    'pizza-dolca',
    'postres',
    { ca: 'Pizza Dolça', es: 'Pizza Dulce' },
    12,
    {
      ca: 'Base de ricotta amb nata, xocolata blanca, xocolata amb llet i coco ratllat.',
      es: 'Base de ricotta con nata, chocolate blanco, chocolate con leche y coco rallado.',
    },
    { isNew: true },
  ),
  simple('coca-forner', 'postres', { ca: 'Coca de forner', es: 'Coca de horno' }, 4),
  simple('brownie', 'postres', { ca: 'Brownie de xocolata', es: 'Brownie de chocolate' }, 5),
  simple('pastis-formatge', 'postres', { ca: 'Pastís de formatge', es: 'Tarta de queso' }, 5),
  simple('postres-artesans', 'postres', { ca: 'Postres artesans', es: 'Postres artesanos' }, 5),

  // ─── Begudes ──────────────────────────────────────────────────────
  simple('aigua', 'begudes', { ca: 'Aigua', es: 'Agua' }, 1),
  simple('moritz', 'begudes', same('Moritz'), 1.7),
  simple('moritz-7', 'begudes', same('Moritz 7'), 1.8),
  simple('moritz-epidor', 'begudes', same('Moritz Epidor'), 1.9),
  simple('lambrusco', 'begudes', same('Lambrusco'), 10.5),
  simple('coca-cola', 'begudes', same('Coca-Cola'), 1.6),
  simple('coca-cola-zero', 'begudes', same('Coca-Cola Zero'), 1.6),
  simple('fanta', 'begudes', { ca: 'Fanta llimona o taronja', es: 'Fanta limón o naranja' }, 1.6),
  simple('nestea', 'begudes', same('Nestea'), 1.6),
  simple('aquarius', 'begudes', same('Aquarius'), 1.6),
  simple('vi', 'begudes', { ca: 'Vi blanc, negre o rosat', es: 'Vino blanco, tinto o rosado' }, 9),
]
