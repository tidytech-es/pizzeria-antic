import { useState } from 'react'
import { Check, Plus, WheatOff } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { useOrder, type AddOptions } from '@/context/OrderContext'
import { sauces, specialOptions, type MenuItem } from '@/data/menu'
import { allergenInfo } from '@/data/allergens'
import { formatPrice } from '@/lib/format'

interface Chip {
  key: string
  label: string
  price: number
  options: AddOptions
  gf?: boolean
}

export function AllergenDots({ item }: { item: MenuItem }) {
  const { t, l } = useLanguage()
  if (!item.allergens?.length) return null
  return (
    <ul className="flex flex-wrap items-center gap-1" aria-label={t.menu.allergensTitle}>
      {item.allergens.map((a) => (
        <li key={a} title={l(allergenInfo[a].label)} className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: allergenInfo[a].color }}>
          <span className="sr-only">{l(allergenInfo[a].label)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function MenuRow({ item }: { item: MenuItem }) {
  const { t, l, lang } = useLanguage()
  const { add } = useOrder()
  const [sauce, setSauce] = useState(sauces[0].id)
  const [flash, setFlash] = useState<string | null>(null)

  const gfOption = specialOptions.glutenFreeDough
  const base = item.hasSauce ? { sauce } : {}

  const chips: Chip[] = item.variants.map((v) => ({
    key: v.id,
    label: t.variants[v.id],
    price: v.price,
    options: { variant: v.id, ...base },
  }))
  const mitjana = item.variants.find((v) => v.id === 'mitjana')
  if (item.allowsGlutenFreeDough && gfOption.available && mitjana) {
    chips.push({
      key: 'sg',
      label: t.variants.sg,
      price: mitjana.price + gfOption.surcharge,
      options: { variant: 'mitjana', glutenFree: true },
      gf: true,
    })
  }

  const handleAdd = (chip: Chip) => {
    add(item.id, chip.options)
    setFlash(chip.key)
    window.setTimeout(() => setFlash((f) => (f === chip.key ? null : f)), 1100)
  }

  return (
    <article
      className={`flex flex-col gap-3 border-b border-stone-deep/70 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 ${
        item.available ? '' : 'opacity-55'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-serif text-lg leading-snug font-semibold">{l(item.name)}</h4>
          {item.isNew && (
            <span className="rounded-full bg-charcoal px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-cream">
              {t.menu.isNew}
            </span>
          )}
          {!item.available && (
            <span className="rounded-full bg-tomato/10 px-2 py-0.5 text-[0.65rem] font-semibold text-tomato">{t.menu.soldOut}</span>
          )}
        </div>
        {item.description && <p className="mt-1 text-sm leading-relaxed text-ash">{l(item.description)}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <AllergenDots item={item} />
          {item.hasSauce && (
            <label className="inline-flex items-center gap-2 text-xs font-medium text-ash">
              {t.menu.sauce}
              <select
                value={sauce}
                onChange={(e) => setSauce(e.target.value)}
                disabled={!item.available}
                className="h-10 rounded-full border border-stone-deep bg-cream px-3 text-sm font-semibold text-charcoal"
              >
                {sauces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {l(s.label)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {/* Al mòbil, totes les mides en una sola fila (columnes iguals) */}
      <div
        className={`shrink-0 gap-1.5 sm:flex sm:max-w-[17rem] sm:flex-wrap sm:justify-end sm:gap-2 ${
          chips.length === 3 ? 'grid grid-cols-3' : chips.length === 2 ? 'grid grid-cols-2 max-sm:max-w-[16rem]' : 'flex'
        }`}
      >
        {chips.map((chip) => {
          const done = flash === chip.key
          return (
            <button
              key={chip.key}
              type="button"
              disabled={!item.available}
              onClick={() => handleAdd(chip)}
              aria-label={`${t.menu.addHint}: ${l(item.name)}${chip.label ? ` ${chip.label}` : ''}, ${formatPrice(chip.price, lang)}`}
              className={`group inline-flex min-h-11 items-center justify-between gap-2 rounded-2xl border px-2.5 py-1.5 text-left transition duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed sm:rounded-full sm:px-3 ${
                done
                  ? 'border-basil bg-basil text-cream'
                  : chip.gf
                    ? 'border-basil/30 bg-basil-light/60 text-basil hover:border-basil hover:bg-basil hover:text-cream'
                    : 'border-stone-deep bg-cream text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream'
              }`}
            >
              <span className="flex min-w-0 flex-col leading-tight">
                {chip.label && (
                  <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold whitespace-nowrap opacity-75 sm:text-[0.66rem] sm:uppercase sm:tracking-wider">
                    {chip.gf && <WheatOff size={11} className="hidden shrink-0 sm:block" />}
                    {chip.label}
                  </span>
                )}
                <span className="text-sm font-bold tabular-nums">{formatPrice(chip.price, lang)}</span>
              </span>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black/5 group-hover:bg-white/15 sm:h-6 sm:w-6">
                {done ? <Check size={12} /> : <Plus size={12} />}
              </span>
            </button>
          )
        })}
      </div>
    </article>
  )
}
