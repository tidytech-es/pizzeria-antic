import { useEffect, useRef } from 'react'
import { Bike, CalendarCheck, Phone, ShoppingBag, X } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { useOrder } from '@/context/OrderContext'
import { business } from '@/data/business'
import OpenStatusBadge from './OpenStatusBadge'
import { usePresence } from '@/hooks/usePresence'

export default function ReserveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  const { count, open: openOrder } = useOrder()
  const closeRef = useRef<HTMLButtonElement>(null)

  const { mounted, shown } = usePresence(open, 200)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (open && mounted) closeRef.current?.focus()
  }, [open, mounted])

  if (!mounted) return null

  const icons = [CalendarCheck, ShoppingBag, Bike]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="reserve-title">
      <button
        type="button"
        aria-label={t.modal.close}
        onClick={onClose}
        className={`absolute inset-0 bg-charcoal/55 transition-opacity ease-out ${shown ? 'opacity-100 duration-300' : 'opacity-0 duration-200'}`}
      />
      {/* Mòbil: full que puja des de baix. Escriptori: modal centrat que creix de 0,97. Sortida més ràpida. */}
      <div
        className={`relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-lift transition-[translate,scale,opacity] sm:rounded-2xl sm:p-8 ${
          shown
            ? 'translate-y-0 opacity-100 duration-[420ms] ease-(--ease-drawer) sm:scale-100 sm:duration-[220ms] sm:ease-out'
            : 'translate-y-full duration-200 ease-out sm:translate-y-0 sm:scale-[0.97] sm:opacity-0 sm:duration-150'
        }`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.modal.close}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full hover:bg-stone"
        >
          <X size={20} />
        </button>

        <OpenStatusBadge />
        <h2 id="reserve-title" className="mt-4 text-3xl font-semibold">
          {t.modal.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ash">{t.modal.subtitle}</p>

        <ul className="mt-6 grid gap-3">
          {t.modal.options.map((o, i) => {
            const Icon = icons[i]
            return (
              <li key={o.title} className="flex items-start gap-4 rounded-2xl border border-stone-deep bg-stone/50 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-tomato shadow-soft">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-semibold">{o.title}</p>
                  <p className="text-sm text-ash">{o.text}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <a
          href={business.phone.href}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-tomato px-6 py-4 text-base font-semibold text-cream shadow-soft transition duration-150 ease-out active:scale-[0.97] hover:bg-tomato-dark"
        >
          <Phone size={18} />
          {t.modal.callCta} {business.phone.display}
        </a>

        {count > 0 && (
          <div className="mt-4 rounded-2xl bg-basil-light/70 p-4 text-sm">
            <p className="text-charcoal/85">{t.modal.orderHint}</p>
            <button
              type="button"
              onClick={() => {
                onClose()
                openOrder()
              }}
              className="mt-2 font-semibold text-basil underline underline-offset-4"
            >
              {t.modal.openOrder} ({count})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
