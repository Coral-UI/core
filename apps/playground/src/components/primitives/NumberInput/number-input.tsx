import { cn } from '@/lib/utils'
import { NumberField } from '@base-ui-components/react/number-field'
import { Select as SelectPrimitive } from '@base-ui-components/react/select'
import {
  IconArrowAutofitContentFilled,
  IconCheck,
  IconChevronDown,
  IconLetterW,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react'
import { useId } from 'react'
import * as React from 'react'

import './number-input.css'

type NumberInputProps = Omit<
  React.ComponentProps<typeof NumberField.Root>,
  'defaultValue' | 'value' | 'onValueChange'
> & {
  label: string
  description?: string
  error?: string
  size?: 'default' | 'sm'
  leadingIcon?: React.ReactNode
  hideControls?: boolean
  hideLabel?: boolean
  value?: number | undefined
  onChange?: (value: number | undefined) => void
  unitValue?: string
  onUnitChange?: (value: string) => void
  unitOptions?: { label: string; value: string }[]
  defaultValue?: number
  id?: string
  placeholder?: string
}

export const defaultUnitOptions = [
  { label: 'rem', value: 'rem' },
  { label: 'px', value: 'px' },
  { label: '%', value: '%' },
  { label: 'em', value: 'em' },
  { label: 'vh', value: 'vh' },
  { label: 'dvh', value: 'dvh' },
  { label: 'vw', value: 'vw' },
  { label: 'dvw', value: 'dvw' },
]

function NumberInput({
  label,
  size = 'default',
  hideControls = false,
  hideLabel = false,
  value,
  onChange,
  unitValue,
  onUnitChange,
  unitOptions = defaultUnitOptions,
  leadingIcon,
  error,
  min,
  max,
  step,
  defaultValue,
  id: providedId,
  className,
  placeholder,
  ...props
}: NumberInputProps) {
  const generatedId = useId()
  const id = providedId || generatedId

  const unitId = 'unit-' + useId()

  // Determine if we're in controlled mode
  // Note: value can be undefined to represent "auto"
  const isControlled = onChange !== undefined
  const isUnitControlled = unitValue !== undefined && onUnitChange !== undefined

  // When value is undefined and we have a placeholder, show "auto" in unit selector
  const displayUnitValue =
    value === undefined && placeholder === 'auto' ? 'auto' : (unitValue ?? unitOptions[0]?.value ?? 'px')

  // Use leadingIcon if provided, otherwise use default IconLetterW
  const iconToUse = leadingIcon || (
    <IconLetterW className={cn(' text-text-secondary ', size === 'sm' ? 'size-3.5' : 'size-4')} />
  )

  return (
    <NumberField.Root
      id={id}
      {...(isControlled && value !== undefined && { value })}
      {...(!isControlled && { defaultValue: defaultValue ?? 100 })}
      {...(isControlled &&
        onChange && {
          onValueChange: (val: number | null, _eventDetails: unknown) => onChange(val ?? undefined),
        })}
      className="flex w-full max-w-72 flex-col items-start "
      {...props}
    >
      {label && !hideLabel && (
        <label htmlFor={id} className={cn('field-label')}>
          {label}
        </label>
      )}

      <NumberField.Group
        className={cn('number-input-group', error && 'ring-destructive-fg border-destructive-fg bg-destructive-bg')}
      >
        <div className={cn('number-input-scrub-area-wrapper', size === 'sm' ? 'sm' : '')} role="group">
          <NumberField.ScrubArea className={cn('number-input-scrub-area', size === 'sm' ? 'sm' : '')}>
            {iconToUse}
            <NumberField.ScrubAreaCursor>
              <IconArrowAutofitContentFilled className={cn(size === 'sm' ? 'size-3.5' : 'size-4')} />
            </NumberField.ScrubAreaCursor>
          </NumberField.ScrubArea>
        </div>
        <NumberField.Input className={cn('number-input-input', size === 'sm' ? 'sm' : '', className)} />
        {!hideControls && (
          <div className="number-input-controls">
            <NumberField.Decrement className={cn('number-input-control')}>
              <IconMinus className="size-3" />
            </NumberField.Decrement>
            <NumberField.Increment className={cn('number-input-control')}>
              <IconPlus className="size-3" />
            </NumberField.Increment>
          </div>
        )}
        <label htmlFor={unitId} className="sr-only">
          Unit
        </label>
        <SelectPrimitive.Root
          items={displayUnitValue === 'auto' ? [{ label: 'auto', value: 'auto' }, ...unitOptions] : unitOptions}
          value={isUnitControlled ? displayUnitValue : (unitOptions[0]?.value ?? 'px')}
          {...(isUnitControlled &&
            onUnitChange && {
              onValueChange: (value: string) => {
                // If user selects "auto", set the value to undefined
                if (value === 'auto' && onChange) {
                  onChange(undefined)
                } else {
                  onUnitChange(value)
                }
              },
            })}
          id={unitId}
        >
          <SelectPrimitive.Trigger className={cn('number-input-unit-select', size === 'sm' ? 'sm' : '')}>
            <SelectPrimitive.Value />
            <SelectPrimitive.Icon className="number-input-unit-select-icon">
              <IconChevronDown />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner className="select-positioner" sideOffset={8}>
              <SelectPrimitive.Popup className="select-popup">
                <SelectPrimitive.ScrollUpArrow className="select-scroll-up-arrow select-scroll-arrow" />
                <SelectPrimitive.List className="select-list">
                  {unitOptions.map(({ label, value }: { label: string; value: string }) => (
                    <SelectPrimitive.Item key={label} value={value} className="select-item">
                      <span className="select-item-indicator">
                        <SelectPrimitive.ItemIndicator>
                          <IconCheck />
                        </SelectPrimitive.ItemIndicator>
                      </span>
                      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.List>
                <SelectPrimitive.ScrollDownArrow className="select-scroll-down-arrow select-scroll-arrow" />
              </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </NumberField.Group>
    </NumberField.Root>
  )
}

export { NumberInput }
