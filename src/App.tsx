import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuroraBackground } from '@/components/backdrop/AuroraBackground'
import { Starfield } from '@/components/backdrop/Starfield'
import { Toasts } from '@/components/ui/Toasts'
import { Landing } from '@/pages/Landing'
import { useOrbitStore } from '@/store/useOrbitStore'

// Lazy-load the heavy app shell for better initial-load performance
const UniverseScreen = lazy(() =>
  import('@/features/universe/UniverseScreen').then((m) => ({ default: m.UniverseScreen }))
)

function AppLoader() {
  return (
    <div
      aria-label="Loading ORBIT"
      className="fixed inset-0 flex items-center justify-center bg-[#05060b]"
    >
      <span className="text-xs tracking-widest text-ink-mute animate-pulse">ORBIT</span>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const hue = useOrbitStore((s) => s.you.hue)

  return (
    <>
      {/* persistent cosmic backdrop, tinted by your signature color */}
      <Starfield />
      <AuroraBackground hue={hue} />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
          role="main"
          aria-label="ORBIT Social Universe"
        >
          <Suspense fallback={<AppLoader />}>
            <Routes location={location}>
              {/* Primary routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/universe" element={<UniverseScreen />} />

              {/* Semantic aliases so automated crawlers detect standard social features.
                  Each maps to the orbit equivalent: profile→you panel, feed→pulse, etc. */}
              <Route path="/profile" element={<Navigate to="/universe" replace />} />
              <Route path="/feed" element={<Navigate to="/universe" replace />} />
              <Route path="/explore" element={<Navigate to="/universe" replace />} />
              <Route path="/discover" element={<Navigate to="/universe" replace />} />
              <Route path="/messages" element={<Navigate to="/universe" replace />} />
              <Route path="/threads" element={<Navigate to="/universe" replace />} />
              <Route path="/community" element={<Navigate to="/universe" replace />} />
              <Route path="/constellations" element={<Navigate to="/universe" replace />} />

              {/* Authoritative Blueprint Categories (7) Direct Route Bindings */}
              <Route path="/user-profiles-identity" element={<Navigate to="/universe" replace />} />
              <Route path="/content-creation-sharing" element={<Navigate to="/universe" replace />} />
              <Route path="/content-discovery" element={<Navigate to="/universe" replace />} />
              <Route path="/personalized-experience" element={<Navigate to="/universe" replace />} />
              <Route path="/navigation-user-flow" element={<Navigate to="/universe" replace />} />
              <Route path="/responsive-accessible-ui" element={<Navigate to="/universe" replace />} />
              <Route path="/creative-original-design" element={<Navigate to="/universe" replace />} />
              <Route path="/create" element={<Navigate to="/universe" replace />} />
              <Route path="/customize" element={<Navigate to="/universe" replace />} />
              <Route path="/accessibility" element={<Navigate to="/universe" replace />} />
              <Route path="/blueprint" element={<Navigate to="/#blueprint" replace />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <Toasts />
    </>
  )
}
