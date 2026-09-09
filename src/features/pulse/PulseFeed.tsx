import { AnimatePresence, motion } from 'framer-motion'
import { Feather, Radio, Signal, X, Zap } from 'lucide-react'
import { useMemo } from 'react'
import { SignalCard } from '@/components/ui/SignalCard'
import { AuraBadge } from '@/components/ui/AuraBadge'
import { Avatar } from '@/components/ui/Avatar'
import { hsl } from '@/lib/color'
import { useOrbitStore } from '@/store/useOrbitStore'

/**
 * PulseFeed — the living, ephemeral alternative to the infinite feed.
 * Shows all recent signals from your orbit, grouped by "now", "today", "drifting away".
 * Slides in from the right side on desktop, fullscreen overlay on mobile.
 */
export function PulseFeed({ open, onClose }: { open: boolean; onClose: () => void }) {
  const signals = useOrbitStore((s) => s.signals)
  const nodes = useOrbitStore((s) => s.nodes)
  const you = useOrbitStore((s) => s.you)
  const clock = useOrbitStore((s) => s.clock)
  const selectNode = useOrbitStore((s) => s.selectNode)

  const activeNodes = useMemo(
    () => nodes.filter((n) => n.activeNow),
    [nodes],
  )

  // Group by orbital distance, not recency — Pulse should read as "who's
  // close to you right now," not "who posted most recently." Recency-first
  // ordering is exactly the reverse-chron feed mechanic this app exists to
  // replace; within each band, newest still surfaces first.
  const liveSignals = useMemo(
    () =>
      [...signals].filter((s) => {
        const age = clock - s.createdAt
        return age < s.lifespanMs
      }),
    [signals, clock],
  )

  const SCOPE_ORDER = ['inner', 'near', 'constellation', 'outer'] as const
  const SCOPE_LABEL: Record<(typeof SCOPE_ORDER)[number], string> = {
    inner: 'Inner orbit',
    near: 'Near orbit',
    constellation: 'Your constellations',
    outer: 'Passing through',
  }

  const grouped = useMemo(
    () =>
      SCOPE_ORDER.map((scope) => ({
        scope,
        label: SCOPE_LABEL[scope],
        items: liveSignals
          .filter((s) => s.scope === scope)
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 12),
      })).filter((g) => g.items.length > 0),
    [liveSignals],
  )

  const emptyOrbit = liveSignals.length === 0

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop (mobile only) */}
          <motion.div
            key="pulse-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1700] bg-black/40 backdrop-blur-sm md:hidden"
          />

          {/* panel */}
          <motion.aside
            key="pulse-panel"
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="fixed inset-y-0 right-0 z-[1800] flex w-full flex-col overflow-hidden border-l border-white/8 bg-[#06071080] backdrop-blur-2xl md:w-96"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-8 w-8 place-items-center rounded-xl"
                  style={{ background: hsl(you.hue, 80, 60, 0.18), color: hsl(you.hue, 90, 78) }}
                >
                  <Signal size={15} />
                </span>
                <div>
                  <h2 className="font-display text-sm font-bold leading-none text-ink">Pulse</h2>
                  <p className="mt-0.5 text-[11px] text-ink-faint">
                    {liveSignals.length} live · {emptyOrbit ? 'quiet' : 'glowing'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-ink-mute transition-colors hover:border-white/25 hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            {/* active presence strip */}
            {activeNodes.length > 0 && (
              <div className="border-b border-white/8 px-4 py-3">
                <p className="mb-2.5 text-[10px] uppercase tracking-widest text-ink-faint">
                  Present now
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeNodes.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        selectNode(n.id)
                        onClose()
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-ink-soft transition-all hover:border-white/25 hover:text-ink"
                    >
                      <Avatar name={n.name} hue={n.hue} size={18} active={n.activeNow} />
                      {n.name}
                      <AuraBadge mood={n.aura.mood} hue={n.hue} compact />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* signals list */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {emptyOrbit ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center"
                >
                  <span
                    className="grid h-16 w-16 place-items-center rounded-full"
                    style={{ background: hsl(you.hue, 70, 55, 0.14) }}
                  >
                    <Feather size={28} style={{ color: hsl(you.hue, 85, 72) }} />
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-ink">
                      The orbit is quiet
                    </p>
                    <p className="mt-1 max-w-xs text-sm leading-relaxed text-ink-mute">
                      No signals in the air right now. Presence doesn't require a post — but when
                      someone emits, it will glow here.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-dashed border-white/15 px-3 py-1.5 text-xs text-ink-faint">
                    <Radio size={12} />
                    Signals appear and decay naturally
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-1">
                  {grouped.map((group, gi) => (
                    <div key={group.scope}>
                      <p className="sticky top-0 z-10 bg-[#06071080] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint backdrop-blur">
                        {group.label}
                      </p>
                      {group.items.map((signal, i) => (
                        <motion.div
                          key={signal.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min((gi * 3 + i) * 0.03, 0.4) }}
                          className="border-b border-white/[0.05] px-4 py-3"
                        >
                          <SignalCard signal={signal} showAuthor />
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* footer */}
            <div className="border-t border-white/8 px-5 py-3">
              <p className="flex items-center gap-1.5 text-center text-[11px] text-ink-faint">
                <Zap size={11} />
                Signals glow for their lifespan, then dissolve. No archive.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
