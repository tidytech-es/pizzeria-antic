import { useId } from 'react'

const INK = '#141210'
const PAPER = '#FAF7F2'

/**
 * Logotip de Pizzeria Antic, redibuixat en SVG a partir del segell original
 * (coordenades mesurades sobre la imatge del logo, en una caixa de 300×300):
 * - disc negre amb anell exterior discontinu i anell interior continu;
 * - «· PIZZERIA ·» en un arc molt suau;
 * - monograma: 4 pals verticals units per 4 diagonals en dos pisos
 *   (dalt: pal 1→2 i 2→3; baix: pal 2→3 i 3→4);
 * - «AИTIC» amb la N invertida.
 */
export function LogoBadge({ size = 48, className = '', title = 'Pizzeria Antic' }: { size?: number; className?: string; title?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      className={className}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <circle cx="150" cy="150" r="149" fill={INK} />
      <circle cx="150" cy="150" r="140" fill="none" stroke={PAPER} strokeWidth="3" strokeDasharray="5.6 2.6" />
      <circle cx="150" cy="150" r="131.5" fill="none" stroke={PAPER} strokeWidth="3" />

      {/* · PIZZERIA · */}
      <path id={`arc-${id}`} d="M 78 78.5 A 150 150 0 0 1 216 78.5" fill="none" />
      <text
        fill={PAPER}
        fontSize="18.5"
        fontWeight="400"
        letterSpacing="0.6"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        textAnchor="middle"
      >
        <textPath href={`#arc-${id}`} startOffset="50%">
          PIZZERIA
        </textPath>
      </text>
      <circle cx="89" cy="61.5" r="2" fill={PAPER} />
      <circle cx="207" cy="61.5" r="2" fill={PAPER} />

      <Monogram />
      <Wordmark />
    </svg>
  )
}

/** Pals verticals i diagonals del monograma (unió de formes blanques) */
function Monogram() {
  const top = 83.5
  const mid = 141 // on acaba el pis de dalt i comença el de baix
  const bottom = 196.5
  const bars: [number, number][] = [
    [86, 100.5],
    [124, 138],
    [160, 174.5],
    [198, 211],
  ]
  const slope = 0.6 // desplaçament horitzontal per cada píxel de baixada
  const w = 15
  // [x esquerra a dalt, y inicial, y final]
  const diagonals: [number, number, number][] = [
    [88, top, mid + 0.5],
    [125, top, mid + 0.5],
    [124, mid - 0.5, bottom],
    [160, mid - 0.5, bottom],
  ]
  return (
    <g fill={PAPER}>
      {bars.map(([x0, x1]) => (
        <rect key={x0} x={x0} y={top} width={x1 - x0} height={bottom - top} />
      ))}
      {diagonals.map(([x, y0, y1]) => {
        const dx = (y1 - y0) * slope
        return <polygon key={`${x}-${y0}`} points={`${x},${y0} ${x + w},${y0} ${x + w + dx},${y1} ${x + dx},${y1}`} />
      })}
    </g>
  )
}

function Wordmark() {
  return (
    <g fill="none" stroke={PAPER} strokeWidth="4.6" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="2">
      {/* A */}
      <path d="M87.5 241.5 L98.8 208.5 L110 241.5 M91.2 230.5 H106.4" />
      {/* И */}
      <path d="M121 208.5 V241.5 L143 208.5 V241.5" />
      {/* T */}
      <path d="M150 210.8 H174 M162 210.8 V241.5" />
      {/* I */}
      <path d="M180.5 208.5 V241.5" />
      {/* C */}
      <path d="M212.4 215.5 A12.5 15.6 0 1 0 212.4 234.5" />
    </g>
  )
}

/** Wordmark en HTML per a capçaleres: "Pizzeria" + "AИTIC" amb la N girada */
export function LogoWordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="leading-none" aria-hidden="true">
      <span className={`block text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${light ? 'text-cream/60' : 'text-ash'}`}>
        Pizzeria
      </span>
      <span className={`flex gap-[0.22em] text-xl font-light ${light ? 'text-cream' : 'text-charcoal'}`}>
        <span>A</span>
        <span className="-scale-x-100">N</span>
        <span>T</span>
        <span>I</span>
        <span>C</span>
      </span>
    </span>
  )
}
