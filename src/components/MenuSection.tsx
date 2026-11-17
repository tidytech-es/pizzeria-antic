import { useMemo, useState } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'
import { categories, menu, supplements, type CategoryId, type FilterId } from '@/data/menu'
import { allergenInfo, allergenOrder } from '@/data/allergens'
import { SectionHeading } from './ui'
import GlutenNotice from './GlutenNotice'
import MenuRow from './MenuRow'

export default function MenuSection() {
  const { t, l } = useLanguage()
  const [filter, setFilter] = useState<FilterId>('totes')

  const groups = useMemo(() => {
    const ids = categories.map((c) => c.id).filter((id): id is CategoryId => id !== 'totes')
    return ids
      .filter((id) => filter === 'totes' || id === filter)
      .map((id) => ({ category: categories.find((c) => c.id === id)!, items: menu.filter((m) => m.category === id) }))
      .filter((g) => g.items.length > 0)
  }, [filter])

  return (
    <section id="carta" aria-labelledby="carta-title" className="bg-stone py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="carta-title" title={t.menu.title} subtitle={t.menu.subtitle} />

        <div className="mt-10">
          <GlutenNotice />
        </div>

        <div
          role="tablist"
          aria-label={t.menu.filterLabel}
          className="sticky top-[4.5rem] z-20 -mx-4 mt-10 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-stone/95 px-4 py-3 backdrop-blur sm:mx-0 sm:flex-wrap sm:justify-center sm:rounded-full sm:px-3"
        >
          {categories.map((c) => {
            const active = filter === c.id
            const count = c.id === 'totes' ? menu.length : menu.filter((m) => m.category === c.id).length
            return (
              <button
                key={c.id}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls="carta-llista"
                onClick={() => setFilter(c.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition duration-150 ease-out active:scale-[0.97] ${
                  active
                    ? 'border-charcoal bg-charcoal text-cream'
                    : 'border-stone-deep bg-cream text-ash hover:border-charcoal/40 hover:text-charcoal'
                }`}
              >
                {l(c.label)}
                <span className={`ml-1.5 text-xs ${active ? 'text-cream/60' : 'text-ash/70'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        <div id="carta-llista" key={filter} role="tabpanel" className="animate-fade-in mt-8 space-y-12">
          {groups.length === 0 && <p className="text-center text-ash">{t.menu.empty}</p>}
          {groups.map(({ category, items }) => (
            <div key={category.id} className="rounded-2xl bg-cream p-4 shadow-soft sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-charcoal pb-3">
                <h3 className="text-2xl font-semibold sm:text-3xl">{l(category.label)}</h3>
                {category.note && <p className="text-xs font-semibold uppercase tracking-wider text-ash">{l(category.note)}</p>}
              </div>
              <div className="grid lg:grid-cols-2 lg:gap-x-10">
                {items.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-charcoal p-6 text-cream sm:p-8">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-cream/70">{t.menu.supplementsTitle}</h3>
            <ul className="mt-4 divide-y divide-cream/10 text-sm">
              {supplements.map((s) => (
                <li key={s.label.ca} className="flex justify-between gap-4 py-2">
                  <span>{l(s.label)}</span>
                  <span className="font-semibold tabular-nums">{l(s.price)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-cream p-6 shadow-soft sm:p-8">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-ash">{t.menu.allergensTitle}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
              {allergenOrder.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/10" style={{ backgroundColor: allergenInfo[a].color }} aria-hidden="true" />
                  {l(allergenInfo[a].label)}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-ash">{t.menu.allergensNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
