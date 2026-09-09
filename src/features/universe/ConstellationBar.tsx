import { AnimatePresence, motion } from 'framer-motion'
import { Check, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { hsl } from '@/lib/color'
import { useOrbitStore } from '@/store/useOrbitStore'

/**
 * Contextual bar shown while browsing constellations or drawing a new one.
 * Anchored bottom-center, above the mobile nav.
 */
export function ConstellationBar() {
  const lens = useOrbitStore((s) => s.lens)
  const building = useOrbitStore((s) => s.building)
  const builderIds = useOrbitStore((s) => s.builderIds)
  const constellations = useOrbitStore((s) => s.constellations)
  const activeId = useOrbitStore((s) => s.activeConstellationId)
  const nodes = useOrbitStore((s) => s.nodes)

  const setActive = useOrbitStore((s) => s.setActiveConstellation)
  const startConstellation = useOrbitStore((s) => s.startConstellation)
  const cancel = useOrbitStore((s) => s.cancelConstellation)
  const commit = useOrbitStore((s) => s.commitConstellation)

  const [name, setName] = useState('')

  const show = building || lens === 'constellation'
  const nameOf = (id: string) => nodes.find((n) => n.id === id)?.name ?? '?'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 md:bottom-6"
        >
          <div className="glass-strong pointer-events-auto w-full max-w-2xl rounded-3xl p-3.5">
            {building ? (
              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <Sparkles size={15} style={{ color: hsl(265, 85, 78) }} />
                  <p className="text-sm font-medium text-ink">Draw a constellation</p>
                  <span className="ml-auto text-xs text-ink-mute">
                    {builderIds.length} selected {builderIds.length < 2 && '· pick at least 2'}
                  </span>
                </div>
                <p className="mb-3 text-xs text-ink-mute">Tap stars in your universe to connect them.</p>
                {builderIds.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {builderIds.map((id) => (
                      <Chip key={id} active hue={265}>{nameOf(id)}</Chip>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 28))}
                    placeholder="name this constellation…"
                    className="h-10 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-white/25"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && builderIds.length >= 2) {
                        commit(name)
                        setName('')
                      }
                    }}
                  />
                  <Button variant="ghost" size="sm" onClick={cancel}>
                    <X size={15} /> Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={builderIds.length < 2}
                    onClick={() => {
                      commit(name)
                      setName('')
                    }}
                  >
                    <Check size={15} /> Draw
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Chip active={!activeId} onClick={() => setActive(null)}>All</Chip>
                {constellations.map((c) => (
                  <Chip
                    key={c.id}
                    hue={c.hue}
                    active={activeId === c.id}
                    onClick={() => setActive(activeId === c.id ? null : c.id)}
                    className="whitespace-nowrap"
                  >
                    {c.name}
                    <span className="ml-1 text-ink-faint">{c.memberIds.length}</span>
                  </Chip>
                ))}
                <button
                  type="button"
                  onClick={startConstellation}
                  className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-white/20 px-2.5 py-1 text-xs text-ink-mute transition-colors hover:text-ink"
                >
                  <Sparkles size={13} /> New
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
