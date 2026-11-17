import { useEffect, useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { LogoBadge, LogoWordmark } from './Logo'
import { useLanguage } from '@/i18n/LanguageContext'
import { useOrder } from '@/context/OrderContext'
import type { Lang } from '@/i18n/dictionary'
import OpenStatusBadge from './OpenStatusBadge'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="group inline-flex items-center gap-2.5" aria-label="Pizzeria Antic">
      <LogoBadge
        size={44}
        title=""
        className={`shrink-0 transition-transform duration-500 group-hover:rotate-[20deg] ${light ? 'text-cream' : 'text-charcoal'}`}
      />
      <span className="hidden min-[400px]:block">
        <LogoWordmark light={light} />
      </span>
    </a>
  )
}

function LangSwitch() {
  const { lang, setLang, t } = useLanguage()
  const langs: Lang[] = ['ca', 'es']
  return (
    <div role="group" aria-label={t.nav.langLabel} className="inline-flex rounded-full border border-stone-deep bg-cream p-0.5 text-xs font-semibold">
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition duration-150 ease-out active:scale-[0.97] ${
            lang === l ? 'bg-charcoal text-cream' : 'text-ash hover:text-charcoal'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Navbar({ onCta }: { onCta: () => void }) {
  const { t } = useLanguage()
  const { count, open: openOrder } = useOrder()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const links = [
    { href: '#carta', label: t.nav.menu },
    { href: '#forn', label: t.nav.oven },
    { href: '#ressenyes', label: t.nav.reviews },
    { href: '#on-som', label: t.nav.location },
  ]

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-200 ease-out ${
        scrolled || mobileOpen ? 'border-b border-stone-deep/70 bg-cream/90 shadow-soft backdrop-blur-md' : 'bg-cream/0'
      }`}
    >
      <div className="container-page flex h-[4.5rem] items-center gap-4">
        <Logo />

        <div className="hidden xl:block">
          <OpenStatusBadge />
        </div>
        <div className="xl:hidden">
          <OpenStatusBadge compact />
        </div>

        <nav aria-label="Principal" className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-ash transition duration-150 ease-out active:scale-[0.97] hover:bg-stone hover:text-charcoal"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <div className="hidden sm:block">
            <LangSwitch />
          </div>
          <button
            type="button"
            onClick={openOrder}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-stone-deep bg-cream text-charcoal transition duration-150 ease-out active:scale-[0.97] hover:bg-stone"
            aria-label={`${t.order.open} (${count})`}
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span key={count} className="animate-pop absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-tomato px-1 text-[0.65rem] font-bold text-cream">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onCta}
            className="hidden rounded-full bg-tomato px-5 py-2.5 text-sm font-semibold text-cream shadow-soft transition duration-150 ease-out active:scale-[0.97] hover:bg-tomato-dark sm:inline-flex"
          >
            {t.nav.cta}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-charcoal hover:bg-stone lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-stone-deep/70 lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            <div className="mb-2 xl:hidden">
              <OpenStatusBadge />
            </div>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 font-serif text-lg hover:bg-stone"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <LangSwitch />
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  onCta()
                }}
                className="flex-1 rounded-full bg-tomato px-5 py-3 text-sm font-semibold text-cream sm:hidden"
              >
                {t.nav.cta}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
