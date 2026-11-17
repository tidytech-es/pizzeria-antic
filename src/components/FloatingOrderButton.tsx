import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { useOrder } from '@/context/OrderContext'
import { formatPrice } from '@/lib/format'

/**
 * Barra flotant que apareix quan hi ha plats a la comanda.
 * S'amaga mentre el hero és a la pantalla perquè no tapi el botó de trucar.
 */
export default function FloatingOrderButton() {
  const { t, lang } = useLanguage()
  const { count, total, open, isOpen } = useOrder()
  const [heroVisible, setHeroVisible] = useState(true)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero || !('IntersectionObserver' in window)) {
      setHeroVisible(false)
      return
    }
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
      rootMargin: '0px 0px -35% 0px',
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  if (count === 0 || isOpen || heroVisible) return null

  return (
    <button
      type="button"
      onClick={open}
      className="animate-[fade-up_250ms_var(--ease-out)_both] fixed bottom-4 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-between gap-3 rounded-full bg-charcoal py-2 pl-2 pr-5 text-cream shadow-lift transition duration-150 ease-out active:scale-[0.97] hover:bg-black sm:bottom-6"
    >
      <span className="flex items-center gap-3">
        <span key={count} className="animate-pop grid h-10 w-10 place-items-center rounded-full bg-tomato font-bold">
          {count}
        </span>
        <span className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingBag size={16} />
          {t.order.open}
        </span>
      </span>
      <span className="font-semibold tabular-nums">{formatPrice(total, lang)}</span>
    </button>
  )
}
