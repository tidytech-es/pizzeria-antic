import { useOpenStatus } from '@/hooks/useOpenStatus'
import { useLanguage } from '@/i18n/LanguageContext'

export function useOpenStatusLabel() {
  const status = useOpenStatus()
  const { t } = useLanguage()
  const s = t.status

  if (status.isOpen) {
    return { status, label: s.openNow, detail: `${s.until} ${status.closesAt}` }
  }
  const when =
    status.dayOffset === 0 ? s.today : status.dayOffset === 1 ? s.tomorrow : t.days[status.nextDay]
  return { status, label: s.closed, detail: `${s.opens} ${when} ${s.at} ${status.nextTime}` }
}

export default function OpenStatusBadge({ compact = false }: { compact?: boolean }) {
  const { status, label, detail } = useOpenStatusLabel()
  const open = status.isOpen

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${
        open ? 'border-basil/25 bg-basil-light text-basil' : 'border-stone-deep bg-stone text-ash'
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className={`relative inline-flex h-2 w-2 rounded-full ${open ? 'bg-basil' : 'bg-tomato'}`} />
      </span>
      <span className={open ? 'font-semibold' : 'font-semibold text-charcoal'}>{label}</span>
      {!compact && (
        <>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span>{detail}</span>
        </>
      )}
    </span>
  )
}
