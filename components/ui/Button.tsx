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
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            // Primary
            'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800':
              variant === 'primary',
            // Secondary
            'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700':
              variant === 'secondary',
            // Outline
            'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-950':
              variant === 'outline',
            // Ghost
            'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50':
              variant === 'ghost',
            // Link
            'text-primary-600 hover:underline dark:text-primary-400 p-0':
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
