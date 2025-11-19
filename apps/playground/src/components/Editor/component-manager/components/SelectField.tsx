import { useFieldContext } from '@/components/Editor/component-manager/formContext'
import { Select } from '@/components/Editor/style-manager/components/Select'
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

  return (
    <div data-invalid={isInvalid}>
      <label htmlFor={field.name} className={hideLabel ? 'sr-only' : 'label-sm ml-1.5 h-6 flex items-center'}>
        {label}
      </label>

      <Select
        items={selectOptions}
        value={field.state.value}
        onValueChange={(value: string) => {
          field.handleChange(value)
        }}
        id={field.name}
        size={'sm'}
        leadingIcon={leadingIcon}
      />

      {isInvalid && Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0 && (
        <div className="text-xs text-red-800 mt-1 ml-1.5">
          {field.state.meta.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  )
}
