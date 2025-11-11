import { NumberInput } from '@/components/style-manager/components/NumberInput'
import { useFieldContext, useFormContext } from '@/components/style-manager/formContext'
import { useStore } from '@tanstack/react-form'
import React from 'react'

export const NumberInputField = ({
  label,
  unitFieldName,
  unitOptions = [
    { value: 'px', label: 'px' },
    { value: '%', label: '%' },
    { value: 'em', label: 'em' },
    { value: 'rem', label: 'rem' },
    { value: 'vh', label: 'vh' },
    { value: 'vw', label: 'vw' },
  ],
  hideLabel = false,
  leadingIcon,
  size = 'default',
  hideControls = false,
  min,
  max,
  step,
  showAuto = false, // New prop to enable "auto" display
}: {
  label: string
  unitFieldName?: string
  unitOptions?: { value: string; label: string }[]
  hideLabel?: boolean
  leadingIcon?: React.ReactNode
  size?: 'default' | 'sm'
  hideControls?: boolean
  min?: number
  max?: number
  step?: number
  showAuto?: boolean // Enable "auto" display for width/height
}) => {
  const field = useFieldContext<number | undefined>()
  const form = useFormContext()

  // Get the unit field value if unitFieldName is provided
  const unitValue = useStore(form.store, (state) => {
    if (!unitFieldName) return null
    const val = state.values[unitFieldName]
    return val !== undefined ? (val as string) : (unitOptions[0]?.value ?? 'px')
  })

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  // Handle number value change
  const handleValueChange = (value: number | undefined) => {
    // When showAuto is true and value is undefined, it means "auto"
    // Keep undefined as undefined (don't convert to 0)
    field.handleChange(value)
  }

  // Handle unit change
  const handleUnitChange = (value: string) => {
    if (unitFieldName) {
      // @ts-expect-error - unitFieldName is a dynamic string key, but TypeScript can't infer the field type
      form.setFieldValue(unitFieldName, value)
    }
  }

  // For width/height with showAuto, display "auto" when value is undefined
  const displayValue = showAuto && field.state.value === undefined ? undefined : field.state.value

  return (
    <fieldset>
      <NumberInput
        label={hideLabel ? '' : label}
        value={displayValue}
        onChange={handleValueChange}
        {...(unitValue !== null && { unitValue: showAuto && field.state.value === undefined ? 'auto' : unitValue })}
        {...(unitFieldName && { onUnitChange: handleUnitChange })}
        unitOptions={unitOptions}
        leadingIcon={leadingIcon}
        size={size}
        hideControls={hideControls}
        {...(isInvalid && field.state.meta.errors?.[0] && { error: field.state.meta.errors[0] })}
        {...(min !== undefined && { min })}
        {...(max !== undefined && { max })}
        {...(step !== undefined && { step })}
        placeholder={showAuto && field.state.value === undefined ? 'auto' : undefined}
      />
      {isInvalid && field.state.meta.errors && (
        <div className="text-sm text-destructive-fg">{field.state.meta.errors[0]}</div>
      )}
    </fieldset>
  )
}
