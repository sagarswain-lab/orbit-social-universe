import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { hsl } from '@/lib/color'

interface ChipProps {
  children: ReactNode
  hue?: number
  active?: boolean
  onClick?: () => void
  className?: string
  title?: string
}

/** Small pill used for scopes, tags, and lens toggles. */
export function Chip({ children, hue, active, onClick, className, title }: ChipProps) {
  const interactive = !!onClick
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={!interactive}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200',
        interactive && 'cursor-pointer hover:border-white/25',
        active
          ? 'border-white/25 text-ink'
          : 'border-white/10 text-ink-mute',
        !interactive && 'cursor-default',
        className,
      )}
      style={
        active
          ? {
              background:
                hue != null
                  ? `${hsl(hue, 80, 60, 0.16)}`
                  : 'rgba(255,255,255,0.08)',
              boxShadow: hue != null ? `inset 0 0 0 1px ${hsl(hue, 80, 65, 0.4)}` : undefined,
            }
          : undefined
      }
    >
      {hue != null && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: hsl(hue, 85, 65), boxShadow: `0 0 8px ${hsl(hue, 85, 65, 0.9)}` }}
        />
      )}
      {children}
    </button>
  )
}
