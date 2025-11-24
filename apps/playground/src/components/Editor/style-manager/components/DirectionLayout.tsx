import { Card } from '@/components/Editor/style-manager/components/Card'
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
} from '@/components/Editor/style-manager/components/ColorPicker'
import { defaultUnitOptions, NumberInput } from '@/components/Editor/style-manager/components/NumberInput'
import { Select } from '@/components/Editor/style-manager/components/Select'
import { Toggle } from '@/components/Editor/style-manager/components/ToggleGroup'
import { Button } from '@/components/primitives/Button/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
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
import { useStore } from '@tanstack/react-form'
import React, { useCallback, useEffect, useState } from 'react'

import { useFormContext } from '../formContext'

// Field mapping: Logical CSS properties map to visual positions
// For cardinal layout: blockStart=top, inlineStart=left, inlineEnd=right, blockEnd=bottom
// For corner layout: blockStart=topLeft, inlineStart=topRight, inlineEnd=bottomLeft, blockEnd=bottomRight
type FieldMapping = {
  blockStart: string // Logical: top/block-start, Visual: top-left
  inlineStart: string // Logical: left/inline-start, Visual: top-right
  inlineEnd: string // Logical: right/inline-end, Visual: bottom-left
  blockEnd: string // Logical: bottom/block-end, Visual: bottom-right
}

// Input type configuration
type InputType = 'number' | 'text' | 'select' | 'color'

type SelectOption = {
  value: string
  label: string
}

type InputConfig = {
  type: InputType
  selectOptions?: SelectOption[] // Required when type is "select"
  colorFormatName?: string // Required when type is "color" - field name for format (hex/rgb/hsl/hsb)
  defaultColorFormat?: 'hex' | 'rgb' | 'hsl' | 'hsb' // Default format for color inputs
}

type InputTypeMapping = {
  blockStart: InputConfig
  inlineStart: InputConfig
  inlineEnd: InputConfig
  blockEnd: InputConfig
}

// Icon mapping: React components for each field position
type IconMapping = {
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

// Helper component to render different input types
const FieldInput = React.memo(
  ({
    fieldName,
    value,
    inputConfig,
    form,
    canGoBelowZero = false,
    icon,
    label,
    unitValue,
    unitFieldName,
    onChange,
    onUnitChange,
    className,
  }: {
    fieldName: string
    value: string | number
    inputConfig: InputConfig
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any
    canGoBelowZero?: boolean
    icon: React.ReactNode
    label: string
    unitValue?: string
    unitFieldName?: string
    onChange?: (value: string | number) => void
    onUnitChange?: (unit: string) => void
    className?: string
  }) => {
    const handleNumberChange = useCallback(
      (newValue: number) => {
        if (onChange) {
          onChange(newValue)
        } else {
          form.setFieldValue(fieldName, newValue)
        }
      },
      [fieldName, form, onChange],
    )

    const handleUnitChange = useCallback(
      (newUnit: string) => {
        if (onUnitChange) {
          onUnitChange(newUnit)
        } else if (unitFieldName) {
          form.setFieldValue(unitFieldName, newUnit)
        }
      },
      [unitFieldName, form, onUnitChange],
    )

    const handleTextChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(e.target.value)
        } else {
          form.setFieldValue(fieldName, e.target.value)
        }
      },
      [fieldName, form, onChange],
    )

    const handleSelectChange = useCallback(
      (val: unknown) => {
        if (onChange) {
          onChange(String(val))
        } else {
          form.setFieldValue(fieldName, String(val))
        }
      },
      [fieldName, form, onChange],
    )

    const handleColorChange = useCallback(
      (val: string) => {
        if (onChange) {
          onChange(val)
        } else {
          form.setFieldValue(fieldName, val)
        }
      },
      [fieldName, form, onChange],
    )

    const handleFormatChange = useCallback(
      (fmt: 'hex' | 'rgb' | 'hsl' | 'hsb') => {
        const formatName = inputConfig.colorFormatName || `${fieldName}Format`
        form.setFieldValue(formatName, fmt)
      },
      [fieldName, inputConfig.colorFormatName, form],
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
              onChange={(value) => handleNumberChange(value as number)}
              {...(unitValue !== undefined && { unitValue })}
              {...(unitFieldName && { onUnitChange: handleUnitChange })}
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
        case 'select':
          if (!inputConfig.selectOptions) {
            console.warn(`Select options required for field ${fieldName}`)
            return null
          }
          return (
            <Select
              {...(className !== undefined && { className })}
              items={inputConfig.selectOptions}
              value={value as string}
              onValueChange={handleSelectChange}
              id={fieldName}
              aria-label={label}
              leadingIcon={icon}
              size="sm"
            />
          )
        case 'color': {
          const formatName = inputConfig.colorFormatName || `${fieldName}Format`
          const format =
            form.state.values[formatName] !== undefined
              ? (form.state.values[formatName] as 'hex' | 'rgb' | 'hsl' | 'hsb')
              : inputConfig.defaultColorFormat || 'hex'
          return (
            <div className="w-full [&>input]:w-full min-w-0 rounded-md text-foreground font-sans border placeholder:text-muted-foreground [&>input]:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 interactive-invalid-input group interactive-focus-input has-[>input[aria-invalid=true]]:ring-destructive-fg has-[>input[aria-invalid=true]]:border-destructive-fg has-[>input[aria-invalid=true]]:bg-destructive-bg overflow-hidden inline-flex items-center font-normal bg-input border-input-border h-8 text-xs tracking-wide px-2">
              {/* Hidden input for accessibility and form association */}
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
                onFormatChange={handleFormatChange}
                defaultFormat={inputConfig.defaultColorFormat || 'hex'}
                format={format}
                className="w-full"
              >
                <ColorPickerTrigger asChild>
                  <Button
                    data-slot="input-group-control"
                    variant="colorPicker"
                    className="flex items-center justify-start gap-2 px-3 w-full"
                    aria-labelledby={fieldName}
                  >
                    <ColorPickerSwatch className="size-4" />
                    {String(value)}
                  </Button>
                </ColorPickerTrigger>
                <ColorPickerContent
                  className="bg-card border-card-border shadow-lg shadow-card"
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
          )
        }
        default:
          return null
      }
    }

    // NumberInput already includes the icon, so we don't need InputGroup wrapper
    if (inputConfig.type === 'number') {
      return renderInput()
    }

    // Color inputs are already styled and don't need InputGroup wrapper
    if (inputConfig.type === 'color') {
      return renderInput()
    }

    // For other input types, wrap in InputGroup if needed
    if (inputConfig.type === 'text') {
      return renderInput()
    }

    if (inputConfig.type === 'select') {
      return renderInput()
    }

    // Fallback for any other input types
    return renderInput()
  },
)

FieldInput.displayName = 'FieldInput'

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
  form,
  canGoBelowZero,
  hideFieldLabels = false,
  hideUnitSelects = false,
  icons,
  disableDirectionalIcons = false,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  canGoBelowZero?: boolean
  hideFieldLabels?: boolean
  hideUnitSelects?: boolean
  icons?: Partial<IconMapping>
  disableDirectionalIcons?: boolean
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
            form={form}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <BlockStartIcon />}
            label={fieldLabels.blockStart}
            className={'w-10'}
            {...(!hideUnitSelects &&
              inputTypes.blockStart.type === 'number' &&
              unitFields && {
                unitValue: blockStartUnit,
                unitFieldName: unitFields.blockStart,
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
            form={form}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <InlineStartIcon />}
            label={fieldLabels.inlineStart}
            className={'w-10'}
            {...(!hideUnitSelects &&
              inputTypes.inlineStart.type === 'number' &&
              unitFields && {
                unitValue: inlineStartUnit,
                unitFieldName: unitFields.inlineStart,
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
            form={form}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <InlineEndIcon />}
            label={fieldLabels.inlineEnd}
            className={'w-10'}
            {...(!hideUnitSelects &&
              inputTypes.inlineEnd.type === 'number' &&
              unitFields && {
                unitValue: inlineEndUnit,
                unitFieldName: unitFields.inlineEnd,
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
            form={form}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <BlockEndIcon />}
            label={fieldLabels.blockEnd}
            className={'w-10'}
            {...(!hideUnitSelects &&
              inputTypes.blockEnd.type === 'number' &&
              unitFields && {
                unitValue: blockEndUnit,
                unitFieldName: unitFields.blockEnd,
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
  form,
  canGoBelowZero,
  hideFieldLabels = false,
  hideUnitSelects = false,
  icons,
  disableDirectionalIcons = false,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  canGoBelowZero?: boolean
  hideFieldLabels?: boolean
  hideUnitSelects?: boolean
  icons?: Partial<IconMapping>
  disableDirectionalIcons?: boolean
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
            form={form}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <BlockStartIcon />}
            label={fieldLabels.blockStart}
            {...(!hideUnitSelects &&
              inputTypes.blockStart.type === 'number' &&
              unitFields && {
                unitValue: blockStartUnit,
                unitFieldName: unitFields.blockStart,
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
            form={form}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <InlineStartIcon />}
            label={fieldLabels.inlineStart}
            {...(!hideUnitSelects &&
              inputTypes.inlineStart.type === 'number' &&
              unitFields && {
                unitValue: inlineStartUnit,
                unitFieldName: unitFields.inlineStart,
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
            form={form}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <InlineEndIcon />}
            label={fieldLabels.inlineEnd}
            {...(!hideUnitSelects &&
              inputTypes.inlineEnd.type === 'number' &&
              unitFields && {
                unitValue: inlineEndUnit,
                unitFieldName: unitFields.inlineEnd,
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
            form={form}
            {...(canGoBelowZero !== undefined && { canGoBelowZero })}
            icon={disableDirectionalIcons ? null : <BlockEndIcon />}
            label={fieldLabels.blockEnd}
            {...(!hideUnitSelects &&
              inputTypes.blockEnd.type === 'number' &&
              unitFields && {
                unitValue: blockEndUnit,
                unitFieldName: unitFields.blockEnd,
              })}
          />
        </Field>
      </div>
    </FieldGroup>
  )
}

export const DirectionLayoutField = ({
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
}: {
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
}) => {
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
  const form = useFormContext()
  const [isUniform, setIsUniform] = useState(true)

  // Subscribe to form state changes reactively
  // Values can be string or number depending on input type
  const inlineStartValue = useStore(form.store, (state) => {
    const val = state.values[fields.inlineStart]
    if (finalInputTypes.inlineStart.type === 'number') {
      return val !== undefined ? (val as number) : 0
    }
    return val !== undefined ? (val as string) : ''
  })
  const inlineEndValue = useStore(form.store, (state) => {
    const val = state.values[fields.inlineEnd]
    if (finalInputTypes.inlineEnd.type === 'number') {
      return val !== undefined ? (val as number) : 0
    }
    return val !== undefined ? (val as string) : ''
  })
  const blockStartValue = useStore(form.store, (state) => {
    const val = state.values[fields.blockStart]
    if (finalInputTypes.blockStart.type === 'number') {
      return val !== undefined ? (val as number) : 0
    }
    return val !== undefined ? (val as string) : ''
  })
  const blockEndValue = useStore(form.store, (state) => {
    const val = state.values[fields.blockEnd]
    if (finalInputTypes.blockEnd.type === 'number') {
      return val !== undefined ? (val as number) : 0
    }
    return val !== undefined ? (val as string) : ''
  })

  // Subscribe to unit values (only if unitFields provided)
  const inlineStartUnit = useStore(form.store, (state) => {
    if (!unitFields) return 'px'
    const val = state.values[unitFields.inlineStart]
    return val !== undefined ? (val as string) : 'px'
  })
  const inlineEndUnit = useStore(form.store, (state) => {
    if (!unitFields) return 'px'
    const val = state.values[unitFields.inlineEnd]
    return val !== undefined ? (val as string) : 'px'
  })
  const blockStartUnit = useStore(form.store, (state) => {
    if (!unitFields) return 'px'
    const val = state.values[unitFields.blockStart]
    return val !== undefined ? (val as string) : 'px'
  })
  const blockEndUnit = useStore(form.store, (state) => {
    if (!unitFields) return 'px'
    const val = state.values[unitFields.blockEnd]
    return val !== undefined ? (val as string) : 'px'
  })

  // Initialize uniformValue and uniformUnit from form state
  const [uniformValue, setUniformValue] = useState<string | number>(inlineStartValue)
  const [uniformUnit, setUniformUnit] = useState<string>(inlineStartUnit)

  // Sync uniformValue and uniformUnit whenever form values change (handles reset and mode changes)
  useEffect(() => {
    if (isUniform) {
      // Always sync uniformValue and uniformUnit to inlineStartValue/inlineStartUnit when in uniform mode
      // This ensures it resets properly when form.reset() is called
      setUniformValue(inlineStartValue)
      setUniformUnit(inlineStartUnit)
    }
  }, [
    isUniform,
    inlineStartValue,
    inlineEndValue,
    blockStartValue,
    blockEndValue,
    inlineStartUnit,
    inlineEndUnit,
    blockStartUnit,
    blockEndUnit,
  ])

  // When in uniform mode and value changes, update all fields
  const handleUniformChange = (value: string | number) => {
    setUniformValue(value)
    // @ts-expect-error - Dynamic field names, TypeScript can't infer types
    form.setFieldValue(fields.inlineStart, value)
    // @ts-expect-error - Dynamic field names, TypeScript can't infer types
    form.setFieldValue(fields.inlineEnd, value)
    // @ts-expect-error - Dynamic field names, TypeScript can't infer types
    form.setFieldValue(fields.blockStart, value)
    // @ts-expect-error - Dynamic field names, TypeScript can't infer types
    form.setFieldValue(fields.blockEnd, value)
  }

  // When in uniform mode and unit changes, update all unit fields
  const handleUniformUnitChange = (unit: string) => {
    setUniformUnit(unit)
    if (unitFields) {
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(unitFields.inlineStart, unit)
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(unitFields.inlineEnd, unit)
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(unitFields.blockStart, unit)
      // @ts-expect-error - Dynamic field names, TypeScript can't infer types
      form.setFieldValue(unitFields.blockEnd, unit)
    }
  }

  const handleToggleChange = (pressed: boolean) => {
    setIsUniform(pressed)
    if (pressed) {
      // When switching to uniform, sync all fields to the first field's value and unit
      // This ensures consistency when switching modes
      handleUniformChange(inlineStartValue)
      handleUniformUnitChange(inlineStartUnit)
    }
    // When switching to individual, no action needed - values are already in form state
  }

  return (
    <fieldset>
      <div className="flex items-end justify-between gap-3">
        <legend className="label-sm h-6 flex items-center ml-1.5">{label}</legend>
        <div className="flex items-center justify-between">
          <Toggle
            pressed={isUniform}
            onPressedChange={handleToggleChange}
            ariaLabel={isUniform ? 'Uniform padding' : 'Individual padding'}
            value="uniform-toggle"
            icon={toggleIcon ?? <IconBorderSides strokeWidth={1.5} />}
            variant="active"
            size="square"
            title={isUniform ? 'Uniform padding mode' : 'Individual padding mode'}
            className="-translate-y-1"
          />
        </div>
      </div>
      <FieldGroup>
        {isUniform ? (
          <Field>
            <FieldLabel htmlFor={fields.inlineStart} className="sr-only">
              {label}
            </FieldLabel>
            <FieldInput
              fieldName={fields.inlineStart}
              value={uniformValue}
              inputConfig={finalInputTypes.inlineStart}
              form={form}
              {...(canGoBelowZero !== undefined && { canGoBelowZero })}
              icon={disableDirectionalIcons ? null : (uniformFieldIcon ?? <IconBorderSides />)}
              label={label}
              {...(!hideUnitSelects &&
                finalInputTypes.inlineStart.type === 'number' &&
                unitFields && { unitValue: uniformUnit })}
              {...(!hideUnitSelects &&
                finalInputTypes.inlineStart.type === 'number' &&
                unitFields && { unitFieldName: unitFields.inlineStart })}
              onChange={handleUniformChange}
              onUnitChange={handleUniformUnitChange}
            />
          </Field>
        ) : (
          <Card>
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
                form={form}
                {...(canGoBelowZero !== undefined && { canGoBelowZero })}
                hideFieldLabels={hideFieldLabels}
                hideUnitSelects={hideUnitSelects}
                {...(icons !== undefined && { icons })}
                disableDirectionalIcons={disableDirectionalIcons}
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
                form={form}
                {...(canGoBelowZero !== undefined && { canGoBelowZero })}
                hideFieldLabels={hideFieldLabels}
                hideUnitSelects={hideUnitSelects}
                {...(icons !== undefined && { icons })}
                disableDirectionalIcons={disableDirectionalIcons}
              />
            )}
          </Card>
        )}
      </FieldGroup>
    </fieldset>
  )
}
