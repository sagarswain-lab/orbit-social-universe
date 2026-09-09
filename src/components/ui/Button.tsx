import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'glass' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: Variant
  size?: Size
  glowHue?: number
  block?: boolean
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[15px] gap-2.5 rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'glass', size = 'md', glowHue, block, className, style, children, ...rest },
  ref,
) {
  const base =
    'relative inline-flex items-center justify-center font-medium select-none transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none'

  const variants: Record<Variant, string> = {
    primary:
      'text-white border border-white/15 shadow-[0_10px_40px_-12px_rgba(139,123,255,0.7)]',
    glass:
      'text-ink-soft glass hover:text-ink border-white/10 hover:border-white/20',
    ghost: 'text-ink-mute hover:text-ink hover:bg-white/5 border border-transparent',
    danger: 'text-rose border border-rose/30 hover:bg-rose/10',
  }

  const primaryBg =
    variant === 'primary'
      ? {
          backgroundImage:
            glowHue != null
              ? `linear-gradient(135deg, hsl(${glowHue} 85% 62%), hsl(${glowHue + 50} 80% 56%))`
              : 'linear-gradient(135deg, #8b7bff, #ff6ad5)',
        }
      : {}

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      className={cn(base, sizes[size], variants[variant], block && 'w-full', className)}
      style={{ ...primaryBg, ...style }}
      {...rest}
    >
      {children}
    </motion.button>
  )
})
