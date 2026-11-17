import { Flame, Sprout, Trees, Users } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { SectionHeading } from './ui'

const OVEN_IMG = '/images/forn-taulell.webp'
const TERRACE_IMG = '/images/terrassa-capvespre.webp'

export default function OvenSection() {
  const { t } = useLanguage()
  const icons = [Flame, Sprout, Trees, Users]

  return (
    <section id="forn" aria-labelledby="forn-title" className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-lift">
            <img src={OVEN_IMG} alt={t.oven.imageAlt} loading="lazy" width={574} height={1020} className="photo-zoom h-full w-full bg-stone-deep object-cover" />
          </div>
          <div className="absolute -right-3 bottom-8 hidden w-44 overflow-hidden rounded-2xl ring-4 ring-cream shadow-lift sm:block lg:-right-8">
            <img src={TERRACE_IMG} alt={t.oven.terraceAlt} loading="lazy" width={1360} height={765} className="photo-zoom aspect-[4/3] w-full bg-stone-deep object-cover" />
          </div>
        </div>

        <div>
          <SectionHeading id="forn-title" align="left" title={t.oven.title} subtitle={t.oven.body} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {t.oven.points.map((p, i) => {
              const Icon = icons[i]
              return (
                <li key={p.title}>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-stone text-tomato">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-3 font-sans text-base font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ash">{p.text}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
