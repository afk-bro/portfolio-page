import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-button font-medium',
          'transition-all duration-180 ease-smooth',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-400 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50',
          // Variants
          {
            // Primary - bronze bg with subtle gradient
            'bg-bronze-700 text-ocean-900 hover:bg-bronze-600 active:bg-bronze-900 shadow-sm hover:shadow-md dark:text-dark-base':
              variant === 'primary',
            // Secondary - deep navy surface in dark
            'bg-ocean-50 text-ocean-800 hover:bg-ocean-100 active:bg-ocean-200 dark:bg-white/5 dark:text-sand-500 dark:hover:bg-white/10 dark:border dark:border-white/10':
              variant === 'secondary',
            // Outline - refined border with hover effect
            'border border-ocean-500/35 text-ocean-700 hover:bg-ocean-400/10 hover:border-ocean-500/50 dark:border-white/12 dark:text-sand-500 dark:hover:bg-white/10 dark:hover:border-bronze-500/30':
              variant === 'outline',
            // Ghost - subtle hover state
            'text-ocean-600 hover:bg-ocean-100 hover:text-ocean-800 dark:text-sand-500 dark:hover:bg-white/5 dark:hover:text-sand-400':
              variant === 'ghost',
            // Link - bronze accent
            'text-bronze-700 hover:underline dark:text-bronze-400 p-0':
              variant === 'link',
          },
          // Sizes
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
