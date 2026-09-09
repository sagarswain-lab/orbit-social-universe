import { motion } from 'framer-motion'
import { ArrowDownToLine, MessageSquareDashed, Radio, Sparkles, MapPin } from 'lucide-react'
import { AuraBadge } from '@/components/ui/AuraBadge'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { ResonanceMeter } from '@/components/ui/ResonanceMeter'
import { SignalCard } from '@/components/ui/SignalCard'
import { auraGradient, glowShadow, hsl, identityGradient } from '@/lib/color'
import { relativeTime } from '@/lib/time'
import { useMemo } from 'react'
import type { Community, Person } from '@/data/types'
import { useOrbitStore } from '@/store/useOrbitStore'

export function PresencePanel({ nodeId }: { nodeId: string }) {
  const nodes = useOrbitStore((s) => s.nodes)
  const drift = useOrbitStore((s) => s.drift)
  const node = useMemo(
    () => nodes.find((n) => n.id === nodeId) ?? drift.find((d) => d.node.id === nodeId)?.node,
    [nodes, drift, nodeId],
  )
  const clock = useOrbitStore((s) => s.clock)
  const constellations = useOrbitStore((s) => s.constellations)
  const allSignals = useOrbitStore((s) => s.signals)
  const signals = useMemo(
    () => allSignals.filter((s) => s.authorId === nodeId).sort((a, b) => b.createdAt - a.createdAt),
    [allSignals, nodeId],
  )

  const pullCloser = useOrbitStore((s) => s.pullCloser)
  const tuneIn = useOrbitStore((s) => s.tuneIn)
  const openThread = useOrbitStore((s) => s.openThread)
  const openComposer = useOrbitStore((s) => s.openComposer)
  const setActiveConstellation = useOrbitStore((s) => s.setActiveConstellation)
  const selectNode = useOrbitStore((s) => s.selectNode)

  if (!node) return null
  const isPerson = node.kind === 'person'
  const memberCons = constellations.filter((c) => c.memberIds.includes(node.id))

  return (
    <div className="flex min-h-full flex-col">
      {/* hero */}
      <div className="relative px-6 pb-5 pt-9">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 opacity-60"
          style={{ background: `radial-gradient(120% 80% at 50% -20%, ${hsl(node.hue, 80, 55, 0.5)}, transparent 70%)` }}
        />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <span
              aria-hidden
              className="absolute -inset-3 rounded-full"
              style={{ background: auraGradient(node.hue, 0.9), filter: 'blur(8px)' }}
            />
            <span
              className="relative grid place-items-center rounded-[26%] font-display text-2xl font-bold text-white"
              style={{
                width: 68,
                height: 68,
                background: identityGradient(node.hue),
                boxShadow: glowShadow(node.hue, 40, 0.6),
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: isPerson ? '9999px' : '26%',
              }}
            >
              {node.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold leading-tight text-ink">{node.name}</h2>
            <p className="text-sm text-ink-mute">
              {isPerson ? `@${(node as Person).handle}` : `${(node as Community).members.toLocaleString()} in orbit`}
            </p>
            {isPerson && (node as Person).location && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-faint">
                <MapPin size={11} /> {(node as Person).location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <AuraBadge mood={node.aura.mood} hue={node.hue} note={node.aura.note} />
          <p className="mt-1 text-[11px] text-ink-faint">aura updated {relativeTime(node.aura.updatedAt, clock)}</p>
        </div>
      </div>

      <div className="px-6">
        <div className="hair-divider" />
      </div>

      {/* context + resonance */}
      <div className="space-y-4 px-6 py-5">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          {isPerson ? (node as Person).bio : (node as Community).descriptor}
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
          <p className="text-xs uppercase tracking-wide text-ink-faint">
            {isPerson ? 'shared context' : 'how it gathers'}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {isPerson ? (node as Person).sharedContext : (node as Community).cadence}
          </p>
        </div>
        <ResonanceMeter value={node.resonance} hue={node.hue} />
      </div>

      {/* actions */}
      <div className="grid grid-cols-2 gap-2.5 px-6">
        <Button variant="primary" glowHue={node.hue} onClick={() => pullCloser(node.id)}>
          <ArrowDownToLine size={16} /> Pull closer
        </Button>
        <Button variant="glass" onClick={() => tuneIn(node.id)}>
          <Radio size={16} /> Tune in
        </Button>
        {isPerson ? (
          <Button variant="glass" onClick={() => openThread(node.id)}>
            <MessageSquareDashed size={16} /> Thread
          </Button>
        ) : (
          <Button variant="glass" onClick={() => setActiveConstellation(null)}>
            <Radio size={16} /> Enter room
          </Button>
        )}
        <Button variant="glass" onClick={openComposer}>
          <Sparkles size={16} /> Signal
        </Button>
      </div>

      {/* constellations */}
      {memberCons.length > 0 && (
        <div className="px-6 pt-5">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">in your constellations</p>
          <div className="flex flex-wrap gap-2">
            {memberCons.map((c) => (
              <Chip
                key={c.id}
                hue={c.hue}
                active
                onClick={() => {
                  setActiveConstellation(c.id)
                  selectNode(null)
                }}
              >
                {c.name}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* signals */}
      <div className="px-6 pb-8 pt-6">
        <p className="mb-3 text-xs uppercase tracking-wide text-ink-faint">
          recent signals {signals.length === 0 && '· quiet right now'}
        </p>
        <div className="space-y-3">
          {signals.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <SignalCard signal={s} />
            </motion.div>
          ))}
          {signals.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-sm text-ink-faint">
              No signals in the air. Presence doesn’t require a post.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
