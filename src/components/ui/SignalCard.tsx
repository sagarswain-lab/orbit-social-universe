import { Aperture, Feather, HelpCircle, Radio, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { hsl } from '@/lib/color'
import { fadesIn, relativeTime, signalLife } from '@/lib/time'
import type { Signal, SignalType } from '@/data/types'
import { useOrbitStore } from '@/store/useOrbitStore'
import { Avatar } from './Avatar'

const TYPE_META: Record<SignalType, { icon: typeof Feather; label: string }> = {
  thought: { icon: Feather, label: 'Thought' },
  moment: { icon: Aperture, label: 'Moment' },
  question: { icon: HelpCircle, label: 'Question' },
  ping: { icon: Radio, label: 'Ping' },
}

interface SignalCardProps {
  signal: Signal
  showAuthor?: boolean
  className?: string
}

/**
 * A single ephemeral signal. Shows its decaying "life" bar and a quiet
 * resonate control — there are no like counts to chase, only shared glow.
 */
export function SignalCard({ signal, showAuthor, className }: SignalCardProps) {
  const clock = useOrbitStore((s) => s.clock)
  const resonateSignal = useOrbitStore((s) => s.resonateSignal)
  const you = useOrbitStore((s) => s.you)
  const getNode = useOrbitStore((s) => s.getNode)

  const author =
    signal.authorId === 'you'
      ? { name: you.name, hue: you.hue, active: true }
      : (() => {
          const n = getNode(signal.authorId)
          return n ? { name: n.name, hue: n.hue, active: n.activeNow } : null
        })()

  const life = signalLife(signal.createdAt, signal.lifespanMs, clock)
  const meta = TYPE_META[signal.type]
  const Icon = meta.icon

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: hsl(signal.hue, 85, 62), opacity: 0.35 + life * 0.5 }}
      />
      <div className="flex items-start gap-3">
        {showAuthor && author && (
          <Avatar name={author.name} hue={author.hue} size={34} active={author.active} />
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 text-xs text-ink-mute">
            <span
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5"
              style={{ color: hsl(signal.hue, 80, 76), background: hsl(signal.hue, 80, 60, 0.14) }}
            >
              <Icon size={11} />
              {meta.label}
            </span>
            {showAuthor && author && <span className="text-ink-soft">{author.name}</span>}
            <span>· {relativeTime(signal.createdAt, clock)}</span>
          </div>
          <p className="text-[15px] leading-snug text-ink">{signal.text}</p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-wide text-ink-faint">
              {fadesIn(signal.createdAt, signal.lifespanMs, clock)}
            </span>
            <button
              type="button"
              onClick={() => resonateSignal(signal.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all',
                signal.resonated
                  ? 'border-white/20 text-ink'
                  : 'border-white/10 text-ink-mute hover:text-ink hover:border-white/20',
              )}
              style={
                signal.resonated
                  ? { background: hsl(signal.hue, 80, 60, 0.16), boxShadow: `0 0 16px ${hsl(signal.hue, 85, 60, 0.5)}` }
                  : undefined
              }
              aria-pressed={signal.resonated}
            >
              <motion.span animate={signal.resonated ? { scale: [1, 1.4, 1] } : {}}>
                <Sparkles size={13} style={{ color: signal.resonated ? hsl(signal.hue, 90, 75) : undefined }} />
              </motion.span>
              {signal.resonated ? 'Resonating' : 'Resonate'}
            </button>
          </div>

          {/* felt warmth, not a score — glow intensity carries what a like count used to,
              with no number to chase or compare */}
          {signal.resonanceCount > 0 && (
            <div className="mt-2 flex items-center gap-1.5" aria-hidden>
              {Array.from({ length: Math.min(signal.resonanceCount, 5) }).map((_, i) => (
                <span
                  key={i}
                  className="h-1 w-1 rounded-full"
                  style={{ background: hsl(signal.hue, 85, 68, 0.7 - i * 0.1) }}
                />
              ))}
              <span className="text-[10px] text-ink-faint">felt by people near you</span>
            </div>
          )}

          {/* decaying life bar */}
          <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-white/6">
            <div
              className="h-full rounded-full"
              style={{
                width: `${life * 100}%`,
                background: hsl(signal.hue, 85, 62),
                opacity: 0.6,
                transition: 'width 1s linear',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
