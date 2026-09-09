import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  label: string
  size?: number
  active?: boolean
}

/** Round glass icon button with an accessible label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, size = 40, active, className, children, ...rest }, ref) {
    return (
      <motion.button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        whileTap={{ scale: 0.92 }}
        whileHover={{ y: -1 }}
        className={cn(
          'grid place-items-center rounded-full border text-ink-soft transition-colors duration-200',
          active
            ? 'border-white/25 bg-white/10 text-ink'
            : 'glass border-white/10 hover:text-ink hover:border-white/20',
          className,
        )}
        style={{ width: size, height: size }}
        {...rest}
      >
        {children}
      </motion.button>
    )
  },
)
