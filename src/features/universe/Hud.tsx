import { Compass, Plus, Radio } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { hsl, MOODS, MOOD_KEYS } from '@/lib/color'
import { useOrbitStore } from '@/store/useOrbitStore'
import { LensToggle } from './LensToggle'

export interface HudProps {
  onPulseClick?: () => void
}

/** Top overlay: brand + your aura (left), lens (center, desktop), actions (right, desktop). */
export function Hud({ onPulseClick }: HudProps = {}) {
  const you = useOrbitStore((s) => s.you)
  const setYourMood = useOrbitStore((s) => s.setYourMood)
  const pushToast = useOrbitStore((s) => s.pushToast)
  const setMode = useOrbitStore((s) => s.setMode)
  const startConstellation = useOrbitStore((s) => s.startConstellation)
  const signals = useOrbitStore((s) => s.signals)

  const cycleMood = () => {
    const i = MOOD_KEYS.indexOf(you.aura.mood)
    const next = MOOD_KEYS[(i + 1) % MOOD_KEYS.length]
    setYourMood(next)
    pushToast(`Your aura · ${MOODS[next].label}`, you.hue)
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-4 sm:p-5">
        {/* brand + aura */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="glass flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-3.5">
            <span
              className="grid h-7 w-7 place-items-center rounded-full font-display text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${hsl(you.hue, 85, 64)}, ${hsl(you.hue + 46, 80, 56)})` }}
            >
              {you.name.charAt(0).toUpperCase()}
            </span>
            <div className="leading-none">
              <p className="font-display text-sm font-bold tracking-tight text-ink">ORBIT</p>
            </div>
          </div>
          <button
            type="button"
            onClick={cycleMood}
            title="Tap to shift your aura"
            className="glass hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs text-ink-soft transition-colors hover:text-ink sm:inline-flex"
          >
            <span
              className="grid h-5 w-5 place-items-center rounded-full font-display text-[11px] animate-breathe"
              style={{ color: hsl(you.hue, 90, 80), background: hsl(you.hue, 80, 60, 0.18) }}
            >
              {MOODS[you.aura.mood].glyph}
            </span>
            {you.name} · {MOODS[you.aura.mood].label}
          </button>
        </div>

        {/* center lens (desktop) */}
        <div className="pointer-events-auto absolute left-1/2 top-4 hidden -translate-x-1/2 sm:top-5 md:block">
          <LensToggle />
        </div>

        {/* actions (desktop) */}
        <div className="pointer-events-auto hidden items-center gap-2 md:flex">
          {onPulseClick && (
            <Button variant="glass" onClick={onPulseClick} className="relative">
              <Radio size={16} className="text-accent-violet" />
              Pulse
              {signals.length > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-violet/20 px-1 text-[10px] font-semibold text-accent-cyan">
                  {signals.length}
                </span>
              )}
            </Button>
          )}
          <Button variant="glass" onClick={startConstellation}>
            <Plus size={16} /> Constellation
          </Button>
          <Button variant="glass" onClick={() => setMode('drift')}>
            <Compass size={16} /> Drift
          </Button>
        </div>
      </div>

      {/* lens toggle for tablet/mobile sits just under brand */}
      <div className="pointer-events-none fixed inset-x-0 top-[68px] z-40 flex justify-center px-4 md:hidden">
        <div className="pointer-events-auto">
          <LensToggle />
        </div>
      </div>
    </>
  )
}
