import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Hand } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { useSimulation } from '@/hooks/useSimulation'
import { useOrbitStore } from '@/store/useOrbitStore'
import { Composer } from '@/features/signals/Composer'
import { DriftView } from '@/features/drift/DriftView'
import { ThreadPanel } from '@/features/threads/ThreadPanel'
import { PulseFeed } from '@/features/pulse/PulseFeed'
import { YouPanel } from '@/features/you/YouPanel'
import { BottomNav } from './BottomNav'
import { ConstellationBar } from './ConstellationBar'
import { Hud } from './Hud'
import { OrbitField } from './OrbitField'
import { PresencePanel } from './PresencePanel'

/** The full ORBIT application shell — the orbital home and everything over it. */
export function UniverseScreen() {
  useSimulation()

  const mode = useOrbitStore((s) => s.mode)
  const selectedId = useOrbitStore((s) => s.selectedId)
  const threadPersonId = useOrbitStore((s) => s.threadPersonId)
  const building = useOrbitStore((s) => s.building)
  const getNode = useOrbitStore((s) => s.getNode)
  const selectNode = useOrbitStore((s) => s.selectNode)
  const closeThread = useOrbitStore((s) => s.closeThread)

  const selected = selectedId ? getNode(selectedId) : undefined
  const threadPerson = threadPersonId ? getNode(threadPersonId) : undefined

  const presenceOpen = !!selected && !building && mode === 'universe' && !threadPersonId

  const [hint, setHint] = useState(true)
  const [pulseOpen, setPulseOpen] = useState(false)
  const [youPanelOpen, setYouPanelOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 6500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      data-feature="social-universe"
      aria-label="ORBIT — Your Social Universe"
    >
      {/* The orbital canvas — your living social graph */}
      <section
        aria-label="Social connection map"
        data-feature="social-graph"
        className="absolute inset-0"
      >
        <OrbitField onCenterClick={() => setYouPanelOpen(true)} />
      </section>

      <Hud onPulseClick={() => setPulseOpen(true)} />
      <ConstellationBar />
      <BottomNav onPulseClick={() => setPulseOpen(true)} />

      {/* first-run hint */}
      <AnimatePresence>
        {hint && mode === 'universe' && !selected && !building && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="pointer-events-none fixed inset-x-0 bottom-40 z-30 flex justify-center px-4 md:bottom-20"
          >
            <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs text-ink-mute">
              <Hand size={13} /> drag a star to pull it closer · tap to feel its presence
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drift — content discovery & people exploration */}
      <AnimatePresence>{mode === 'drift' && <DriftView key="drift" />}</AnimatePresence>

      {/* User profile / presence panel */}
      <Sheet open={presenceOpen} onClose={() => selectNode(null)} hue={selected?.hue ?? 265}>
        {selected && <PresencePanel nodeId={selected.id} />}
      </Sheet>

      {/* Direct messages / thread panel */}
      <Sheet open={!!threadPerson} onClose={closeThread} hue={threadPerson?.hue ?? 265}>
        {threadPerson && <ThreadPanel personId={threadPerson.id} />}
      </Sheet>

      {/* Content creation — post/signal composer */}
      <Composer />

      {/* Content feed — pulse feed of all signals */}
      <PulseFeed open={pulseOpen} onClose={() => setPulseOpen(false)} />

      {/* Your profile panel */}
      <YouPanel open={youPanelOpen} onClose={() => setYouPanelOpen(false)} />
    </div>
  )
}
