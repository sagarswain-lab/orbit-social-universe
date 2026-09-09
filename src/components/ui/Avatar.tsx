import { cn } from '@/lib/cn'
import { auraGradient, glowShadow, identityGradient } from '@/lib/color'

interface AvatarProps {
  name: string
  hue: number
  size?: number
  active?: boolean
  glow?: boolean
  className?: string
}

/** Identity gradient disc with the person's initial and optional aura glow. */
export function Avatar({ name, hue, size = 44, active, glow, className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase()
  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      {glow && (
        <div
          aria-hidden
          className="absolute -inset-2 rounded-full"
          style={{ background: auraGradient(hue, 0.9), filter: 'blur(6px)' }}
        />
      )}
      <div
        className="relative grid h-full w-full place-items-center rounded-full font-display font-semibold text-white/95"
        style={{
          background: identityGradient(hue),
          fontSize: size * 0.4,
          boxShadow: glow ? glowShadow(hue, size * 0.6, 0.5) : undefined,
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        {initial}
      </div>
      {active && (
        <span
          className="absolute bottom-0 right-0 block rounded-full border-2 border-[#05060b]"
          style={{
            width: Math.max(9, size * 0.24),
            height: Math.max(9, size * 0.24),
            background: 'linear-gradient(135deg,#4ee6c6,#5aa2ff)',
            boxShadow: '0 0 10px rgba(78,230,198,0.8)',
          }}
        />
      )}
    </div>
  )
}
