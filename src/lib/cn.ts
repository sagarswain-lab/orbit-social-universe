/**
 * Tiny className joiner. Keeps deps light — no clsx/tailwind-merge needed for
 * our usage. Accepts strings, arrays, and conditional objects.
 */
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  const walk = (val: ClassValue) => {
    if (!val && val !== 0) return
    if (typeof val === 'string' || typeof val === 'number') {
      out.push(String(val))
    } else if (Array.isArray(val)) {
      val.forEach(walk)
    } else if (typeof val === 'object') {
      for (const key in val) if (val[key]) out.push(key)
    }
  }
  inputs.forEach(walk)
  return out.join(' ')
}
