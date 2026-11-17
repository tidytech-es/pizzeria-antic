import { ArrowDown, Bike, CupSoda, Phone, ShoppingBag, Utensils } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { business } from '@/data/business'
import { formatRating } from '@/lib/format'
import { Stars } from './ui'
import Lights from './Lights'
import { LogoBadge } from './Logo'

export default function Hero() {
  const { t, lang } = useLanguage()
  const serviceIcons = [Utensils, ShoppingBag, Bike]

  return (
    <section id="top" className="relative overflow-hidden bg-charcoal pb-16 pt-2 text-cream sm:pb-24">
      <Lights className="absolute inset-x-0 top-0 h-14 opacity-90 sm:h-20" />
      {/* Resplendor càlid de foc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-[-10%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(232,163,61,0.22),rgba(200,62,43,0.10)_45%,transparent_70%)]"
      />

      <div className="container-page relative grid items-center gap-12 pt-16 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <h1 className="text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.025em] text-balance sm:text-6xl lg:text-[4.1rem]">
            {t.hero.titleA} <em className="font-medium text-[#F08A72]">{t.hero.titleB}</em>{' '}
            <span className="text-cream/90">{t.hero.titleC}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/70 text-pretty">{t.hero.subtitle}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={business.maps.place}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl border border-cream/15 bg-cream/5 px-4 py-2.5 transition duration-150 ease-out active:scale-[0.97] hover:bg-cream/10"
            >
              <span className="font-serif text-2xl font-semibold">{formatRating(business.rating.score, lang)}</span>
              <span className="flex flex-col">
                <Stars value={business.rating.score} />
                <span className="text-xs text-cream/60">
                  {business.rating.reviews} {t.hero.rating} · Google
                </span>
              </span>
            </a>
            <p className="inline-flex max-w-xs items-center gap-2.5 rounded-2xl bg-ember/15 px-4 py-2.5 text-sm font-medium text-[#FFD98A]">
              <CupSoda size={18} className="shrink-0" />
              {t.hero.promo}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap [&>a]:whitespace-nowrap">
            <a
              href="#carta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-7 py-4 text-base font-semibold text-charcoal shadow-soft transition duration-150 ease-out active:scale-[0.97] hover:bg-white"
            >
              {t.hero.seeMenu}
              <ArrowDown size={18} />
            </a>
            <a
              href={business.phone.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-7 py-4 text-base font-semibold text-cream shadow-soft transition duration-150 ease-out active:scale-[0.97] hover:bg-tomato-dark"
            >
              <Phone size={18} />
              {t.hero.call} <span className="opacity-90">({business.phone.display})</span>
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-cream/70">
            {t.hero.services.map((s, i) => {
              const Icon = serviceIcons[i]
              return (
                <li key={s} className="inline-flex items-center gap-2">
                  <Icon size={16} className="text-ember" />
                  {s}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-lift sm:aspect-square lg:aspect-[4/5]">
            <img
              src="/images/pizza-forn.webp"
              alt={t.hero.imageAlt}
              width={1360}
              height={907}
              className="h-full w-full bg-stone-deep object-cover object-[68%_center]"
              {...{ fetchpriority: 'high' }}
            />
          </div>
          <div className="absolute -left-4 -top-6 hidden rounded-full bg-charcoal p-1.5 text-cream shadow-lift sm:block lg:-left-8">
            <LogoBadge size={104} title="" />
          </div>
        </div>
      </div>
    </section>
  )
}
