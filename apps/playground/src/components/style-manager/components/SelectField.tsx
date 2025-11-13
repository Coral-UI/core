import { Select } from '@/components/style-manager/components/Select'
import { useFieldContext } from '@/components/style-manager/formContext'
import React from 'react'

export const SelectField = ({
  label,
  selectOptions,
  leadingIcon,
  hideLabel = false,
}: {
  label: string
  selectOptions: { value: string; label: string }[]
  leadingIcon?: React.ReactNode
  size?: 'default' | 'sm'
  hideLabel?: boolean
}) => {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  // Use isDefaultValue instead of isDirty for non-persistent dirty state
  // const hasChanged = !field.state.meta.isDefaultValue;

  // Normalize undefined to empty string to keep component controlled
  const normalizedValue = field.state.value ?? ''

  return (
    <div data-invalid={isInvalid}>
      <label htmlFor={field.name} className={hideLabel ? 'sr-only' : 'label-sm ml-1.5 h-6 flex items-center'}>
        {label}
      </label>

      <Select
        items={selectOptions}
        value={normalizedValue}
        onValueChange={(value) => {
          // Store the value - convert empty string to undefined for form state
          // to match schema expectations (empty string would fail min(1) validation)
          field.handleChange(value === '' ? undefined : (value as string))
        }}
        id={field.name}
        size={'sm'}
        leadingIcon={leadingIcon}
      />

      {isInvalid && field.state.meta.errors && (
        <div className="text-sm text-destructive-fg mt-1 ml-1.5">
          {field.state.meta.errors.map((error, index) => {
            // Handle both string errors and Zod error objects
            const errorMessage = typeof error === 'string' ? error : error?.message || String(error)
            return <div key={index}>{errorMessage}</div>
          })}
        </div>
      )}
    </div>
  )
}
