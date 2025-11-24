import type { ToggleProps } from '@base-ui-components/react/toggle'
import { cn } from '@/lib/utils'
import { Toggle as BaseToggle } from '@base-ui-components/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group'
import * as React from 'react'

type ToggleGroupProps = React.ComponentProps<typeof BaseToggleGroup> & { items: ToggleProps[] }

function ToggleGroup({ className, items, ...props }: ToggleGroupProps) {
  return (
    <BaseToggleGroup className={cn('flex gap-px rounded-md bg-input p-0.5 w-full flex-1', className)} {...props}>
      {items.map((item) => (
        <BaseToggle key={item.value} {...item} className="size-4" />
      ))}
    </BaseToggleGroup>
  )
}

export { ToggleGroup }
