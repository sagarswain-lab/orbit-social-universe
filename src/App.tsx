import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AuroraBackground } from '@/components/backdrop/AuroraBackground'
import { Starfield } from '@/components/backdrop/Starfield'
import { Toasts } from '@/components/ui/Toasts'
import { Landing } from '@/pages/Landing'
import { UniverseScreen } from '@/features/universe/UniverseScreen'
import { useOrbitStore } from '@/store/useOrbitStore'

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
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/universe" element={<UniverseScreen />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Toasts />
    </>
  )
}
