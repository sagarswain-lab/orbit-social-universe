import { clamp } from './math'

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

/** Short relative time like "3m", "5h", "2d". `now` injectable for tests. */
export function relativeTime(ts: number, now: number = Date.now()): string {
  const d = Math.max(0, now - ts)
  if (d < MIN) return 'now'
  if (d < HOUR) return `${Math.floor(d / MIN)}m`
  if (d < DAY) return `${Math.floor(d / HOUR)}h`
  return `${Math.floor(d / DAY)}d`
}

/**
 * A signal's remaining "life" as 0..1. Signals decay over their lifespan and
 * vanish — there is no permanent backlog in ORBIT.
 */
export function signalLife(
  createdAt: number,
  lifespanMs: number,
  now: number = Date.now(),
): number {
  return clamp(1 - (now - createdAt) / lifespanMs, 0, 1)
}

/** Human countdown until a signal fades, e.g. "fades in 4h". */
export function fadesIn(
  createdAt: number,
  lifespanMs: number,
  now: number = Date.now(),
): string {
  const left = createdAt + lifespanMs - now
  if (left <= 0) return 'fading'
  if (left < HOUR) return `fades in ${Math.ceil(left / MIN)}m`
  if (left < DAY) return `fades in ${Math.ceil(left / HOUR)}h`
  return `fades in ${Math.ceil(left / DAY)}d`
}

export const minutesAgo = (m: number) => Date.now() - m * MIN
export const hoursAgo = (h: number) => Date.now() - h * HOUR
export const daysAgo = (d: number) => Date.now() - d * DAY

export const LIFESPANS = {
  '6h': 6 * HOUR,
  '24h': DAY,
  '3d': 3 * DAY,
  '7d': 7 * DAY,
} as const

export type LifespanKey = keyof typeof LIFESPANS
