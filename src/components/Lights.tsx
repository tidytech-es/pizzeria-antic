import { useId } from 'react'

/**
 * Garlanda de bombetes, com les de la terrassa d'Antic.
 * Decorativa i estàtica: cada bombeta té una intensitat lleugerament diferent,
 * sense parpelleig (moviment constant que distreu i repinta l'SVG).
 */
export default function Lights({ className = '', bulbs = 18 }: { className?: string; bulbs?: number }) {
  const glowId = `glow-${useId().replace(/:/g, '')}`
  const W = 1200
  const sag = 46
  // Paràbola de la corda entre els dos extrems
  const y = (x: number) => 8 + (4 * sag * x * (W - x)) / (W * W)
  const points = Array.from({ length: bulbs }, (_, i) => (W / (bulbs + 1)) * (i + 1))

  return (
    <svg
      viewBox={`0 0 ${W} 80`}
      preserveAspectRatio="none"
      className={`pointer-events-none w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#FFD98A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFB547" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={`M0 8 Q ${W / 2} ${8 + sag * 2} ${W} 8`} stroke="#57534E" strokeWidth="1.5" fill="none" />
      {points.map((x, i) => (
        <g key={x} transform={`translate(${x} ${y(x)})`}>
          <circle r="16" cy="9" fill={`url(#${glowId})`} opacity={0.75 + ((i * 7) % 5) * 0.06} />
          <line y2="4" stroke="#57534E" strokeWidth="1.5" />
          <circle r="4.2" cy="9" fill="#FFE2A0" />
        </g>
      ))}
    </svg>
  )
}
