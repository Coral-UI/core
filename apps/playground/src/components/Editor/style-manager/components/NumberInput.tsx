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
      {...(isControlled && onChange && { onValueChange: (val) => onChange(val ?? undefined) })}
      className="flex w-full max-w-72 flex-col items-start "
      {...props}
    >
      {label && !hideLabel && (
        <label
          htmlFor={id}
          className={cn('cursor-ew-resize h-6 flex items-center ml-1.5', size === 'sm' ? 'label-sm' : 'label')}
        >
          {label}
        </label>
      )}

      <NumberField.Group
        className={cn(
          'flex rounded-input items-center bg-input-bg has-[>input[aria-invalid=true]]:ring-destructive-fg  has-[>input[aria-invalid=true]]:border-destructive-fg has-[>input[aria-invalid=true]]:bg-destructive-bg interactive-focus-input w-full',
          error && 'ring-destructive-fg border-destructive-fg bg-destructive-bg',
        )}
      >
        <div className={cn('flex items-center justify-center shrink-0', size === 'sm' ? 'w-6' : 'w-8')} role="group">
          <NumberField.ScrubArea
            className={cn(
              "cursor-ew-resize [&>svg:not([class*='text-'])]:text-text-secondary",
              size === 'sm' ? "[&>svg:not([class*='size-'])]:size-3.5" : "[&>svg:not([class*='size-'])]:size-4",
            )}
          >
            {iconToUse}
            <NumberField.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter">
              <IconArrowAutofitContentFilled className={cn(size === 'sm' ? 'size-3.5' : 'size-4')} />
            </NumberField.ScrubAreaCursor>
          </NumberField.ScrubArea>
        </div>
        <NumberField.Input
          className={cn(
            'text-base text-text-primary tabular-nums focus:z-1 focus:outline-none min-w-8 w-full tracking-wide flex-1 shrink-0',
            size === 'sm' ? 'h-7 text-xs' : 'h-9 text-sm ',
            className,
          )}
          min={min}
          max={max}
          step={step}
          aria-invalid={error ? 'true' : undefined}
          placeholder={placeholder}
        />
        {!hideControls && (
          <div className="flex items-center gap-0.5 pr-1.5">
            <NumberField.Decrement
              className={cn(
                'flex items-center justify-center bg-interactive-bg-secondary border border-interactive-border rounded-full p-0.5  bg-clip-padding text-text-primary select-none  hover:bg-interactive-bg-primary/60 active:bg-interactive-bg-primary/80',
                // size === "sm" ? "size-8" : "size-9"
              )}
            >
              <IconMinus className="size-3" />
            </NumberField.Decrement>
            <NumberField.Increment
              className={cn(
                'flex items-center justify-center bg-interactive-bg-secondary border border-interactive-border rounded-full p-0.5 bg-clip-padding text-text-primary select-none  hover:bg-interactive-bg-primary/60 active:bg-interactive-bg-primary/80',
                // size === "sm" ? "size-8" : "size-9"
              )}
            >
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
          <SelectPrimitive.Trigger
            className={cn(
              'flex items-center justify-between gap-1 rounded-tr-input rounded-br-input  text-text-primary bg-[#292929] select-none hover:bg-input-bg/80 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-outline data-[popup-open]:bg-bg-input-bg/80 cursor-default tracking-wide',
              size === 'sm' ? 'h-8 min-w-8 text-xs pr-1 pl-1.5' : 'h-9 min-w-16 text-sm pr-1 pl-1.5',
            )}
          >
            <SelectPrimitive.Value />
            <SelectPrimitive.Icon className="flex">
              <IconChevronDown className="size-3.5 text-text-secondary" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner className="outline-none select-none z-10" sideOffset={8}>
              <SelectPrimitive.Popup className="group origin-[var(--transform-origin)] bg-clip-padding rounded-md bg-bg-surface text-text-secondary shadow-lg shadow-bg-primary outline outline-1 outline-input-border transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none ">
                <SelectPrimitive.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute data-[side=none]:before:top-[-100%] before:left-0 before:h-full before:w-full before:content-['']" />
                <SelectPrimitive.List className="relative py-1 scroll-py-6 overflow-y-auto max-h-[var(--available-height)]">
                  {unitOptions.map(({ label, value }: { label: string; value: string }) => (
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
                <SelectPrimitive.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center rounded-md bg-[canvas] text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] bottom-0 data-[side=none]:before:bottom-[-100%]" />
              </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </NumberField.Group>
    </NumberField.Root>
  )
}

export { NumberInput }
