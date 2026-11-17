import { ExternalLink, Quote } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { business } from '@/data/business'
import { reviews } from '@/data/reviews'
import { formatRating } from '@/lib/format'
import { SectionHeading, Stars } from './ui'
import Lights from './Lights'

export default function Reviews() {
  const { t, l, lang } = useLanguage()

  return (
    <section id="ressenyes" aria-labelledby="ressenyes-title" className="relative overflow-hidden bg-charcoal py-20 text-cream sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(200,62,43,0.28),transparent_65%)]"
      />
      <Lights className="absolute inset-x-0 top-0 h-14 opacity-70 sm:h-16" bulbs={14} />
      <div className="container-page relative">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="text-center lg:text-left [&_h2]:text-cream [&_p]:text-cream/70">
            <SectionHeading id="ressenyes-title" align="left" title={t.reviews.title} />
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-cream/10 bg-cream/5 px-5 py-4">
            <span className="font-serif text-5xl font-semibold">{formatRating(business.rating.score, lang)}</span>
            <div>
              <Stars value={business.rating.score} size={18} />
              <p className="mt-1 text-sm text-cream/70">{t.reviews.basedOn}</p>
            </div>
          </div>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id} className="flex flex-col rounded-2xl border border-cream/10 bg-cream/[0.04] p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-tomato/20 px-3 py-1 text-xs font-semibold text-[#F3A89B]">{l(r.highlight)}</span>
                <Quote size={22} className="text-cream/20" />
              </div>
              <blockquote className="mt-4 flex-1 font-serif text-lg leading-relaxed text-cream/90 italic">
                “{r.text}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-cream/10 pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-stone text-sm font-bold text-charcoal">
                  {r.author.charAt(0)}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.author}</p>
                  <p className="text-xs text-cream/55">
                    {t.reviews.source}
                    {r.lang !== lang && ` · ${t.reviews.originalIn} ${t.reviews.langNames[r.lang]}`}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <a
            href={business.maps.place}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-5 py-3 text-sm font-semibold transition duration-150 ease-out active:scale-[0.97] hover:bg-cream hover:text-charcoal"
          >
            {t.reviews.seeAll}
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}
