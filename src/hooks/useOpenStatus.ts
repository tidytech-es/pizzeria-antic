import { useEffect, useState } from 'react'
import { business, schedule } from '@/data/business'

export type OpenStatus =
  | { isOpen: true; closesAt: string; today: number }
  | { isOpen: false; nextDay: number; nextTime: string; dayOffset: number; today: number }

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

/** Dia de la setmana i minuts del dia a l'hora de Sant Celoni, sigui on sigui el visitant. */
function nowInMadrid(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: business.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return {
    day: WEEKDAYS[get('weekday')] ?? date.getDay(),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = nowInMadrid(date)
  const todaySchedule = schedule[day]

  if (todaySchedule && minutes >= toMinutes(todaySchedule.open) && minutes < toMinutes(todaySchedule.close)) {
    return { isOpen: true, closesAt: todaySchedule.close, today: day }
  }

  for (let offset = 0; offset < 8; offset++) {
    const d = (day + offset) % 7
    const s = schedule[d]
    if (!s) continue
    if (offset === 0 && minutes >= toMinutes(s.open)) continue
    return { isOpen: false, nextDay: d, nextTime: s.open, dayOffset: offset, today: day }
  }

  // No hauria de passar mai (hi ha almenys un dia obert)
  return { isOpen: false, nextDay: 3, nextTime: '19:00', dayOffset: 0, today: day }
}

/** Es recalcula cada minut perquè l'indicador canviï sol a les 19:00. */
export function useOpenStatus() {
  const [status, setStatus] = useState(() => getOpenStatus())
  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return status
}
