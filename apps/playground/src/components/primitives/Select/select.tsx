import { cn } from '@/lib/utils'
import { Select as BaseSelect } from '@base-ui-components/react/select'
import { IconCheck, IconSelector } from '@tabler/icons-react'
import * as React from 'react'

import './select.css'

// Root component - export Base UI Root directly
const Select = BaseSelect.Root

// Trigger component
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof BaseSelect.Trigger>,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <BaseSelect.Trigger ref={ref} className={cn('select-trigger', className)} {...props}>
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
    <BaseSelect.Icon ref={ref} className={cn('select-icon', className)} {...props}>
      <IconSelector />
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
  return <BaseSelect.Positioner ref={ref} className={cn('select-positioner', className)} sideOffset={8} {...props} />
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
        'select-popup',
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
  return <BaseSelect.List ref={ref} className={cn('select-list', className)} {...props} />
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
        'select-item',
        // 'focus:bg-accent focus:text-accent-foreground',
        className,
      )}
      {...props}
    >
      <span className="select-item-indicator">
        <BaseSelect.ItemIndicator>
          <IconCheck />
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

// Content component - convenience wrapper combining Portal, Positioner, Popup, and List
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPopup>,
  React.ComponentPropsWithoutRef<typeof SelectPopup>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPortal>
      <SelectPositioner>
        <SelectPopup ref={ref} {...(className ? { className } : {})} {...props}>
          <SelectList>{children}</SelectList>
        </SelectPopup>
      </SelectPositioner>
    </SelectPortal>
  )
})
SelectContent.displayName = 'SelectContent'

// Complete Select component built from composable primitives
export type SelectInputProps<TValue extends string = string> = Omit<
  React.ComponentProps<typeof Select>,
  'items' | 'value' | 'defaultValue' | 'onValueChange'
> & {
  size?: 'default' | 'sm'
  leadingIcon?: React.ReactNode
  className?: string
  items?: { value: TValue; label: string }[]
} & (
    | {
        value?: TValue | undefined
        onValueChange: (value: TValue) => void
        defaultValue?: never
      }
    | {
        defaultValue?: TValue
        value?: never
        onValueChange?: never
      }
  )

function SelectInput<TValue extends string = string>({
  items = [],
  size = 'default',
  leadingIcon,
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SelectInputProps<TValue>) {
  const itemsArray = Array.isArray(items) ? items : []

  if (itemsArray.length === 0) return null

  const handleValueChange = React.useCallback(
    (newValue: unknown, _eventDetails?: unknown) => {
      if (onValueChange && typeof newValue === 'string') {
        onValueChange(newValue as TValue)
      }
    },
    [onValueChange],
  )

  // Base UI Select has discriminated union types:
  // - Controlled: requires 'value' when 'onValueChange' is provided
  // - Uncontrolled: uses 'defaultValue' when 'onValueChange' is not provided
  // When onValueChange is provided, always use controlled mode to avoid switching between modes
  const isControlled = onValueChange !== undefined

  if (isControlled) {
    // For controlled mode, always provide a value (use empty string if undefined to maintain controlled state)
    const controlledValue = value ?? ('' as TValue)
    return (
      <Select
        {...props}
        items={itemsArray}
        value={controlledValue}
        onValueChange={handleValueChange as (value: TValue | TValue[], eventDetails: unknown) => void}
      >
        <SelectTrigger className={cn(size === 'sm' ? 'sm' : '', leadingIcon ? 'leading-icon' : '', className)}>
          {leadingIcon && <div className={cn('select-leading-icon', size === 'sm' ? 'sm' : '')}>{leadingIcon}</div>}
          <div className="select-trigger-content">
            <SelectValue />
            <SelectIcon>
              <IconSelector />
            </SelectIcon>
          </div>
        </SelectTrigger>
        <SelectPortal>
          <SelectPositioner sideOffset={8}>
            <SelectPopup>
              <SelectScrollUpArrow className="select-scroll-up-arrow select-scroll-arrow" />
              <SelectList>
                {itemsArray.map(({ label, value }: { label: string; value: string }) => (
                  <SelectItem key={label} value={value} className="select-item">
                    <SelectItemText>{label}</SelectItemText>
                  </SelectItem>
                ))}
              </SelectList>
              <SelectScrollDownArrow className="select-scroll-down-arrow select-scroll-arrow" />
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </Select>
    )
  }

  return (
    <Select
      {...props}
      items={itemsArray}
      {...(defaultValue !== undefined && { defaultValue })}
      {...(onValueChange && {
        onValueChange: handleValueChange as (value: TValue | TValue[] | null, eventDetails: unknown) => void,
      })}
    >
      <SelectTrigger className={cn(size === 'sm' ? 'sm' : '', leadingIcon ? 'leading-icon' : '', className)}>
        {leadingIcon && <div className={cn('select-leading-icon', size === 'sm' ? 'sm' : '')}>{leadingIcon}</div>}
        <div className="select-trigger-content">
          <SelectValue />
          <SelectIcon>
            <IconSelector />
          </SelectIcon>
        </div>
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner sideOffset={8}>
          <SelectPopup>
            <SelectScrollUpArrow className="select-scroll-up-arrow select-scroll-arrow" />
            <SelectList>
              {itemsArray.map(({ label, value }: { label: string; value: string }) => (
                <SelectItem key={label} value={value} className="select-item">
                  {/* <SelectItemIndicator className="col-start-1">
                    <IconCheck className="size-3" />
                  </SelectItemIndicator> */}
                  <SelectItemText>{label}</SelectItemText>
                </SelectItem>
              ))}
            </SelectList>
            <SelectScrollDownArrow className="select-scroll-down-arrow select-scroll-arrow" />
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
  SelectContent,
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
