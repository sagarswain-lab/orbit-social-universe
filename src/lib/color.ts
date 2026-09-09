/** Aura + color helpers. A person's `hue` (0-360) is their signature color. */

export const hsl = (hue: number, s = 85, l = 66, a = 1): string =>
  `hsla(${hue}, ${s}%, ${l}%, ${a})`

/** Soft radial glow used behind orbit nodes and avatars. */
export const auraGradient = (hue: number, intensity = 1): string =>
  `radial-gradient(circle at 50% 45%, ${hsl(hue, 90, 72, 0.95 * intensity)} 0%, ${hsl(
    hue,
    85,
    60,
    0.55 * intensity,
  )} 38%, ${hsl(hue + 24, 80, 52, 0.0)} 72%)`

/** A two-stop identity gradient for avatars / chips. */
export const identityGradient = (hue: number): string =>
  `linear-gradient(135deg, ${hsl(hue, 88, 66)} 0%, ${hsl(hue + 42, 82, 58)} 100%)`

export const glowShadow = (hue: number, px = 40, intensity = 0.6): string =>
  `0 0 ${px}px ${hsl(hue, 90, 62, intensity)}, 0 0 ${px * 2}px ${hsl(
    hue,
    85,
    55,
    intensity * 0.4,
  )}`

export type Mood = 'flow' | 'spark' | 'calm' | 'dream' | 'buzz' | 'still'

export interface MoodMeta {
  label: string
  glyph: string
  blurb: string
}

export const MOODS: Record<Mood, MoodMeta> = {
  flow: { label: 'In flow', glyph: '≈', blurb: 'deep in something' },
  spark: { label: 'Sparking', glyph: '✳', blurb: 'buzzing with ideas' },
  calm: { label: 'Calm', glyph: '◡', blurb: 'settled and open' },
  dream: { label: 'Dreaming', glyph: '☾', blurb: 'somewhere else' },
  buzz: { label: 'Social', glyph: '◎', blurb: 'up for connection' },
  still: { label: 'Still', glyph: '·', blurb: 'quiet for now' },
}

export const MOOD_KEYS = Object.keys(MOODS) as Mood[]
