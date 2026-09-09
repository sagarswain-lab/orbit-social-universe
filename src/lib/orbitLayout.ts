import { clamp, mapRange } from './math'

/**
 * ORBIT layout math. Closeness (resonance) maps to orbital radius: the more
 * you resonate with someone, the closer they orbit your center.
 */

export const RESONANCE_MIN = 6
export const RESONANCE_MAX = 100

/** Innermost/outermost radius as a fraction of the available half-extent. */
const INNER_FRAC = 0.32
const OUTER_FRAC = 0.98

export const innerRadius = (maxR: number) => maxR * INNER_FRAC
export const outerRadius = (maxR: number) => maxR * OUTER_FRAC

export function resonanceToRadius(resonance: number, maxR: number): number {
  return mapRange(
    clamp(resonance, RESONANCE_MIN, RESONANCE_MAX),
    RESONANCE_MAX,
    RESONANCE_MIN,
    innerRadius(maxR),
    outerRadius(maxR),
  )
}

export function radiusToResonance(radius: number, maxR: number): number {
  return mapRange(
    clamp(radius, innerRadius(maxR), outerRadius(maxR)),
    innerRadius(maxR),
    outerRadius(maxR),
    RESONANCE_MAX,
    RESONANCE_MIN,
  )
}

/** Guide-ring radii for the inner (>=80) and near (>=50) band boundaries. */
export function guideRings(maxR: number) {
  return [
    { label: 'inner', r: resonanceToRadius(80, maxR) },
    { label: 'near', r: resonanceToRadius(50, maxR) },
    { label: 'outer', r: outerRadius(maxR) },
  ]
}

/** Orbital period (seconds) — narrow range keeps the golden-angle spread from
 * bunching over time, so nodes stay legible while still drifting gently. */
export function orbitPeriod(radius: number, maxR: number): number {
  return mapRange(radius, innerRadius(maxR), outerRadius(maxR), 240, 300)
}

/** Node avatar size grows slightly with closeness. */
export function nodeSize(resonance: number, base = 42): number {
  return base + mapRange(resonance, RESONANCE_MIN, RESONANCE_MAX, -6, 13)
}
