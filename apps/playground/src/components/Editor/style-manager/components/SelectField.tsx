import { Select } from '@/components/Editor/style-manager/components/Select'
import { useFieldContext } from '@/components/Editor/style-manager/formContext'
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
  const field = useFieldContext<string | undefined>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  // Use isDefaultValue instead of isDirty for non-persistent dirty state
  // const hasChanged = !field.state.meta.isDefaultValue;

  return (
    <div data-invalid={isInvalid}>
      <label htmlFor={field.name} className={hideLabel ? 'sr-only' : 'label-sm ml-1.5 h-6 flex items-center'}>
        {label}
      </label>

      <Select
        items={selectOptions}
        // @ts-expect-error - Base UI Select has strict discriminated union types that conflict when value and onValueChange are both provided
        value={field.state.value ?? undefined}
        onValueChange={(value) => {
          // Store the value - convert empty string to undefined for form state
          // to match schema expectations (empty string would fail min(1) validation)
          const stringValue = typeof value === 'string' ? value : String(value)
          field.setValue(stringValue === '' ? undefined : stringValue)
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
