import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { menu, sauces, specialOptions, type MenuItem, type VariantId } from '@/data/menu'
import { storage } from '@/lib/storage'

export interface AddOptions {
  variant: VariantId
  /** Pizza en massa sense gluten (mida petita): preu de la mitjana + suplement */
  glutenFree?: boolean
  /** Salsa triada per a spaghetti / penne */
  sauce?: string
}

export interface OrderLine extends AddOptions {
  /** Clau única: plat + mida + variant (p. ex. "antic|familiar" o "penne|unica|pesto") */
  key: string
  itemId: string
  glutenFree: boolean
  qty: number
}

export interface ResolvedLine extends OrderLine {
  item: MenuItem
  unitPrice: number
  lineTotal: number
}

interface OrderContextValue {
  lines: ResolvedLine[]
  count: number
  total: number
  isOpen: boolean
  open: () => void
  close: () => void
  add: (itemId: string, options: AddOptions) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const OrderContext = createContext<OrderContextValue | null>(null)
const STORAGE_KEY = 'antic-order-v2'

const lineKey = (itemId: string, o: AddOptions) =>
  [itemId, o.glutenFree ? 'sg' : o.variant, o.sauce ?? ''].join('|')

export function unitPriceFor(item: MenuItem, line: AddOptions): number | null {
  const variant = item.variants.find((v) => v.id === line.variant)
  if (!variant) return null
  return variant.price + (line.glutenFree ? specialOptions.glutenFreeDough.surcharge : 0)
}

function isValid(l: OrderLine) {
  const item = menu.find((m) => m.id === l.itemId)
  if (!item || !item.available || !(l.qty > 0)) return false
  if (unitPriceFor(item, l) === null) return false
  if (item.hasSauce && !sauces.some((s) => s.id === l.sauce)) return false
  return true
}

function loadLines(): OrderLine[] {
  const raw = storage.get(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as OrderLine[]
    return Array.isArray(parsed) ? parsed.filter(isValid) : []
  } catch {
    return []
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [rawLines, setRawLines] = useState<OrderLine[]>(loadLines)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    storage.set(STORAGE_KEY, JSON.stringify(rawLines))
  }, [rawLines])

  const add = useCallback((itemId: string, options: AddOptions) => {
    const opts = { ...options, glutenFree: !!options.glutenFree }
    const key = lineKey(itemId, opts)
    setRawLines((prev) => {
      const existing = prev.find((l) => l.key === key)
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
      return [...prev, { key, itemId, qty: 1, ...opts }]
    })
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setRawLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    )
  }, [])

  const remove = useCallback((key: string) => setRawLines((prev) => prev.filter((l) => l.key !== key)), [])
  const clear = useCallback(() => setRawLines([]), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const lines = useMemo<ResolvedLine[]>(
    () =>
      rawLines.flatMap((l) => {
        const item = menu.find((m) => m.id === l.itemId)
        const unitPrice = item ? unitPriceFor(item, l) : null
        if (!item || unitPrice === null) return []
        return [{ ...l, item, unitPrice, lineTotal: unitPrice * l.qty }]
      }),
    [rawLines],
  )

  const value = useMemo<OrderContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.lineTotal, 0),
      isOpen,
      open,
      close,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, isOpen, open, close, add, setQty, remove, clear],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used inside <OrderProvider>')
  return ctx
}
