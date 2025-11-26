import { Button } from '@/components/primitives/Button/button'
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput as ColorPickerInputComponent,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from '@/components/primitives/ColorPicker/color-picker'
import { Field } from '@/components/primitives/Field/Field'
import { defaultUnitOptions, NumberInput } from '@/components/primitives/NumberInput/number-input'
import { SelectInput } from '@/components/primitives/Select/select'
import { Toggle } from '@/components/primitives/Toggle/toggle'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  IconArrowBarToDown,
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowBarToUp,
  IconBorderSides,
  IconRadiusBottomLeft,
  IconRadiusBottomRight,
  IconRadiusTopLeft,
  IconRadiusTopRight,
} from '@tabler/icons-react'
import React, { useCallback } from 'react'

// Field mapping: Logical CSS properties map to visual positions
// For cardinal layout: blockStart=top, inlineStart=left, inlineEnd=right, blockEnd=bottom
// For corner layout: blockStart=topLeft, inlineStart=topRight, inlineEnd=bottomLeft, blockEnd=bottomRight
export type FieldMapping = {
  blockStart: string // Logical: top/block-start, Visual: top-left
  inlineStart: string // Logical: left/inline-start, Visual: top-right
  inlineEnd: string // Logical: right/inline-end, Visual: bottom-left
  blockEnd: string // Logical: bottom/block-end, Visual: bottom-right
}

// Input type configuration
export type InputType = 'number' | 'text' | 'select' | 'color'

export type SelectOption = {
  value: string
  label: string
}

export type InputConfig = {
  type: InputType
  selectOptions?: SelectOption[] // Required when type is "select"
  colorFormatName?: string // Required when type is "color" - field name for format (hex/rgb/hsl/hsb)
  defaultColorFormat?: 'hex' | 'rgb' | 'hsl' | 'hsb' // Default format for color inputs
  colorFormat?: 'hex' | 'rgb' | 'hsl' | 'hsb' // Current format value (for controlled color inputs)
}

export type InputTypeMapping = {
  blockStart: InputConfig
  inlineStart: InputConfig
  inlineEnd: InputConfig
  blockEnd: InputConfig
}

// Icon mapping: React components for each field position
export type IconMapping = {
  blockStart: React.ComponentType
  inlineStart: React.ComponentType
  inlineEnd: React.ComponentType
  blockEnd: React.ComponentType
}

// Default icons for cardinal layout
const defaultCardinalIcons: IconMapping = {
  blockStart: IconArrowBarToUp,
  inlineStart: IconArrowBarToLeft,
  inlineEnd: IconArrowBarToRight,
  blockEnd: IconArrowBarToDown,
}

// Default icons for corner layout
const defaultCornerIcons: IconMapping = {
  blockStart: IconRadiusTopLeft,
  inlineStart: IconRadiusTopRight,
  inlineEnd: IconRadiusBottomLeft,
  blockEnd: IconRadiusBottomRight,
}

// Helper component to render different input types (dumb version - accepts callbacks)
const FieldInput = React.memo(
  ({
    fieldName,
    value,
    inputConfig,
    canGoBelowZero = false,
    icon,
    label,
    unitValue,
    onChange,
    onUnitChange,
    onFormatChange,
    className,
  }: {
    fieldName: string
    value: string | number
    inputConfig: InputConfig
    canGoBelowZero?: boolean
    icon: React.ReactNode
    label: string
    unitValue?: string
    onChange: (value: string | number) => void
    onUnitChange?: (unit: string) => void
    onFormatChange?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
    className?: string
  }) => {
    const handleNumberChange = useCallback(
      (newValue: number | undefined) => {
        onChange(newValue ?? 0)
      },
      [onChange],
    )

    const handleUnitChange = useCallback(
      (newUnit: string) => {
        onUnitChange?.(newUnit)
      },
      [onUnitChange],
    )

    const handleTextChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
      },
      [onChange],
    )

    const handleSelectChange = useCallback(
      (val: unknown, _eventDetails?: unknown) => {
        onChange(String(val))
      },
      [onChange],
    )

    const handleColorChange = useCallback(
      (val: string) => {
        onChange(val)
      },
      [onChange],
    )

    const renderInput = () => {
      switch (inputConfig.type) {
        case 'number':
          return (
            <NumberInput
              id={fieldName}
              label={label}
              hideLabel={true}
              size="sm"
              value={value as number}
              onChange={handleNumberChange}
              {...(unitValue !== undefined && { unitValue })}
              {...(onUnitChange && { onUnitChange: handleUnitChange })}
              unitOptions={defaultUnitOptions}
              leadingIcon={icon}
              hideControls={true}
              {...(canGoBelowZero ? {} : { min: 0 })}
              {...(className !== undefined && { className })}
            />
          )
        case 'text':
          return (
            <InputGroup className={className}>
              {icon && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupAddon>{icon}</InputGroupAddon>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              )}
              <input
                type="text"
                value={value}
                onChange={handleTextChange}
                className="flex h-9 w-full rounded-input border border-input-border bg-input-bg px-3 py-1 text-sm text-text-primary shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-outline disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={label}
              />
            </InputGroup>
          )
        case 'select': {
          if (!inputConfig.selectOptions) {
            console.warn(`Select options required for field ${fieldName}`)
            return null
          }
          return (
            <SelectInput
              {...(className !== undefined && { className })}
              items={inputConfig.selectOptions}
              {...(typeof value === 'string' ? { value } : {})}
              onValueChange={handleSelectChange}
              id={fieldName}
              aria-label={label}
              leadingIcon={icon}
              size="sm"
              className="w-full"
            />
          )
        }
        case 'color': {
          const format = inputConfig.colorFormat ?? inputConfig.defaultColorFormat ?? 'hex'
          return (
            <div className="color-input">
              {/* Hidden input for accessibility and form association */}
              <div className="color-input-input" role="group">
                <input
                  type="text"
                  id={fieldName}
                  name={fieldName}
                  value={String(value)}
                  readOnly
                  aria-hidden="true"
                  tabIndex={-1}
                  className="sr-only !w-px"
                />
                <ColorPicker
                  value={String(value)}
                  onValueChange={handleColorChange}
                  {...(onFormatChange && { onFormatChange })}
                  defaultFormat={inputConfig.defaultColorFormat || 'hex'}
                  format={format}
                  className="w-full"
                >
                  <ColorPickerTrigger asChild>
                    <Button
                      data-slot="input-group-control"
                      variant="colorPicker"
                      // className="flex items-center justify-start gap-2 px-3 w-full"
                      aria-labelledby={fieldName}
                    >
                      <ColorPickerSwatch className="color-picker-swatch" />
                      {String(value)}
                    </Button>
                  </ColorPickerTrigger>
                  <ColorPickerContent
                    className="color-picker-content"
                    side="top"
                    sideOffset={-20}
                    align="start"
                    alignOffset={16}
                  >
                    <ColorPickerArea />
                    <div className="flex items-center gap-2">
                      <ColorPickerEyeDropper />
                      <div className="flex flex-1 flex-col gap-2">
                        <ColorPickerHueSlider />
                        <ColorPickerAlphaSlider />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ColorPickerFormatSelect defaultValue={inputConfig.defaultColorFormat || 'hex'} />
                      <ColorPickerInputComponent />
                    </div>
                  </ColorPickerContent>
                </ColorPicker>
              </div>
            </div>
          )
        }
        default:
          return null
      }
    }

    return renderInput()
  },
)

FieldInput.displayName = 'FieldInput'

// Value change handlers type
export type ValueChangeHandlers = {
  blockStart: (value: string | number) => void
  inlineStart: (value: string | number) => void
  inlineEnd: (value: string | number) => void
  blockEnd: (value: string | number) => void
}

export type UnitChangeHandlers = {
  blockStart?: (unit: string) => void
  inlineStart?: (unit: string) => void
  inlineEnd?: (unit: string) => void
  blockEnd?: (unit: string) => void
}

export type FormatChangeHandlers = {
  blockStart?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
  inlineStart?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
  inlineEnd?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
  blockEnd?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
}

const CardinalLayout = ({
  blockStartValue,
  inlineStartValue,
  inlineEndValue,
  blockEndValue,
  blockStartUnit,
  inlineStartUnit,
  inlineEndUnit,
  blockEndUnit,
  fields,
  unitFields,
  fieldLabels,
  inputTypes,
  canGoBelowZero,
  hideFieldLabels = false,
  hideUnitSelects = false,
  icons,
  disableDirectionalIcons = false,
  onChange,
  onUnitChange,
  onFormatChange,
}: {
  blockStartValue: string | number
  inlineStartValue: string | number
  inlineEndValue: string | number
  blockEndValue: string | number
  blockStartUnit: string
  inlineStartUnit: string
  inlineEndUnit: string
  blockEndUnit: string
  fields: FieldMapping
  unitFields?: FieldMapping
  fieldLabels: FieldMapping
  inputTypes: InputTypeMapping
  canGoBelowZero?: boolean
  hideFieldLabels?: boolean
  hideUnitSelects?: boolean
  icons?: Partial<IconMapping>
  disableDirectionalIcons?: boolean
  onChange: ValueChangeHandlers
  onUnitChange?: UnitChangeHandlers
  onFormatChange?: FormatChangeHandlers
}) => {
  const fieldIcons = {
    blockStart: icons?.blockStart ?? defaultCardinalIcons.blockStart,
    inlineStart: icons?.inlineStart ?? defaultCardinalIcons.inlineStart,
    inlineEnd: icons?.inlineEnd ?? defaultCardinalIcons.inlineEnd,
    blockEnd: icons?.blockEnd ?? defaultCardinalIcons.blockEnd,
  }

  const BlockStartIcon = fieldIcons.blockStart
  const InlineStartIcon = fieldIcons.inlineStart
  const InlineEndIcon = fieldIcons.inlineEnd
  const BlockEndIcon = fieldIcons.blockEnd
  return (
    <FieldGroup className="flex flex-col gap-2 items-center justify-center">
      <div className="flex flex-row gap-2">
        <Field>
          <FieldLabel htmlFor={fields.blockStart} className={hideFieldLabels ? 'sr-only' : ''}>
            {fieldLabels.blockStart}
          </FieldLabel>

          <FieldInput
            fieldName={fields.blockStart}
            value={blockStartValue}
            inputConfig={inputTypes.blockStart}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <BlockStartIcon />}
            label={fieldLabels.blockStart}
            className={'w-10'}
            onChange={onChange.blockStart}
            {...(!hideUnitSelects &&
              inputTypes.blockStart.type === 'number' &&
              unitFields &&
              onUnitChange?.blockStart && {
                unitValue: blockStartUnit,
                onUnitChange: onUnitChange.blockStart,
              })}
            {...(inputTypes.blockStart.type === 'color' &&
              onFormatChange?.blockStart && {
                onFormatChange: onFormatChange.blockStart,
              })}
          />
        </Field>
      </div>
      <div className="flex flex-row gap-2">
        <Field>
          <FieldLabel htmlFor={fields.inlineStart} className={hideFieldLabels ? 'sr-only' : ''}>
            {fieldLabels.inlineStart}
          </FieldLabel>

          <FieldInput
            fieldName={fields.inlineStart}
            value={inlineStartValue}
            inputConfig={inputTypes.inlineStart}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <InlineStartIcon />}
            label={fieldLabels.inlineStart}
            className={'w-10'}
            onChange={onChange.inlineStart}
            {...(!hideUnitSelects &&
              inputTypes.inlineStart.type === 'number' &&
              unitFields &&
              onUnitChange?.inlineStart && {
                unitValue: inlineStartUnit,
                onUnitChange: onUnitChange.inlineStart,
              })}
            {...(inputTypes.inlineStart.type === 'color' &&
              onFormatChange?.inlineStart && {
                onFormatChange: onFormatChange.inlineStart,
              })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={fields.inlineEnd} className={hideFieldLabels ? 'sr-only' : ''}>
            {fieldLabels.inlineEnd}
          </FieldLabel>

          <FieldInput
            fieldName={fields.inlineEnd}
            value={inlineEndValue}
            inputConfig={inputTypes.inlineEnd}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <InlineEndIcon />}
            label={fieldLabels.inlineEnd}
            className={'w-10'}
            onChange={onChange.inlineEnd}
            {...(!hideUnitSelects &&
              inputTypes.inlineEnd.type === 'number' &&
              unitFields &&
              onUnitChange?.inlineEnd && {
                unitValue: inlineEndUnit,
                onUnitChange: onUnitChange.inlineEnd,
              })}
            {...(inputTypes.inlineEnd.type === 'color' &&
              onFormatChange?.inlineEnd && {
                onFormatChange: onFormatChange.inlineEnd,
              })}
          />
        </Field>
      </div>
      <div className="flex flex-row gap-2">
        <Field>
          <FieldLabel htmlFor={fields.blockEnd} className={hideFieldLabels ? 'sr-only' : ''}>
            {fieldLabels.blockEnd}
          </FieldLabel>

          <FieldInput
            fieldName={fields.blockEnd}
            value={blockEndValue}
            inputConfig={inputTypes.blockEnd}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <BlockEndIcon />}
            label={fieldLabels.blockEnd}
            className={'w-10'}
            onChange={onChange.blockEnd}
            {...(!hideUnitSelects &&
              inputTypes.blockEnd.type === 'number' &&
              unitFields &&
              onUnitChange?.blockEnd && {
                unitValue: blockEndUnit,
                onUnitChange: onUnitChange.blockEnd,
              })}
            {...(inputTypes.blockEnd.type === 'color' &&
              onFormatChange?.blockEnd && {
                onFormatChange: onFormatChange.blockEnd,
              })}
          />
        </Field>
      </div>
    </FieldGroup>
  )
}

const CornerLayout = ({
  blockStartValue,
  inlineStartValue,
  inlineEndValue,
  blockEndValue,
  blockStartUnit,
  inlineStartUnit,
  inlineEndUnit,
  blockEndUnit,
  fields,
  unitFields,
  fieldLabels,
  inputTypes,
  canGoBelowZero,
  hideFieldLabels = false,
  hideUnitSelects = false,
  icons,
  disableDirectionalIcons = false,
  onChange,
  onUnitChange,
  onFormatChange,
}: {
  blockStartValue: string | number
  inlineStartValue: string | number
  inlineEndValue: string | number
  blockEndValue: string | number
  blockStartUnit: string
  inlineStartUnit: string
  inlineEndUnit: string
  blockEndUnit: string
  fields: FieldMapping
  unitFields?: FieldMapping
  fieldLabels: FieldMapping
  inputTypes: InputTypeMapping
  canGoBelowZero?: boolean
  hideFieldLabels?: boolean
  hideUnitSelects?: boolean
  icons?: Partial<IconMapping>
  disableDirectionalIcons?: boolean
  onChange: ValueChangeHandlers
  onUnitChange?: UnitChangeHandlers
  onFormatChange?: FormatChangeHandlers
}) => {
  const fieldIcons = {
    blockStart: icons?.blockStart ?? defaultCornerIcons.blockStart,
    inlineStart: icons?.inlineStart ?? defaultCornerIcons.inlineStart,
    inlineEnd: icons?.inlineEnd ?? defaultCornerIcons.inlineEnd,
    blockEnd: icons?.blockEnd ?? defaultCornerIcons.blockEnd,
  }

  const BlockStartIcon = fieldIcons.blockStart
  const InlineStartIcon = fieldIcons.inlineStart
  const InlineEndIcon = fieldIcons.inlineEnd
  const BlockEndIcon = fieldIcons.blockEnd
  return (
    <FieldGroup className="flex flex-col gap-2 items-center justify-center">
      <div className="flex flex-row gap-1">
        <Field>
          <FieldLabel htmlFor={fields.blockStart} className={hideFieldLabels ? 'sr-only' : ''}>
            {fieldLabels.blockStart}
          </FieldLabel>

          <FieldInput
            fieldName={fields.blockStart}
            value={blockStartValue}
            inputConfig={inputTypes.blockStart}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <BlockStartIcon />}
            label={fieldLabels.blockStart}
            onChange={onChange.blockStart}
            {...(!hideUnitSelects &&
              inputTypes.blockStart.type === 'number' &&
              unitFields &&
              onUnitChange?.blockStart && {
                unitValue: blockStartUnit,
                onUnitChange: onUnitChange.blockStart,
              })}
            {...(inputTypes.blockStart.type === 'color' &&
              onFormatChange?.blockStart && {
                onFormatChange: onFormatChange.blockStart,
              })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={fields.inlineStart} className={hideFieldLabels ? 'sr-only' : ''}>
            {fieldLabels.inlineStart}
          </FieldLabel>

          <FieldInput
            fieldName={fields.inlineStart}
            value={inlineStartValue}
            inputConfig={inputTypes.inlineStart}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <InlineStartIcon />}
            label={fieldLabels.inlineStart}
            onChange={onChange.inlineStart}
            {...(!hideUnitSelects &&
              inputTypes.inlineStart.type === 'number' &&
              unitFields &&
              onUnitChange?.inlineStart && {
                unitValue: inlineStartUnit,
                onUnitChange: onUnitChange.inlineStart,
              })}
            {...(inputTypes.inlineStart.type === 'color' &&
              onFormatChange?.inlineStart && {
                onFormatChange: onFormatChange.inlineStart,
              })}
          />
        </Field>
      </div>
      <div className="flex flex-row gap-2">
        <Field>
          <FieldLabel htmlFor={fields.inlineEnd} className={hideFieldLabels ? 'sr-only' : ''}>
            {fieldLabels.inlineEnd}
          </FieldLabel>

          <FieldInput
            fieldName={fields.inlineEnd}
            value={inlineEndValue}
            inputConfig={inputTypes.inlineEnd}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <InlineEndIcon />}
            label={fieldLabels.inlineEnd}
            onChange={onChange.inlineEnd}
            {...(!hideUnitSelects &&
              inputTypes.inlineEnd.type === 'number' &&
              unitFields &&
              onUnitChange?.inlineEnd && {
                unitValue: inlineEndUnit,
                onUnitChange: onUnitChange.inlineEnd,
              })}
            {...(inputTypes.inlineEnd.type === 'color' &&
              onFormatChange?.inlineEnd && {
                onFormatChange: onFormatChange.inlineEnd,
              })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={fields.blockEnd} className={hideFieldLabels ? 'sr-only' : ''}>
            {fieldLabels.blockEnd}
          </FieldLabel>

          <FieldInput
            fieldName={fields.blockEnd}
            value={blockEndValue}
            inputConfig={inputTypes.blockEnd}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <BlockEndIcon />}
            label={fieldLabels.blockEnd}
            onChange={onChange.blockEnd}
            {...(!hideUnitSelects &&
              inputTypes.blockEnd.type === 'number' &&
              unitFields &&
              onUnitChange?.blockEnd && {
                unitValue: blockEndUnit,
                onUnitChange: onUnitChange.blockEnd,
              })}
            {...(inputTypes.blockEnd.type === 'color' &&
              onFormatChange?.blockEnd && {
                onFormatChange: onFormatChange.blockEnd,
              })}
          />
        </Field>
      </div>
    </FieldGroup>
  )
}

export type DirectionLayoutProps = {
  label: string
  layout?: 'cardinal' | 'corner'
  fields: FieldMapping
  unitFields?: FieldMapping
  fieldLabels?: FieldMapping
  inputTypes?: InputTypeMapping
  canGoBelowZero?: boolean
  hideFieldLabels?: boolean
  hideUnitSelects?: boolean
  icons?: Partial<IconMapping>
  toggleIcon?: React.ReactNode
  uniformFieldIcon?: React.ReactNode
  disableDirectionalIcons?: boolean
  // Values
  blockStartValue: string | number
  inlineStartValue: string | number
  inlineEndValue: string | number
  blockEndValue: string | number
  blockStartUnit?: string
  inlineStartUnit?: string
  inlineEndUnit?: string
  blockEndUnit?: string
  // Uniform mode
  isUniform: boolean
  uniformValue?: string | number
  uniformUnit?: string
  // Callbacks
  onChange: ValueChangeHandlers
  onUniformChange?: (value: string | number) => void
  onUnitChange?: UnitChangeHandlers
  onUniformUnitChange?: (unit: string) => void
  onFormatChange?: FormatChangeHandlers
  onToggleChange?: (isUniform: boolean) => void
}

export const DirectionLayout = ({
  label,
  layout = 'cardinal',
  fields,
  unitFields,
  fieldLabels,
  inputTypes,
  canGoBelowZero = false,
  hideFieldLabels = false,
  hideUnitSelects = false,
  icons,
  toggleIcon,
  uniformFieldIcon,
  disableDirectionalIcons = false,
  blockStartValue,
  inlineStartValue,
  inlineEndValue,
  blockEndValue,
  blockStartUnit = 'px',
  inlineStartUnit = 'px',
  inlineEndUnit = 'px',
  blockEndUnit = 'px',
  isUniform,
  uniformValue,
  uniformUnit = 'px',
  onChange,
  onUniformChange,
  onUnitChange,
  onUniformUnitChange,
  onFormatChange,
  onToggleChange,
}: DirectionLayoutProps) => {
  // Default to number inputs if inputTypes not provided (backward compatibility)
  const defaultInputTypes: InputTypeMapping = {
    blockStart: { type: 'number' },
    inlineStart: { type: 'number' },
    inlineEnd: { type: 'number' },
    blockEnd: { type: 'number' },
  }

  const finalInputTypes = inputTypes ?? defaultInputTypes
  // Default labels based on layout
  const defaultLabels: Record<'cardinal' | 'corner', FieldMapping> = {
    cardinal: {
      blockStart: 'Block Start',
      inlineStart: 'Inline Start',
      inlineEnd: 'Inline End',
      blockEnd: 'Block End',
    },
    corner: {
      blockStart: 'Top Left',
      inlineStart: 'Top Right',
      inlineEnd: 'Bottom Left',
      blockEnd: 'Bottom Right',
    },
  }

  const labels = fieldLabels ?? defaultLabels[layout]

  const handleToggleChange = (pressed: boolean) => {
    onToggleChange?.(pressed)
  }

  return (
    <fieldset>
      <div className="flex items-end justify-between gap-3">
        <legend className="field-label">{label}</legend>
        {onToggleChange && (
          <div className="flex items-center justify-between">
            <Toggle
              pressed={isUniform}
              onPressedChange={handleToggleChange}
              ariaLabel={isUniform ? 'Uniform padding' : 'Individual padding'}
              value="uniform-toggle"
              icon={toggleIcon ?? <IconBorderSides strokeWidth={1.5} />}
              variant="active"
              size="square"
              className="-translate-y-1"
            />
          </div>
        )}
      </div>
      <FieldGroup>
        {isUniform && uniformValue !== undefined ? (
          <Field>
            <FieldInput
              fieldName={fields.inlineStart}
              value={uniformValue}
              inputConfig={finalInputTypes.inlineStart}
              {...(canGoBelowZero !== undefined && { canGoBelowZero })}
              icon={disableDirectionalIcons ? null : (uniformFieldIcon ?? <IconBorderSides />)}
              label={label}
              onChange={onUniformChange ?? onChange.inlineStart}
              {...(!hideUnitSelects &&
                finalInputTypes.inlineStart.type === 'number' &&
                unitFields &&
                onUniformUnitChange && {
                  unitValue: uniformUnit,
                  onUnitChange: onUniformUnitChange,
                })}
              {...(finalInputTypes.inlineStart.type === 'color' &&
                onFormatChange?.inlineStart && {
                  onFormatChange: onFormatChange.inlineStart,
                })}
            />
          </Field>
        ) : (
          <div>
            {layout === 'cardinal' ? (
              <CardinalLayout
                blockStartValue={blockStartValue}
                inlineStartValue={inlineStartValue}
                inlineEndValue={inlineEndValue}
                blockEndValue={blockEndValue}
                blockStartUnit={blockStartUnit}
                inlineStartUnit={inlineStartUnit}
                inlineEndUnit={inlineEndUnit}
                blockEndUnit={blockEndUnit}
                fields={fields}
                {...(unitFields !== undefined && { unitFields })}
                fieldLabels={labels}
                inputTypes={finalInputTypes}
                {...(canGoBelowZero !== undefined && { canGoBelowZero })}
                hideFieldLabels={hideFieldLabels}
                hideUnitSelects={hideUnitSelects}
                {...(icons !== undefined && { icons })}
                disableDirectionalIcons={disableDirectionalIcons}
                onChange={onChange}
                {...(onUnitChange && { onUnitChange })}
                {...(onFormatChange && { onFormatChange })}
              />
            ) : (
              <CornerLayout
                blockStartValue={blockStartValue}
                inlineStartValue={inlineStartValue}
                inlineEndValue={inlineEndValue}
                blockEndValue={blockEndValue}
                blockStartUnit={blockStartUnit}
                inlineStartUnit={inlineStartUnit}
                inlineEndUnit={inlineEndUnit}
                blockEndUnit={blockEndUnit}
                fields={fields}
                {...(unitFields !== undefined && { unitFields })}
                fieldLabels={labels}
                inputTypes={finalInputTypes}
                {...(canGoBelowZero !== undefined && { canGoBelowZero })}
                hideFieldLabels={hideFieldLabels}
                hideUnitSelects={hideUnitSelects}
                {...(icons !== undefined && { icons })}
                disableDirectionalIcons={disableDirectionalIcons}
                onChange={onChange}
                {...(onUnitChange && { onUnitChange })}
                {...(onFormatChange && { onFormatChange })}
              />
            )}
          </div>
        )}
      </FieldGroup>
    </fieldset>
  )
}

export { CardinalLayout, CornerLayout }
