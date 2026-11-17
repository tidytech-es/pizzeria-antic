import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, Minus, Phone, Pizza, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { useOrder } from '@/context/OrderContext'
import { business } from '@/data/business'
import { formatPrice } from '@/lib/format'
import { sauces } from '@/data/menu'
import { usePresence } from '@/hooks/usePresence'

export default function OrderDrawer() {
  const { t, l, lang } = useLanguage()
  const { lines, count, total, isOpen, close, setQty, remove, clear } = useOrder()
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { mounted, shown } = usePresence(isOpen, 240)

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  useEffect(() => {
    if (isOpen && mounted) closeRef.current?.focus()
  }, [isOpen, mounted])

  /** "familiar (40 cm)", "sense gluten, mida petita", "salsa pesto"… */
  const detail = (line: (typeof lines)[number]) => {
    const parts: string[] = []
    const v = line.glutenFree ? t.variantsLong.sg : t.variantsLong[line.variant]
    if (v) parts.push(v)
    const sauce = line.sauce ? sauces.find((s) => s.id === line.sauce) : undefined
    if (sauce) parts.push(`${t.order.sauceWord} ${l(sauce.label).toLowerCase()}`)
    return parts.join(', ')
  }

  const summary = useMemo(() => {
    const rows = lines.map((line) => {
      const d = detail(line)
      return `• ${line.qty} × ${l(line.item.name)}${d ? ` (${d})` : ''} — ${formatPrice(line.lineTotal, lang)}`
    })
    return [t.order.summaryIntro, ...rows, `${t.order.summaryTotal}: ${formatPrice(total, lang)}`].join('\n')
  }, [lines, total, l, lang, t])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* el portapapers pot estar bloquejat; el resum continua visible */
    }
  }

  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-title"
      data-state={shown ? 'open' : 'closed'}
    >
      {/* Entrada amb corba de calaix; sortida més ràpida que l'entrada */}
      <button
        type="button"
        aria-label={t.order.close}
        onClick={close}
        className={`absolute inset-0 bg-charcoal/50 transition-opacity ${
          shown ? 'opacity-100 duration-300 ease-out' : 'opacity-0 duration-200 ease-out'
        }`}
      />
      <div
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-lift transition-transform ${
          shown ? 'translate-x-0 duration-[420ms] ease-(--ease-drawer)' : 'translate-x-full duration-[240ms] ease-out'
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-deep px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-tomato/10 text-tomato">
              <ShoppingBag size={18} />
            </span>
            <div>
              <h2 id="order-title" className="text-xl font-semibold">
                {t.order.title}
              </h2>
              <p className="text-xs text-ash">
                {count} {count === 1 ? t.order.item : t.order.items}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t.order.close}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-stone"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-stone text-tomato" aria-hidden="true">
                <Pizza size={28} strokeWidth={1.75} />
              </span>
              <p className="max-w-xs text-sm text-ash">{t.order.empty}</p>
              <a
                href="#carta"
                onClick={close}
                className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-cream"
              >
                {t.hero.seeMenu}
              </a>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-stone-deep/70">
                {lines.map((line) => (
                  <li key={line.key} className="flex items-start gap-3 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug">{l(line.item.name)}</p>
                      {detail(line) && (
                        <p className={`mt-0.5 text-xs font-medium ${line.glutenFree ? 'text-basil' : 'text-ash'}`}>{detail(line)}</p>
                      )}
                      <p className="mt-0.5 text-xs text-ash tabular-nums">{formatPrice(line.unitPrice, lang)}</p>
                      <div className="mt-2 inline-flex items-center rounded-full border border-stone-deep">
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label={`${t.order.decrease}: ${l(line.item.name)}`}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-stone"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label={`${t.order.increase}: ${l(line.item.name)}`}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-stone"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-semibold tabular-nums">{formatPrice(line.lineTotal, lang)}</span>
                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        aria-label={`${t.order.remove}: ${l(line.item.name)}`}
                        className="grid h-8 w-8 place-items-center rounded-full text-ash hover:bg-stone hover:text-tomato"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-2xl bg-stone p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ash">{t.order.summary}</p>
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-basil hover:bg-cream"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? t.order.copied : t.order.copy}
                  </button>
                </div>
                <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-charcoal">{summary}</pre>
              </div>

              <button
                type="button"
                onClick={clear}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ash hover:text-tomato"
              >
                <Trash2 size={13} />
                {t.order.clear}
              </button>
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-stone-deep bg-cream px-5 py-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm text-ash">{t.order.total}</span>
              <span className="font-serif text-2xl font-semibold tabular-nums">{formatPrice(total, lang)}</span>
            </div>
            <a
              href={business.phone.href}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-tomato px-6 py-3.5 font-semibold text-cream shadow-soft transition duration-150 ease-out active:scale-[0.97] hover:bg-tomato-dark"
            >
              <Phone size={18} />
              {t.order.call} · {business.phone.display}
            </a>
            <p className="mt-2 text-center text-[0.7rem] leading-snug text-ash">{t.order.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  )
}
