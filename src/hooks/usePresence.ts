import { useEffect, useState } from 'react'

/**
 * Manté un element muntat mentre fa l'animació de sortida.
 * - `mounted`: si s'ha de renderitzar.
 * - `shown`: si ha d'estar en l'estat visible (es posa a true un fotograma
 *   després de muntar, perquè la transició CSS d'entrada tingui un punt de partida).
 * Fa servir transicions CSS (interrompibles), no keyframes.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // Dos fotogrames: el primer pinta l'estat inicial, el segon dispara la transició
      let raf2 = 0
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShown(true))
      })
      return () => {
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
      }
    }
    setShown(false)
    const id = window.setTimeout(() => setMounted(false), exitMs)
    return () => window.clearTimeout(id)
  }, [open, exitMs])

  return { mounted, shown }
}
