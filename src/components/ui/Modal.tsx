import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { hsl } from '@/lib/color'
import { IconButton } from './IconButton'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  hue?: number
  title?: string
  maxWidth?: number
}

/** Centered dialog with blurred backdrop. Escape + backdrop click close. */
export function Modal({ open, onClose, children, hue = 265, title, maxWidth = 540 }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className="absolute inset-0 bg-[#03040a]/72 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="glass-strong relative m-0 w-full overflow-hidden rounded-t-[26px] sm:m-4 sm:rounded-[26px]"
            style={{ maxWidth }}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ background: `linear-gradient(90deg, transparent, ${hsl(hue, 85, 65)}, transparent)` }}
            />
            <div className="absolute right-3 top-3 z-10">
              <IconButton label="Close" size={34} onClick={onClose}>
                <X size={16} />
              </IconButton>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
