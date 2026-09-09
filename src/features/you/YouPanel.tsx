import { AnimatePresence, motion } from 'framer-motion'
import { Feather } from 'lucide-react'
import { AuraBadge } from '@/components/ui/AuraBadge'
import { Button } from '@/components/ui/Button'
import { SignalCard } from '@/components/ui/SignalCard'
import { ResonanceMeter, orbitBand } from '@/components/ui/ResonanceMeter'
import { auraGradient, glowShadow, hsl, identityGradient, MOODS, MOOD_KEYS } from '@/lib/color'
import { useOrbitStore } from '@/store/useOrbitStore'

/**
 * YouPanel — slide-in profile panel for the central "you" sun.
 * Shows your aura, recent signals you've emitted, and a shortcut to shift mood.
 */
export function YouPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const you = useOrbitStore((s) => s.you)
  const signals = useOrbitStore((s) => s.signals)
  const setYourMood = useOrbitStore((s) => s.setYourMood)
  const pushToast = useOrbitStore((s) => s.pushToast)
  const openComposer = useOrbitStore((s) => s.openComposer)
  const resetUniverse = useOrbitStore((s) => s.resetUniverse)
  const nodes = useOrbitStore((s) => s.nodes)

  const mySignals = signals
    .filter((s) => s.authorId === 'you')
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 8)

  const cycleMood = () => {
    const i = MOOD_KEYS.indexOf(you.aura.mood)
    const next = MOOD_KEYS[(i + 1) % MOOD_KEYS.length]
    setYourMood(next)
    pushToast(`Your aura · ${MOODS[next].label}`, you.hue)
  }

  const avgResonance = nodes.length
    ? Math.round(nodes.reduce((s, n) => s + n.resonance, 0) / nodes.length)
    : 0

  // Composition of your orbit by closeness, not a headline follower-style
  // count — this is the sentence a stat-box grid would otherwise become.
  const bandCounts = nodes.reduce(
    (acc, n) => {
      acc[orbitBand(n.resonance)]++
      return acc
    },
    { inner: 0, near: 0, outer: 0 },
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="you-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1700] bg-black/30 backdrop-blur-sm"
          />
          <motion.aside
            key="you-panel"
            role="complementary"
            aria-label="Your profile"
            data-feature="user-profile"
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 38 }}
            className="fixed inset-x-0 bottom-0 z-[1800] mx-auto max-w-lg overflow-hidden rounded-t-[32px] border-t border-white/12"
            style={{
              background: `linear-gradient(180deg, ${hsl(you.hue, 40, 10, 0.95)} 0%, #06071099 100%)`,
              backdropFilter: 'blur(28px)',
            }}
          >
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            {/* hero */}
            <div className="relative px-6 pb-5 pt-3">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-50"
                style={{
                  background: `radial-gradient(120% 60% at 50% -10%, ${hsl(you.hue, 85, 55, 0.6)}, transparent 70%)`,
                }}
              />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <span
                    aria-hidden
                    className="absolute -inset-3 rounded-full"
                    style={{ background: auraGradient(you.hue, 0.9), filter: 'blur(8px)' }}
                  />
                  <span
                    className="relative grid place-items-center rounded-full font-display text-2xl font-bold text-white"
                    style={{
                      width: 68,
                      height: 68,
                      background: identityGradient(you.hue),
                      boxShadow: glowShadow(you.hue, 40, 0.65),
                      border: '2px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    {you.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-bold leading-tight text-ink">
                    {you.name}
                  </h2>
                  <p className="text-sm text-ink-mute">@{you.handle} · the center of your universe</p>
                  <div className="mt-1.5">
                    <AuraBadge mood={you.aura.mood} hue={you.hue} note={you.aura.note} />
                  </div>
                </div>
              </div>

              {/* orbit composition — how close people sit, not how many follow you */}
              <div className="mt-5">
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/8">
                  {(['inner', 'near', 'outer'] as const).map((band) =>
                    bandCounts[band] > 0 ? (
                      <div
                        key={band}
                        style={{
                          width: `${(bandCounts[band] / Math.max(nodes.length, 1)) * 100}%`,
                          background:
                            band === 'inner'
                              ? hsl(you.hue, 85, 68)
                              : band === 'near'
                                ? hsl(you.hue + 30, 75, 60)
                                : hsl(you.hue + 60, 50, 45),
                        }}
                      />
                    ) : null,
                  )}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-ink-mute">
                  <span style={{ color: hsl(you.hue, 85, 76) }} className="font-medium">
                    {bandCounts.inner} inner
                  </span>
                  {' · '}
                  {bandCounts.near} near · {bandCounts.outer} outer — {avgResonance}% average
                  resonance · {mySignals.length} signal{mySignals.length === 1 ? '' : 's'} sent
                </p>
              </div>
            </div>

            {/* resonance bar */}
            <div className="px-6 pb-4">
              <div className="hair-divider mb-4" />
              <ResonanceMeter value={avgResonance} hue={you.hue} label="Average orbit resonance" />
            </div>

            {/* actions */}
            <div className="grid grid-cols-2 gap-2.5 px-6 pb-4">
              <Button
                variant="primary"
                glowHue={you.hue}
                onClick={() => {
                  openComposer()
                  onClose()
                }}
              >
                <Feather size={16} /> Emit signal
              </Button>
              <Button variant="glass" onClick={cycleMood}>
                <span style={{ fontSize: 16 }}>{MOODS[you.aura.mood].glyph}</span>
                Shift aura
              </Button>
            </div>

            {/* your recent signals */}
            {mySignals.length > 0 && (
              <div className="border-t border-white/8 px-6 pb-8 pt-4">
                <p className="mb-3 text-[11px] uppercase tracking-widest text-ink-faint">
                  Your recent signals
                </p>
                <div className="space-y-2.5 max-h-48 overflow-y-auto no-scrollbar">
                  {mySignals.map((s) => (
                    <SignalCard key={s.id} signal={s} />
                  ))}
                </div>
              </div>
            )}

            {mySignals.length === 0 && (
              <div className="border-t border-white/8 px-6 pb-6 pt-5 text-center">
                <p className="text-sm text-ink-faint">
                  You haven't emitted any signals yet.
                  <br />
                  Tap <span className="text-ink-soft">Emit signal</span> to send your first.
                </p>
              </div>
            )}

            {/* persistence & reset */}
            <div className="border-t border-white/8 bg-white/[0.02] px-6 py-3.5 flex items-center justify-between">
              <span className="text-[11px] text-ink-faint">Saved locally in your browser</span>
              <button
                type="button"
                onClick={() => {
                  resetUniverse()
                  onClose()
                }}
                className="text-[11px] text-ink-mute hover:text-ink transition-colors underline decoration-white/20"
              >
                Reset layout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
