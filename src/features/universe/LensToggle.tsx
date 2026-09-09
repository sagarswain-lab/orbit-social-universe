import { Activity, Orbit, Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Lens } from '@/store/useOrbitStore'
import { useOrbitStore } from '@/store/useOrbitStore'

const LENSES: { key: Lens; label: string; icon: typeof Orbit }[] = [
  { key: 'resonance', label: 'Resonance', icon: Orbit },
  { key: 'active', label: 'Active now', icon: Activity },
  { key: 'constellation', label: 'Constellations', icon: Star },
]

/** Switches how the universe is arranged/emphasised — the "view" of your world. */
export function LensToggle({ className }: { className?: string }) {
  const lens = useOrbitStore((s) => s.lens)
  const setLens = useOrbitStore((s) => s.setLens)

  return (
    <div className={cn('glass inline-flex items-center gap-1 rounded-full p-1', className)}>
      {LENSES.map((l) => {
        const Icon = l.icon
        const on = lens === l.key
        return (
          <button
            key={l.key}
            type="button"
            onClick={() => setLens(l.key)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
              on ? 'bg-white/12 text-ink' : 'text-ink-mute hover:text-ink',
            )}
            aria-pressed={on}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{l.label}</span>
          </button>
        )
      })}
    </div>
  )
}
