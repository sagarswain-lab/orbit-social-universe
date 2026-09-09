import { Compass, Orbit, Plus, Radio } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { hsl, MOODS, MOOD_KEYS } from '@/lib/color'
import { useOrbitStore } from '@/store/useOrbitStore'

export interface BottomNavProps {
  onPulseClick?: () => void
}

/** Mobile bottom navigation. Hidden on desktop (md+). */
export function BottomNav({ onPulseClick }: BottomNavProps = {}) {
  const mode = useOrbitStore((s) => s.mode)
  const you = useOrbitStore((s) => s.you)
  const setMode = useOrbitStore((s) => s.setMode)
  const openComposer = useOrbitStore((s) => s.openComposer)
  const setYourMood = useOrbitStore((s) => s.setYourMood)
  const pushToast = useOrbitStore((s) => s.pushToast)

  const cycleMood = () => {
    const i = MOOD_KEYS.indexOf(you.aura.mood)
    const next = MOOD_KEYS[(i + 1) % MOOD_KEYS.length]
    setYourMood(next)
    pushToast(`Your aura · ${MOODS[next].label}`, you.hue)
  }

  const item = (active: boolean) =>
    cn(
      'flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition-colors',
      active ? 'text-ink' : 'text-ink-mute',
    )

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-3 md:hidden">
      <nav aria-label="Main navigation" data-feature="navigation" className="glass-strong pointer-events-auto flex w-full max-w-md items-center gap-1 rounded-full px-3 py-2">
        <button className={item(mode === 'universe')} onClick={() => setMode('universe')}>
          <Orbit size={20} />
          Universe
        </button>
        <button
          className={item(false)}
          onClick={onPulseClick}
        >
          <Radio size={20} />
          Pulse
        </button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={openComposer}
          aria-label="Emit a signal"
          className="mx-1 grid h-14 w-14 -translate-y-3 place-items-center rounded-full text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${hsl(you.hue, 85, 62)}, ${hsl(you.hue + 50, 80, 56)})`,
            boxShadow: `0 10px 30px -8px ${hsl(you.hue, 85, 55, 0.9)}`,
          }}
        >
          <Plus size={26} />
        </motion.button>

        <button className={item(mode === 'drift')} onClick={() => setMode('drift')}>
          <Compass size={20} />
          Drift
        </button>
        <button className={item(false)} onClick={cycleMood} aria-label="Shift your aura">
          <span
            className="grid h-5 w-5 place-items-center rounded-full font-display text-[11px] animate-breathe"
            style={{ color: hsl(you.hue, 90, 80), background: hsl(you.hue, 80, 60, 0.2) }}
          >
            {MOODS[you.aura.mood].glyph}
          </span>
          Aura
        </button>
      </nav>
    </div>
  )
}
