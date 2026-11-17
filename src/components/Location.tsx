import { Bike, Clock, Euro, MapPin, Navigation, Phone, ShoppingBag, Utensils } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { business, schedule, weekOrder } from '@/data/business'
import { useOpenStatus } from '@/hooks/useOpenStatus'
import { SectionHeading } from './ui'
import OpenStatusBadge from './OpenStatusBadge'

export default function Location() {
  const { t } = useLanguage()
  const status = useOpenStatus()
  const serviceIcons = [Utensils, ShoppingBag, Bike]
  const a = business.address

  return (
    <section id="on-som" aria-labelledby="on-som-title" className="bg-stone py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="on-som-title" title={t.location.title} />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-2xl bg-cream p-6 shadow-soft sm:p-8">
            <OpenStatusBadge />

            <dl className="mt-6 space-y-6">
              <div className="flex gap-4">
                <dt className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tomato/10 text-tomato">
                  <MapPin size={19} />
                  <span className="sr-only">{t.location.address}</span>
                </dt>
                <dd>
                  <p className="font-semibold">{a.street}</p>
                  <p className="text-sm text-ash">
                    {a.postalCode} {a.city}, {a.province}
                  </p>
                  <a
                    href={business.maps.plusCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block py-1.5 text-xs font-medium text-basil underline-offset-4 hover:underline"
                  >
                    {t.location.plusCode}: {a.plusCode}
                  </a>
                </dd>
              </div>

              <div className="flex gap-4">
                <dt className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tomato/10 text-tomato">
                  <Phone size={19} />
                  <span className="sr-only">{t.location.phone}</span>
                </dt>
                <dd>
                  <p className="text-sm text-ash">{t.location.phone}</p>
                  <a href={business.phone.href} className="font-serif text-2xl font-semibold hover:text-tomato">
                    {business.phone.display}
                  </a>
                </dd>
              </div>

              <div className="flex gap-4">
                <dt className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tomato/10 text-tomato">
                  <Clock size={19} />
                  <span className="sr-only">{t.location.hours}</span>
                </dt>
                <dd className="flex-1">
                  <p className="mb-2 font-semibold">{t.location.hours}</p>
                  <ul className="divide-y divide-stone-deep/60 text-sm">
                    {weekOrder.map((d) => {
                      const s = schedule[d]
                      const isToday = d === status.today
                      return (
                        <li
                          key={d}
                          className={`flex justify-between gap-4 py-1.5 ${isToday ? 'font-semibold text-charcoal' : 'text-ash'}`}
                        >
                          <span className="capitalize">
                            {t.days[d]}
                            {isToday && (
                              <span className="ml-2 rounded-full bg-tomato px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-cream">
                                {t.location.today}
                              </span>
                            )}
                          </span>
                          <span className={s ? '' : 'text-tomato'}>
                            {s ? `${s.open} – ${s.close}` : t.location.closedDay}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>

              <div className="flex gap-4">
                <dt className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tomato/10 text-tomato">
                  <Euro size={19} />
                  <span className="sr-only">{t.location.price}</span>
                </dt>
                <dd>
                  <p className="text-sm text-ash">{t.location.price}</p>
                  <p className="font-semibold">{business.priceRange}</p>
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-stone-deep pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ash">{t.location.services}</p>
              <ul className="flex flex-wrap gap-2">
                {t.location.servicesList.map((s, i) => {
                  const Icon = serviceIcons[i]
                  return (
                    <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-basil-light px-3 py-1.5 text-xs font-medium text-basil">
                      <Icon size={13} />
                      {s}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl bg-stone p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Bike size={16} className="text-tomato" />
                {t.delivery.title}
              </p>
              <ul className="mt-2 space-y-2.5 text-sm sm:space-y-1.5">
                {t.delivery.zones.map((z) => (
                  <li key={z.place} className="flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                    <span className="text-ash">{z.place}</span>
                    <span className="shrink-0 font-semibold sm:text-right">{z.rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={business.phone.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-5 py-3.5 font-semibold text-cream shadow-soft transition duration-150 ease-out active:scale-[0.97] hover:bg-tomato-dark"
              >
                <Phone size={17} />
                {t.location.call}
              </a>
              <a
                href={business.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3.5 font-semibold text-cream transition duration-150 ease-out active:scale-[0.97] hover:bg-black"
              >
                <Navigation size={17} />
                {t.location.directions}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <img
              src="/images/facana.webp"
              alt={t.location.facadeAlt}
              loading="lazy"
              width={1360}
              height={907}
              className="photo-zoom aspect-[3/2] w-full bg-stone-deep object-cover"
            />
          </div>
          <div className="relative min-h-[22rem] flex-1 overflow-hidden rounded-2xl shadow-soft">
            <iframe
              title={t.location.mapTitle}
              src={business.maps.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.25)_saturate(0.85)]"
              allowFullScreen
            />
            <a
              href={business.maps.place}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold shadow-lift"
            >
              <MapPin size={15} className="text-tomato" />
              Plaça Mercè Rodoreda
            </a>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
