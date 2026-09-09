import { Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { hsl } from '@/lib/color'
import { clamp } from '@/lib/math'

export const orbitBand = (r: number): 'inner' | 'near' | 'outer' =>
  r >= 80 ? 'inner' : r >= 50 ? 'near' : 'outer'

const bandLabel = {
  inner: 'Inner orbit',
  near: 'Near orbit',
  outer: 'Outer orbit',
} as const

interface ResonanceMeterProps {
  value: number
  hue: number
  className?: string
  label?: string
}

/**
 * Private, mutual connection strength. Deliberately NOT a public metric — no
 * follower count, no like tally. Only the two of you ever see it.
 */
export function ResonanceMeter({ value, hue, className, label }: ResonanceMeterProps) {
  const v = clamp(value, 0, 100)
  const band = orbitBand(v)
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-ink-mute">
          <Lock size={12} className="opacity-70" />
          {label ?? 'Resonance · private'}
        </span>
        <span className="font-medium" style={{ color: hsl(hue, 85, 74) }}>
          {bandLabel[band]}
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${v}%`,
            background: `linear-gradient(90deg, ${hsl(hue - 20, 80, 55)}, ${hsl(
              hue + 30,
              85,
              68,
            )})`,
            boxShadow: `0 0 18px ${hsl(hue, 85, 60, 0.7)}`,
            transition: 'width 700ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        {/* band ticks */}
        {[50, 80].map((t) => (
          <span
            key={t}
            className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/25"
            style={{ left: `${t}%` }}
          />
        ))}
      </div>
    </div>
  )
}
