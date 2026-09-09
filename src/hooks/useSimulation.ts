import { useEffect } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { useOrbitStore } from '@/store/useOrbitStore'

/**
 * Drives the ambient "pulse" of the universe: signals decay, auras drift, and
 * the occasional incoming signal arrives. Pauses while the tab is hidden and
 * slows under reduced-motion. Mock-data only — no network.
 */
export function useSimulation() {
  const tick = useOrbitStore((s) => s.tick)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const interval = reduced ? 9000 : 3400
    const id = window.setInterval(() => {
      if (!document.hidden) tick()
    }, interval)
    return () => window.clearInterval(id)
  }, [tick, reduced])
}
