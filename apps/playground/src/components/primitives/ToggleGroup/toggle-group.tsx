import { cn } from '@/lib/utils'
import { Toggle as BaseToggle } from '@base-ui-components/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group'
import * as React from 'react'

import './toggle-group.css'

type ToggleItem = {
  ariaLabel: string
  value: string
  icon: React.ReactNode
  className?: string
  tooltip?: React.ReactNode
}

type ToggleProps = React.ComponentProps<typeof BaseToggle> & ToggleItem

function Toggle({ ariaLabel, value, className, icon, tooltip, ...props }: ToggleProps) {
  const toggleElement = (
    <BaseToggle aria-label={ariaLabel} value={value} className={cn('toggle-item', className)} {...props}>
      {icon}
    </BaseToggle>
  )

  if (tooltip) {
    // Note: Tooltip component should be imported from ui/tooltip or style-manager/components/Tooltip
    // For now, we'll just return the toggle element without tooltip wrapper
    // The wrapper component can add tooltip if needed
    return toggleElement
  }

  return toggleElement
}

function ToggleGroup({
  className,
  items = [],
  ...props
}: React.ComponentProps<typeof BaseToggleGroup> & {
  className?: string
  items: ToggleItem[]
}) {
  return (
    <BaseToggleGroup className={cn('toggle-group', className)} {...props}>
      {items.map((item) => (
        <Toggle key={item.value} {...item} />
      ))}
    </BaseToggleGroup>
  )
}

export { ToggleGroup, Toggle }
export type { ToggleItem, ToggleProps }
