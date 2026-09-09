import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { hsl } from '@/lib/color'
import { useOrbitStore } from '@/store/useOrbitStore'

/** Ephemeral, non-intrusive notifications — the only "alerts" ORBIT ever shows. */
export function Toasts() {
  const toasts = useOrbitStore((s) => s.toasts)

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-8"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="glass-strong pointer-events-auto flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm text-ink-soft"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                background: t.hue != null ? hsl(t.hue, 85, 65) : '#8b7bff',
                boxShadow: `0 0 10px ${t.hue != null ? hsl(t.hue, 85, 65, 0.9) : 'rgba(139,123,255,0.9)'}`,
              }}
            />
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
