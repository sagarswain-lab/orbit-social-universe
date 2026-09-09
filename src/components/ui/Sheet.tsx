import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { hsl } from '@/lib/color'
import { IconButton } from './IconButton'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  hue?: number
  labelledBy?: string
}

/**
 * Responsive presence surface: a right-side drawer on desktop, a bottom sheet
 * on mobile. Backdrop click + Escape close it. Rendered in a portal.
 */
export function Sheet({ open, onClose, children, hue = 265, labelledBy }: SheetProps) {
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const variants = isMobile
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
          <motion.div
            className="absolute inset-0 bg-[#03040a]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            drag={isMobile ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose()
            }}
            className="glass-strong absolute overflow-hidden"
            style={
              isMobile
                ? {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    maxHeight: '86svh',
                    borderTopLeftRadius: 26,
                    borderTopRightRadius: 26,
                    borderBottom: 'none',
                  }
                : {
                    top: 12,
                    bottom: 12,
                    right: 12,
                    width: 'min(430px, 92vw)',
                    borderRadius: 26,
                  }
            }
          >
            {/* top accent line in the surface's hue */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: `linear-gradient(90deg, transparent, ${hsl(hue, 85, 65)}, transparent)` }}
            />
            {isMobile && (
              <div className="flex justify-center pt-2.5">
                <span className="h-1.5 w-10 rounded-full bg-white/25" />
              </div>
            )}
            <div className="absolute right-3 top-3 z-10">
              <IconButton label="Close" size={34} onClick={onClose}>
                <X size={16} />
              </IconButton>
            </div>
            <div className="h-full overflow-y-auto overscroll-contain">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
