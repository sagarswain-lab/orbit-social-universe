/** Numeric + geometry helpers used by the orbit engine. */

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Remap `v` from [inMin,inMax] to [outMin,outMax], clamped. */
export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  if (inMax === inMin) return outMin
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * t
}

export interface Point {
  x: number
  y: number
}

/** Polar → cartesian. Angle in radians. Origin at (0,0). */
export const polar = (radius: number, angle: number): Point => ({
  x: Math.cos(angle) * radius,
  y: Math.sin(angle) * radius,
})

export const cartToPolar = (x: number, y: number) => ({
  radius: Math.hypot(x, y),
  angle: Math.atan2(y, x),
})

export const TAU = Math.PI * 2

/** Deterministic pseudo-random from a string seed (stable across renders). */
export const seededRandom = (seed: string): (() => number) => {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}
