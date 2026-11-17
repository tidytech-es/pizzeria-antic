import { ArrowUp, Facebook, Instagram, Phone } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { business } from '@/data/business'
import { LogoBadge } from './Logo'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  const a = business.address

  return (
    <footer className="bg-charcoal pb-24 pt-14 text-cream/75 sm:pb-14">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-xs items-center gap-5">
            <LogoBadge size={96} className="shrink-0 text-cream" />
            <div>
              <p className="text-sm leading-relaxed">{t.footer.tagline}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-cream/50">{t.footer.follow}</p>
              <div className="mt-1 flex flex-col text-sm">
                <a href={business.social.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 hover:text-cream">
                  <Instagram size={15} />
                  {business.social.instagram.handle}
                </a>
                <a href={business.social.facebook.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 hover:text-cream">
                  <Facebook size={15} />
                  {business.social.facebook.handle}
                </a>
              </div>
            </div>
          </div>
          <div className="text-sm">
            <p className="text-cream">{a.street}</p>
            <p>
              {a.postalCode} {a.city}, {a.province}
            </p>
            <a href={business.phone.href} className="mt-1 inline-flex items-center gap-2 py-2 font-semibold text-cream hover:text-ember">
              <Phone size={14} />
              {business.phone.display}
            </a>
          </div>
          <nav aria-label="Peu" className="flex flex-col text-sm">
            <a href="#carta" className="py-2 hover:text-cream">{t.nav.menu}</a>
            <a href="#forn" className="py-2 hover:text-cream">{t.nav.oven}</a>
            <a href="#ressenyes" className="py-2 hover:text-cream">{t.nav.reviews}</a>
            <a href="#on-som" className="py-2 hover:text-cream">{t.nav.location}</a>
          </nav>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-6 text-xs sm:flex-row sm:items-center">
          <p>
            © {year} {business.name}. {t.footer.rights}
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 py-2 hover:text-cream">
            {t.footer.backToTop}
            <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  )
}
