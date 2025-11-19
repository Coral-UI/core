import { cn } from '@/lib/utils'
import { Select as SelectPrimitive } from '@base-ui-components/react/select'
import { IconCheck, IconSelector } from '@tabler/icons-react'

export type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  size?: 'default' | 'sm'
  leadingIcon?: React.ReactNode
  className?: string
}

function Select({ items = [], size = 'default', leadingIcon, className, ...props }: SelectProps) {
  // Ensure items is an array
  const itemsArray = Array.isArray(items) ? items : []

  if (itemsArray.length === 0) return null

  return (
    <SelectPrimitive.Root items={itemsArray} {...props}>
      <SelectPrimitive.Trigger
        className={cn(
          'flex items-center justify-between gap-1 rounded-md  text-foreground bg-input border border-input-border select-none hover:bg-input-bg/80 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-outline data-[popup-open]:bg-bg-input-bg/80 cursor-default  font-medium',
          size === 'sm' ? 'h-8 min-w-24 text-xs pr-2 pl-2.5' : 'h-9 min-w-36 text-sm pr-3 pl-3.5',
          leadingIcon ? 'pl-0' : 'pl-3',
          className,
        )}
      >
        {leadingIcon && (
          <div
            className={cn(
              'shrink-0  text-text-secondary flex items-center justify-center',
              size === 'sm'
                ? "[&>svg:not([class*='size-'])]:size-3.5 w-6"
                : "[&>svg:not([class*='size-'])]:size-4 w-8 ",
            )}
          >
            {leadingIcon}
          </div>
        )}
        <div className="flex items-center gap-2 justify-between w-full">
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon className="flex">
            <IconSelector className="size-4 text-muted-foreground" />
          </SelectPrimitive.Icon>
        </div>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner className="outline-none select-none z-50" sideOffset={8}>
          <SelectPrimitive.Popup className="group origin-[var(--transform-origin)] bg-clip-padding rounded-md bg-card text-muted-foreground shadow-lg shadow-card outline outline-1 outline-input-border transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none ">
            <SelectPrimitive.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-card text-center text-xs before:absolute data-[side=none]:before:top-[-100%] before:left-0 before:h-full before:w-full before:content-['']" />
            <SelectPrimitive.List className="relative py-1 scroll-py-6 overflow-y-auto max-h-[var(--available-height)]">
              {itemsArray.map(({ label, value }: { label: string; value: string }) => (
                <SelectPrimitive.Item
                  key={label}
                  value={value}
                  className="grid min-w-[var(--anchor-width)] cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-sm group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-text-primary data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-bg-secondary pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                >
                  <SelectPrimitive.ItemIndicator className="col-start-1">
                    <IconCheck className="size-3" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText className="col-start-2">{label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
            <SelectPrimitive.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-card text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] bottom-0 data-[side=none]:before:bottom-[-100%]" />
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export { Select }
