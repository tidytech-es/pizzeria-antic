import { Info, Phone } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { specialOptions } from '@/data/menu'
import { business } from '@/data/business'

export default function GlutenNotice() {
  const { t, l } = useLanguage()
  const options = [specialOptions.glutenFreePasta, specialOptions.glutenFreeDough]

  return (
    <aside
      aria-labelledby="gluten-title"
      className="flex flex-col gap-4 rounded-2xl border border-basil/20 bg-basil-light/60 p-5 sm:flex-row sm:items-start sm:p-6"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-basil text-cream" aria-hidden="true">
        <Info size={20} />
      </span>
      <div className="flex-1">
        <h3 id="gluten-title" className="font-sans text-base font-semibold text-basil">
          {t.gluten.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-charcoal/85">{t.gluten.body}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {options.map((o) => (
            <li
              key={o.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                o.available ? 'bg-cream text-basil' : 'bg-cream text-ash line-through'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${o.available ? 'bg-basil' : 'bg-ash'}`} aria-hidden="true" />
              {l(o.label)} · {o.available ? l(o.note) : t.gluten.unavailable}
            </li>
          ))}
        </ul>
      </div>
      <a
        href={business.phone.href}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-basil/30 bg-cream px-4 py-2 text-sm font-semibold text-basil transition duration-150 ease-out active:scale-[0.97] hover:bg-basil hover:text-cream"
      >
        <Phone size={15} />
        {business.phone.display}
      </a>
    </aside>
  )
}
