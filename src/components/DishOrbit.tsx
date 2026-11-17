import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, ChevronDown, ChevronUp, Flame, Mouse, Plus } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { useOrder } from '@/context/OrderContext'
import { featured } from '@/data/featured'
import { formatPrice } from '@/lib/format'
import WoodBoard from './WoodBoard'

gsap.registerPlugin(ScrollTrigger)

const N = featured.length
const pad = (n: number) => String(n).padStart(2, '0')

/** Diferència circular i − p dins de [−N/2, N/2): el carrusel no té final visual */
const wrapDelta = (i: number, p: number) => {
  const d = (((i - p) % N) + N) % N
  return d >= N / 2 ? d - N : d
}

/**
 * Carrusel en òrbita: en fer scroll, cada pizza surt girant per un arc (com si
 * la pala la tragués del forn) mentre entra la següent. La franja de color es
 * transforma d'un plat a l'altre i el títol s'escombra en dos pesos.
 * Amb "reduir moviment" no es fixa la secció: es navega amb els botons.
 */
export default function DishOrbit() {
  const { t, l, lang } = useLanguage()
  const { add } = useOrder()
  const [active, setActive] = useState(0)
  const [added, setAdded] = useState(false)
  const [reduced, setReduced] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const plateRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeRef = useRef(0)
  const goToRef = useRef<(i: number) => void>(() => {})

  useLayoutEffect(() => {
    if (N === 0) return
    const mm = gsap.matchMedia()

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        reduce: '(prefers-reduced-motion: reduce)',
        mobile: '(max-width: 1023px)',
      },
      (ctx) => {
        const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean }
        const stage = stageRef.current!
        const band = bandRef.current!
        const plates = plateRefs.current.filter(Boolean) as HTMLDivElement[]
        const bandLayers = Array.from(band.querySelectorAll<HTMLElement>('[data-band-layer]'))
        const state = { p: 0 }
        setReduced(!motion)

        /*
         * Rendiment: tota la geometria (mides, radi, centre de l'òrbita) es
         * calcula a `layout()`, que només corre en iniciar, en redimensionar
         * i quan el text del mòbil creix. Cada fotograma (`render`) només
         * escriu transform i opacity: res de layout ni de repintat.
         */
        const geo = { size: 0, R: 0, step: 36, cx: 0, cy: 0, base: 180, dir: -1 }
        // Al mòbil el plat va a l'espai que queda sota el text. Es guarda el
        // màxim mesurat perquè el plat no salti quan canvia el títol.
        let textBottom = 0
        const lastZ: number[] = []

        const layout = () => {
          // Lectures primer…
          const W = stage.clientWidth
          const H = stage.clientHeight
          if (mobile && textRef.current) {
            const t = textRef.current.getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 14
            textBottom = Math.max(textBottom, t)
          }
          const free = Math.max(H - textBottom, H * 0.3)
          const size = mobile ? Math.min(W * 0.66, free * 0.84) : Math.min(H * 0.66, W * 0.36)
          const R = mobile ? size * 2.2 : H * 0.95
          // Punt on queda el plat actiu i centre de l'òrbita
          const ax = mobile ? W / 2 : W * 0.72
          const ay = mobile ? H - free / 2 : H * 0.53
          Object.assign(geo, {
            size,
            R,
            step: mobile ? 50 : 36,
            cx: mobile ? ax : ax + R,
            cy: mobile ? ay + R : ay,
            base: mobile ? 270 : 180,
            dir: mobile ? 1 : -1,
          })
          // …escriptures després (una sola vegada, no per fotograma)
          band.style.height = mobile ? `${free - 4}px` : ''
          plates.forEach((el) => {
            el.style.width = `${size}px`
            el.style.height = `${size}px`
          })
        }

        const render = (p: number) => {
          const { size, R, step, cx, cy, base, dir } = geo
          plates.forEach((el, i) => {
            const d = wrapDelta(i, p)
            const ad = Math.abs(d)
            const theta = ((base + dir * d * step) * Math.PI) / 180
            gsap.set(el, {
              x: cx + R * Math.cos(theta) - size / 2,
              y: cy + R * Math.sin(theta) - size / 2,
              rotate: d * -150,
              scale: 1 - Math.min(ad, 1.5) * 0.28,
              opacity: ad > 1.6 ? 0 : 1 - Math.max(0, ad - 0.5) * 0.9,
            })
            const z = 100 - Math.round(ad * 10)
            if (lastZ[i] !== z) {
              lastZ[i] = z
              el.style.zIndex = String(z)
            }
          })

          // La franja canvia de color fent fos encadenat de capes (opacity),
          // en lloc d'interpolar background-color, que repinta cada fotograma.
          bandLayers.forEach((layer, i) => {
            layer.style.opacity = String(Math.max(0, 1 - Math.abs(i - p)))
          })

          const idx = Math.round(p)
          if (idx !== activeRef.current) {
            activeRef.current = idx
            setActive(idx)
            // El títol nou pot ocupar més línies al mòbil: es remesura un cop React l'ha pintat
            if (mobile) {
              requestAnimationFrame(() => {
                const before = textBottom
                layout()
                if (textBottom !== before) render(state.p)
              })
            }
          }
        }

        const relayout = () => {
          textBottom = 0
          layout()
          render(state.p)
        }
        window.addEventListener('resize', relayout)
        layout()

        if (motion && N > 1) {
          const tween = gsap.to(state, {
            p: N - 1,
            ease: 'none',
            onUpdate: () => render(state.p),
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${(N - 1) * window.innerHeight * 0.75}`,
              pin: true,
              scrub: 0.7,
              snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power1.inOut', delay: 0.05 },
              invalidateOnRefresh: true,
            },
          })
          const st = tween.scrollTrigger!
          const onRefresh = () => {
            layout()
            render(state.p)
          }
          ScrollTrigger.addEventListener('refresh', onRefresh)
          goToRef.current = (i) => {
            const target = st.start + (st.end - st.start) * (i / (N - 1))
            window.scrollTo({ top: target, behavior: 'smooth' })
          }
          render(0)
          return () => {
            ScrollTrigger.removeEventListener('refresh', onRefresh)
            window.removeEventListener('resize', relayout)
          }
        }

        // Sense animació de scroll: navegació amb botons, canvi instantani
        state.p = activeRef.current
        render(state.p)
        goToRef.current = (i) => {
          state.p = i
          render(i)
        }
        return () => {
          window.removeEventListener('resize', relayout)
        }
      },
    )

    // Les imatges del hero poden moure la posició de la secció en carregar
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  if (N === 0) return null

  const dish = featured[active]
  const goTo = (i: number) => goToRef.current(((i % N) + N) % N)
  const handleAdd = () => {
    add(dish.item.id, { variant: dish.item.variants[0].id })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <section
      ref={sectionRef}
      id="estrella"
      aria-roledescription="carousel"
      aria-label={t.orbit.label}
      className="relative h-[100svh] min-h-[36rem] overflow-hidden bg-cream"
    >
      <div ref={stageRef} className="absolute inset-x-0 bottom-0 top-[4.5rem]">
        {/* Franja que canvia de color */}
        <div
          ref={bandRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[46%] overflow-hidden rounded-t-[2.5rem] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[44%] lg:rounded-t-none lg:rounded-l-[3rem]"
        >
          {featured.map((f, i) => (
            <div
              key={f.id}
              data-band-layer
              className="absolute inset-0"
              style={{ backgroundColor: f.band, opacity: i === 0 ? 1 : 0 }}
            />
          ))}
          <span
            key={active}
            className="animate-fade-up absolute right-4 top-3 font-serif text-[5.5rem] leading-none font-semibold text-cream/15 sm:text-[7rem] lg:right-8 lg:top-6 lg:text-[11rem]"
          >
            {pad(active + 1)}
          </span>
        </div>

        {/* Plats en òrbita */}
        <div aria-hidden="true">
          {featured.map((f, i) => (
            <div
              key={f.id}
              ref={(el) => {
                plateRefs.current[i] = el
              }}
              className="absolute left-0 top-0 rounded-full shadow-[0_30px_60px_-18px_rgba(28,25,23,0.6)] will-change-transform"
              style={{ width: 0, height: 0, opacity: i === 0 ? 1 : 0 }}
            >
              {/* Taula rodona de fusta */}
              <WoodBoard seed={i * 11 + 3} className="absolute inset-0 h-full w-full" />
              {/* Pizza a sobre, amb ombra sobre la fusta */}
              <div className="absolute inset-[10%] overflow-hidden rounded-full shadow-[0_6px_14px_rgba(40,20,5,0.55),0_0_0_1.5px_rgba(90,50,20,0.35)]">
                <img
                  src={f.image}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="h-full w-full scale-[1.18] bg-stone-deep object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Text */}
        <div className="container-page relative z-[200] flex h-full flex-col pt-6 lg:justify-center lg:pt-0">
          <div ref={textRef} className="max-w-[34rem] lg:max-w-[44%]">
            <p className="text-sm font-semibold text-ash tabular-nums" aria-live="polite">
              <span className="sr-only">{t.orbit.label}: </span>
              {pad(active + 1)} / {pad(N)}
            </p>

            <h2 key={`${active}-${lang}`} className="mt-3 lg:mt-5">
              <span
                className={`animate-wipe block leading-[1.02] font-semibold tracking-tight ${
                  l(dish.item.name).length > 14
                    ? 'text-[2rem] sm:text-[2.6rem] lg:text-[3.4rem]'
                    : 'text-[2.4rem] sm:text-5xl lg:text-[4.5rem]'
                }`}
              >
                {l(dish.item.name)}
              </span>
              <span className="animate-wipe block text-[1.9rem] leading-tight font-light text-tomato italic [animation-delay:120ms] sm:text-4xl lg:text-[3.25rem]">
                {l(dish.tagline)}
              </span>
            </h2>

            <p
              key={`d-${active}-${lang}`}
              className="animate-fade-up mt-3 line-clamp-2 text-sm leading-relaxed text-ash [animation-delay:150ms] sm:line-clamp-none sm:text-base lg:mt-5"
            >
              {dish.item.description ? l(dish.item.description) : null}
            </p>

            {/* Targeta del forner */}
            <div
              key={`c-${active}-${lang}`}
              className="animate-fade-up mt-4 flex items-center gap-4 rounded-2xl bg-cream p-3 shadow-soft [animation-delay:220ms] lg:mt-7 lg:items-start lg:p-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-tomato/10 text-tomato">
                <Flame size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ash">{t.orbit.note}</p>
                <p className="mt-0.5 hidden text-sm leading-snug text-charcoal/85 sm:block">{l(dish.note)}</p>
                <p className="font-serif text-xl font-semibold text-tomato sm:mt-1 sm:text-lg">
                  {dish.item.variants[0].id === 'mitjana' && (
                    <span className="mr-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-ash">{t.orbit.from}</span>
                  )}
                  {formatPrice(dish.item.variants[0].price, lang)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className={`inline-flex shrink-0 items-center gap-1.5 self-center rounded-full px-4 py-2.5 text-sm font-semibold text-cream transition duration-150 ease-out active:scale-[0.97] ${
                  added ? 'bg-basil' : 'bg-charcoal hover:bg-tomato'
                }`}
              >
                {added ? <Check size={16} /> : <Plus size={16} />}
                {added ? t.menu.added : t.orbit.add}
              </button>
            </div>

            {/* Navegació */}
            <div className="mt-4 flex items-center gap-3 lg:mt-8">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                aria-label={t.orbit.prev}
                className="grid h-11 w-11 place-items-center rounded-full border border-stone-deep bg-cream transition duration-150 ease-out hover:bg-stone active:scale-[0.97]"
              >
                <ChevronUp size={18} />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                aria-label={t.orbit.next}
                className="grid h-11 w-11 place-items-center rounded-full border border-stone-deep bg-cream transition duration-150 ease-out hover:bg-stone active:scale-[0.97]"
              >
                <ChevronDown size={18} />
              </button>
              <div className="ml-1 flex items-center gap-1.5">
                {featured.map((f, i) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={l(f.item.name)}
                    aria-current={i === active}
                    className={`h-2 rounded-full transition-[width,background-color] duration-200 ease-out ${i === active ? 'w-6 bg-tomato' : 'w-2 bg-stone-deep hover:bg-ash/40'}`}
                  />
                ))}
              </div>
              {!reduced && (
                <span className="ml-auto hidden items-center gap-2 text-xs text-ash lg:inline-flex">
                  <Mouse size={16} />
                  {t.orbit.scrollHint}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
