import { cn } from '@/lib/utils'
import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible'
import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

// Root component
const Collapsible = BaseCollapsible.Root

// Trigger component
const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof BaseCollapsible.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseCollapsible.Trigger
      ref={ref}
      data-slot="collapsible-trigger"
      className={cn(
        'flex items-center justify-between gap-2 rounded-md py-2 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
    </BaseCollapsible.Trigger>
  )
})
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

// Panel component
const CollapsiblePanel = React.forwardRef<
  React.ElementRef<typeof BaseCollapsible.Panel>,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseCollapsible.Panel
      ref={ref}
      data-slot="collapsible-panel"
      className={cn('overflow-hidden text-sm', className)}
      {...props}
    >
      {children}
    </BaseCollapsible.Panel>
  )
})
CollapsiblePanel.displayName = 'CollapsiblePanel'

export { Collapsible, CollapsiblePanel, CollapsibleTrigger }
