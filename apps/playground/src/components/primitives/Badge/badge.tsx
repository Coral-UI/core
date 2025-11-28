import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import * as React from 'react'

import './badge.css'

const badgeVariants = cva('badge', {
  variants: {
    variant: {
      default: 'badge-default',
      secondary: 'badge-secondary',
      warning: 'badge-warning',
      destructive: 'badge-destructive',
      outline: 'badge-outline',
      success: 'badge-success',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
