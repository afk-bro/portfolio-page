import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        // Sizes
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-0.5 text-xs': size === 'md',
        },
        // Variants
        {
          'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300':
            variant === 'default',
          'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300':
            variant === 'primary',
          'bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-500':
            variant === 'success',
          'bg-warning-50 text-warning-600 dark:bg-warning-500/20 dark:text-warning-500':
            variant === 'warning',
          'bg-error-50 text-error-600 dark:bg-error-500/20 dark:text-error-500':
            variant === 'error',
        },
        className
      )}
      {...props}
    />
  )
}
