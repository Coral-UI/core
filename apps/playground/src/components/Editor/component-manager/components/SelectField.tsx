import { useFieldContext } from '@/components/Editor/component-manager/formContext'
import { Field } from '@/components/primitives/Field/Field'
import { SelectInput } from '@/components/primitives/Select/select'
import * as React from 'react'

type SelectFieldProps = Omit<React.ComponentProps<typeof Field>, 'children' | 'error'> & {
  selectOptions: { value: string; label: string }[]
  leadingIcon?: React.ReactNode
  size?: 'default' | 'sm'
  hideLabel?: boolean
  onChange?: (value: string) => void
}

function SelectField({
  label,
  selectOptions,
  leadingIcon,
  size = 'sm',
  hideLabel = false,
  onChange,
  ...props
}: SelectFieldProps) {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const errors: string | string[] | undefined =
    isInvalid && Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0
      ? field.state.meta.errors.length === 1
        ? typeof field.state.meta.errors[0] === 'string'
          ? field.state.meta.errors[0]
          : field.state.meta.errors[0]?.message || String(field.state.meta.errors[0])
        : field.state.meta.errors.map((error) => (typeof error === 'string' ? error : error?.message || String(error)))
      : undefined

  const handleChange = React.useCallback(
    (value: unknown) => {
      const stringValue = value as string
      field.handleChange(stringValue)
      onChange?.(stringValue)
    },
    [field, onChange],
  )

  return (
    <Field
      {...props}
      {...(label !== undefined && !hideLabel && { label })}
      {...(errors !== undefined && { error: errors })}
      invalid={isInvalid}
    >
      <SelectInput
        items={selectOptions}
        defaultValue={field.state.value}
        onValueChange={handleChange}
        size={size}
        leadingIcon={leadingIcon}
      />
    </Field>
  )
}

export { SelectField }
