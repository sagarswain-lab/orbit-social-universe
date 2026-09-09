import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Compass, Sparkles, Users } from 'lucide-react'
import { AuraBadge } from '@/components/ui/AuraBadge'
import { Button } from '@/components/ui/Button'
import { auraGradient, glowShadow, hsl, identityGradient } from '@/lib/color'
import type { Person } from '@/data/types'
import { useOrbitStore } from '@/store/useOrbitStore'

export function DriftView() {
  const drift = useOrbitStore((s) => s.drift)
  const join = useOrbitStore((s) => s.joinFromDrift)
  const setMode = useOrbitStore((s) => s.setMode)
  const getNode = useOrbitStore((s) => s.getNode)

  return (
    <motion.div
      role="region"
      aria-label="Content Discovery & Community Exploration"
      data-feature="Content Discovery"
      data-testid="content-discovery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[1600] overflow-y-auto bg-[#05060b]/72 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-5xl px-5 pb-28 pt-24 sm:pt-28">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-ink-mute">
            <Compass size={13} /> Drift
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
            Wander outward, gently
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-mute">
            No algorithm decides who you meet. These people surfaced through the
            <span className="text-ink-soft"> genuine paths </span>
            already in your universe — a friend of a friend, a shared room, a resonance you both keep.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {drift.map((cand) => {
              const bridge = getNode(cand.bridgeId)
              const isPerson = cand.node.kind === 'person'
              return (
                <motion.article
                  key={cand.node.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className="glass relative overflow-hidden rounded-3xl p-5"
                >
                  <div
                    aria-hidden
                    className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40"
                    style={{ background: auraGradient(cand.node.hue, 0.8), filter: 'blur(10px)' }}
                  />
                  <div className="relative flex items-start gap-4">
                    <div className="relative">
                      <span aria-hidden className="absolute -inset-2 rounded-full" style={{ background: auraGradient(cand.node.hue, 0.8), filter: 'blur(6px)' }} />
                      <span
                        className="relative grid place-items-center font-display text-xl font-bold text-white"
                        style={{
                          width: 60, height: 60,
                          background: identityGradient(cand.node.hue),
                          borderRadius: isPerson ? '9999px' : '26%',
                          boxShadow: glowShadow(cand.node.hue, 34, 0.5),
                          border: '1px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        {isPerson ? cand.node.name.charAt(0) : <Users size={22} />}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-bold text-ink">{cand.node.name}</h3>
                      <p className="text-xs text-ink-mute">
                        {isPerson ? `@${(cand.node as Person).handle}` : cand.node.kind}
                      </p>
                      <p className="mt-1.5 text-sm leading-snug text-ink-soft">
                        {isPerson ? (cand.node as Person).bio : (cand.node as { descriptor: string }).descriptor}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-4">
                    <AuraBadge mood={cand.node.aura.mood} hue={cand.node.hue} compact />
                  </div>

                  <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-ink-faint">how you connect</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      via <span style={{ color: hsl(cand.node.hue, 80, 76) }}>{cand.via}</span>
                      {bridge && <> · through <span className="text-ink">{bridge.name}</span></>}
                    </p>
                    <p className="mt-1 text-xs text-ink-mute">{cand.reason}</p>
                  </div>

                  <div className="relative mt-4">
                    <Button variant="primary" glowHue={cand.node.hue} block onClick={() => join(cand.node.id)}>
                      <Sparkles size={16} /> Let into your orbit
                    </Button>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>

        {drift.length === 0 && (
          <div className="glass mx-auto mt-6 max-w-md rounded-3xl p-8 text-center">
            <p className="text-ink-soft">Your universe is full for now.</p>
            <p className="mt-1 text-sm text-ink-mute">Drift again another day — new paths open as you resonate.</p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button variant="glass" size="lg" onClick={() => setMode('universe')}>
            <ArrowLeft size={16} /> Back to your universe
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
