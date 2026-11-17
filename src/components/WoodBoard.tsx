import { useId } from 'react'

/**
 * Taula rodona de fusta per servir pizza, dibuixada amb SVG:
 * veta de fusta generada amb soroll (feTurbulence), bisell a la vora i
 * una ombra suau al centre on reposa la pizza. `seed` canvia el dibuix
 * de la veta perquè cada taula sigui diferent.
 */
export default function WoodBoard({ seed = 1, className = '' }: { seed?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  const grain = `grain-${id}`
  const clip = `clip-${id}`
  const shade = `shade-${id}`
  const rim = `rim-${id}`

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <filter id={grain} x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse">
          <feFlood floodColor="#B57C47" result="base" />
          {/* Soroll estirat en horitzontal = veta de la fusta */}
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.16" numOctaves="3" seed={seed} result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.33
                    0 0 0 0 0.18
                    0 0 0 0 0.07
                    1.6 0 0 0 -0.62"
            result="streaks"
          />
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.5" numOctaves="2" seed={seed + 7} result="fine" />
          <feColorMatrix
            in="fine"
            type="matrix"
            values="0 0 0 0 0.98
                    0 0 0 0 0.86
                    0 0 0 0 0.66
                    0.9 0 0 0 -0.42"
            result="light"
          />
          <feMerge>
            <feMergeNode in="base" />
            <feMergeNode in="light" />
            <feMergeNode in="streaks" />
          </feMerge>
        </filter>
        <clipPath id={clip}>
          <circle cx="100" cy="100" r="98" />
        </clipPath>
        {/* Llum zenital: més clar al centre, més fosc a la vora */}
        <radialGradient id={shade} cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#2A1608" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id={rim} cx="50%" cy="50%" r="50%">
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.9" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${clip})`}>
        <rect width="200" height="200" filter={`url(#${grain})`} />
        <circle cx="100" cy="100" r="98" fill={`url(#${shade})`} />
        {/* Ombra de la pizza sobre la fusta */}
        <circle cx="100" cy="100" r="86" fill={`url(#${rim})`} />
      </g>
      {/* Bisell de la vora */}
      <circle cx="100" cy="100" r="96.5" fill="none" stroke="#FFE3C0" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="98.5" fill="none" stroke="#5A3416" strokeOpacity="0.85" strokeWidth="2.5" />
    </svg>
  )
}
