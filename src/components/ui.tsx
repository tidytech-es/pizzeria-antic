import { Star } from 'lucide-react'
import type { ReactNode } from 'react'

export function Stars({ value, size = 16, className = '' }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-ember/35" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-ember" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </span>
  )
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  id,
}: {
  title: string
  subtitle?: ReactNode
  align?: 'center' | 'left'
  id?: string
}) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <h2 id={id} className="text-3xl leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-ash text-balance">{subtitle}</p>}
    </div>
  )
}

/** Imatge amb degradat de recanvi si Unsplash no carrega */
export function SafeImage({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-gradient-to-br from-stone-deep via-stone to-[#EBD9C2] ${className}`}
      />
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`bg-stone-deep object-cover ${className}`}
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden'
      }}
    />
  )
}
