import { useFieldContext } from '@/components/Editor/style-manager/formContext'
import { Field } from '@/components/primitives/Field/Field'
import { SelectInput } from '@/components/primitives/Select/select'
import React from 'react'

export const SelectField = ({
  label,
  selectOptions,
  leadingIcon,
  hideLabel = false,
  ...props
}: {
  label: string
  selectOptions: { value: string; label: string }[]
  leadingIcon?: React.ReactNode
  size?: 'default' | 'sm'
  hideLabel?: boolean
}) => {
  const field = useFieldContext<string | undefined>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const errors: string | string[] | undefined =
    isInvalid && Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? field.state.meta.errors.length === 1
        ? typeof field.state.meta.errors[0] === 'string'
          ? field.state.meta.errors[0]
          : field.state.meta.errors[0]?.message || String(field.state.meta.errors[0])
        : field.state.meta.errors.map((error) => (typeof error === 'string' ? error : error?.message || String(error)))
      : undefined

  return (
    <Field
      {...props}
      {...(label !== undefined && !hideLabel && { label })}
      {...(errors !== undefined && { error: errors })}
      invalid={isInvalid}
    >
      <SelectInput
        items={selectOptions}
        value={field.state.value}
        onValueChange={(value) => {
          // Store the value - convert empty string to undefined for form state
          // to match schema expectations (empty string would fail min(1) validation)
          const stringValue = typeof value === 'string' ? value : String(value)
          field.setValue(stringValue === '' ? undefined : stringValue)
        }}
        size={'sm'}
        className="w-full"
        leadingIcon={leadingIcon}
      />
    </Field>
  )
}
