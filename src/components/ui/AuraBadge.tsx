import { cn } from '@/lib/cn'
import { hsl, MOODS, type Mood } from '@/lib/color'

interface AuraBadgeProps {
  mood: Mood
  hue: number
  note?: string
  compact?: boolean
  className?: string
}

/** Ambient presence indicator — a mood glyph + label, no metrics. */
export function AuraBadge({ mood, hue, note, compact, className }: AuraBadgeProps) {
  const meta = MOODS[mood]
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span
        className="grid place-items-center rounded-full font-display animate-breathe"
        style={{
          width: compact ? 20 : 26,
          height: compact ? 20 : 26,
          fontSize: compact ? 11 : 13,
          color: hsl(hue, 90, 78),
          background: hsl(hue, 80, 60, 0.16),
          boxShadow: `inset 0 0 0 1px ${hsl(hue, 80, 65, 0.4)}, 0 0 14px ${hsl(hue, 85, 60, 0.4)}`,
        }}
      >
        {meta.glyph}
      </span>
      <span className={cn('leading-tight', compact && 'text-xs')}>
        <span className="font-medium text-ink-soft">{meta.label}</span>
        {note && !compact && (
          <span className="block text-xs text-ink-mute">{note}</span>
        )}
      </span>
    </div>
  )
}
