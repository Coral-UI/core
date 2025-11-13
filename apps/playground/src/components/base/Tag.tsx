import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const tagVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none overflow-hidden font-medium border',
  {
    variants: {
      variant: {
        blue: 'bg-accent-blue-bg text-accent-blue-fg border-accent-blue-fg/10',
        pink: 'bg-accent-pink-bg text-accent-pink-fg border-accent-pink-fg/10',
        green: 'bg-accent-green-bg text-accent-green-fg border-accent-green-fg/10',
        yellow: 'bg-accent-yellow-bg text-accent-yellow-fg border-accent-yellow-fg/10',
        purple: 'bg-accent-purple-bg text-accent-purple-fg border-accent-purple-fg/10',
        orange: 'bg-accent-orange-bg text-accent-orange-fg border-accent-orange-fg/10',
      },
    },
    defaultVariants: {
      variant: 'blue',
    },
  },
)

function Tag({
  variant,
  className,
  children,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof tagVariants>) {
  return (
    <span className={cn(tagVariants({ variant, className }))} {...props}>
      {children}
    </span>
  )
}

export { Tag }
