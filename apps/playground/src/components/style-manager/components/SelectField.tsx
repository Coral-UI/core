import { FieldError } from '@/components/style-manager/components/Field'
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

  return (
    <div data-invalid={isInvalid}>
      <label htmlFor={field.name} className={hideLabel ? 'sr-only' : 'label-sm ml-1.5 h-6 flex items-center'}>
        {label}
      </label>

      <Select
        items={selectOptions}
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(value as string)
        }}
        id={field.name}
        size={'sm'}
        leadingIcon={leadingIcon}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </div>
  )
}
