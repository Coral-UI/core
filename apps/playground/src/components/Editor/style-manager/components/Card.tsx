import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const cardVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-bg-muted',
      inner: 'bg-bg-primary',
    },
  },
})

type CardProps = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>

export const Card = ({ children, className, variant = 'default', ...props }: CardProps) => {
  return (
    <div className={cn(cardVariants({ variant, className }))} {...props}>
      {children}
    </div>
  )
}
