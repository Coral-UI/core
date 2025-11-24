import { cn } from '@/lib/utils'
import { Select as BaseSelect } from '@base-ui-components/react/select'
import { IconCheck, IconSelector } from '@tabler/icons-react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

// Root component
const Select = BaseSelect.Root

// Trigger component
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof BaseSelect.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseSelect.Trigger ref={ref} className={cn('flex items-center justify-between', className)} {...props}>
      {children}
    </BaseSelect.Trigger>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

// Value component
const SelectValue = BaseSelect.Value

// Icon component
const SelectIcon = React.forwardRef<
  React.ElementRef<typeof BaseSelect.Icon>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Icon>
>(({ className, ...props }, ref) => {
  return (
    <BaseSelect.Icon ref={ref} className={cn('opacity-50', className)} {...props}>
      <ChevronDownIcon className="size-4" />
    </BaseSelect.Icon>
  )
})
SelectIcon.displayName = 'SelectIcon'

// Portal component
const SelectPortal = BaseSelect.Portal

// Positioner component
const SelectPositioner = React.forwardRef<
  React.ElementRef<typeof BaseSelect.Positioner>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Positioner>
>(({ className, ...props }, ref) => {
  return <BaseSelect.Positioner ref={ref} className={cn('z-50', className)} sideOffset={8} {...props} />
})
SelectPositioner.displayName = 'SelectPositioner'

// Popup component
const SelectPopup = React.forwardRef<
  React.ElementRef<typeof BaseSelect.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Popup>
>(({ className, ...props }, ref) => {
  return (
    <BaseSelect.Popup
      ref={ref}
      className={cn(
        'bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className,
      )}
      {...props}
    />
  )
})
SelectPopup.displayName = 'SelectPopup'

// List component
const SelectList = React.forwardRef<
  React.ElementRef<typeof BaseSelect.List>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.List>
>(({ className, ...props }, ref) => {
  return <BaseSelect.List ref={ref} className={cn('max-h-[300px] overflow-y-auto p-1', className)} {...props} />
})
SelectList.displayName = 'SelectList'

// Item component
const SelectItem = React.forwardRef<
  React.ElementRef<typeof BaseSelect.Item>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseSelect.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <BaseSelect.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </BaseSelect.ItemIndicator>
      </span>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
})
SelectItem.displayName = 'SelectItem'

// ItemText component
const SelectItemText = BaseSelect.ItemText

// ItemIndicator component
const SelectItemIndicator = BaseSelect.ItemIndicator

// Group component
const SelectGroup = React.forwardRef<
  React.ElementRef<typeof BaseSelect.Group>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Group>
>(({ className, ...props }, ref) => {
  return <BaseSelect.Group ref={ref} {...(className ? { className } : {})} {...props} />
})
SelectGroup.displayName = 'SelectGroup'

// GroupLabel component
const SelectGroupLabel = React.forwardRef<
  React.ElementRef<typeof BaseSelect.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(({ className, ...props }, ref) => {
  return (
    <BaseSelect.GroupLabel
      ref={ref}
      className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
      {...props}
    />
  )
})
SelectGroupLabel.displayName = 'SelectGroupLabel'

// Separator component
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof BaseSelect.Separator>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Separator>
>(({ className, ...props }, ref) => {
  return <BaseSelect.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
})
SelectSeparator.displayName = 'SelectSeparator'

// ScrollUpArrow component
const SelectScrollUpArrow = React.forwardRef<
  React.ElementRef<typeof BaseSelect.ScrollUpArrow>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.ScrollUpArrow>
>(({ className, ...props }, ref) => {
  return (
    <BaseSelect.ScrollUpArrow
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    />
  )
})
SelectScrollUpArrow.displayName = 'SelectScrollUpArrow'

// ScrollDownArrow component
const SelectScrollDownArrow = React.forwardRef<
  React.ElementRef<typeof BaseSelect.ScrollDownArrow>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.ScrollDownArrow>
>(({ className, ...props }, ref) => {
  return (
    <BaseSelect.ScrollDownArrow
      ref={ref}
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    />
  )
})
SelectScrollDownArrow.displayName = 'SelectScrollDownArrow'

// Arrow component (optional, for positioning indicator)
const SelectArrow = BaseSelect.Arrow

// Backdrop component (optional, for overlay)
const SelectBackdrop = BaseSelect.Backdrop

// Complete Select component built from composable primitives
type SelectInputProps = Omit<React.ComponentProps<typeof Select>, 'items'> & {
  size?: 'default' | 'sm'
  leadingIcon?: React.ReactNode
  className?: string
  items?: { value: string; label: string }[]
}

function SelectInput({ items = [], size = 'default', leadingIcon, className, ...props }: SelectInputProps) {
  const itemsArray = Array.isArray(items) ? items : []

  if (itemsArray.length === 0) return null

  // Extract value-related props to handle controlled/uncontrolled
  const { value, defaultValue, onValueChange, ...restProps } = props

  // Build props object conditionally for controlled vs uncontrolled
  const baseProps = {
    items: itemsArray,
    ...restProps,
  }

  const selectProps =
    value !== undefined
      ? { ...baseProps, value: value as string, ...(onValueChange && { onValueChange }) }
      : defaultValue !== undefined
        ? { ...baseProps, defaultValue: defaultValue as string, ...(onValueChange && { onValueChange }) }
        : baseProps

  return (
    <Select {...(selectProps as React.ComponentProps<typeof Select>)}>
      <SelectTrigger
        className={cn(
          'flex items-center justify-between gap-1 rounded-md text-foreground bg-input border border-input-border select-none hover:bg-input-bg/80 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-outline data-[popup-open]:bg-bg-input-bg/80 cursor-default font-medium',
          size === 'sm' ? 'h-8 min-w-24 text-xs pr-2 pl-2.5' : 'h-9 min-w-36 text-sm pr-3 pl-3.5',
          leadingIcon ? 'pl-0' : 'pl-3',
          className,
        )}
      >
        {leadingIcon && (
          <div
            className={cn(
              'shrink-0 text-text-secondary flex items-center justify-center',
              size === 'sm'
                ? "[&>svg:not([class*='size-'])]:size-3.5 w-6"
                : "[&>svg:not([class*='size-'])]:size-4 w-8 ",
            )}
          >
            {leadingIcon}
          </div>
        )}
        <div className="flex items-center gap-2 justify-between w-full">
          <SelectValue />
          <div className="flex">
            <IconSelector className="size-4 text-muted-foreground" />
          </div>
        </div>
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner className="outline-none select-none z-50" sideOffset={8}>
          <SelectPopup className="group origin-[var(--transform-origin)] bg-clip-padding rounded-md bg-card text-muted-foreground shadow-lg shadow-card outline-1 outline-input-border transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none ">
            <SelectList className="relative py-1 scroll-py-6 overflow-y-auto max-h-[var(--available-height)]">
              {itemsArray.map(({ label, value }: { label: string; value: string }) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="grid min-w-[var(--anchor-width)] cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-sm group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-text-primary data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-bg-secondary pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]"
                >
                  <SelectItemIndicator className="col-start-1">
                    <IconCheck className="size-3" />
                  </SelectItemIndicator>
                  <SelectItemText className="col-start-2">{label}</SelectItemText>
                </SelectItem>
              ))}
            </SelectList>
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    </Select>
  )
}

export {
  Select,
  SelectArrow,
  SelectBackdrop,
  SelectGroup,
  SelectGroupLabel,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectScrollDownArrow,
  SelectScrollUpArrow,
  SelectSeparator,
  SelectInput,
  SelectTrigger,
  SelectValue,
}
export type { SelectInputProps }
