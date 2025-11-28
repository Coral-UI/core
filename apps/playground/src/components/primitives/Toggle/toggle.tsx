import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Toggle as BaseToggle } from '@base-ui-components/react/toggle'
import { cva } from 'class-variance-authority'
import * as React from 'react'

import './toggle.css'

const toggleVariants = cva(
  "flex items-center justify-center rounded-sm text-muted-foreground select-none focus-visible:bg-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-outline active:bg-interactive-bg-primary/80  [&>svg:not([class*='size-'])]:size-4 text-xs whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default:
          'data-[pressed]:bg-primary data-[pressed]:text-primary-foreground hover:bg-interactive-bg-secondary/60 data-[pressed]:inset-shadow-xs data-[pressed]:inset-shadow-shadow-input border border-input-bg data-[pressed]:border-input-border hover:border-input-border',
        active:
          'bg-accent-blue-bg text-accent-blue-fg hover:bg-accent-blue-fg/20 border border-accent-blue-fg/40 data-[pressed]:bg-card data-[pressed]:text-foreground data-[pressed]:hover:bg-interactive-bg-primary data-[pressed]:border-transparent',
      },
      size: {
        default: 'min-w-8 h-7 px-1',
        sm: 'min-w-5 h-5 px-1',
        square: 'w-4.5 h-4.5 p-0.5',
      },
    },
  },
)

export type ToggleProps = React.ComponentProps<typeof BaseToggle> &
  VariantProps<typeof toggleVariants> & {
    ariaLabel: string
    icon?: React.ReactNode
    tooltip?: React.ReactNode
  }

function Toggle({ ariaLabel, className, icon, variant = 'default', size = 'default', tooltip, ...props }: ToggleProps) {
  const toggleElement = (
    <BaseToggle aria-label={ariaLabel} className={cn('toggle', className)} {...props}>
      {icon}
    </BaseToggle>
  )

  // Tooltip wrapper can be added by parent component if needed
  return toggleElement
}

export { Toggle }
