import { useFieldContext } from '@/components/Editor/component-manager/formContext'
import { Field } from '@/components/primitives/Field/Field'
import { Input } from '@/components/primitives/Input/input'
import * as React from 'react'

type TextFieldProps = Omit<React.ComponentProps<typeof Field>, 'children' | 'error'> & {
  onChange?: (value: string | undefined) => void
  id?: string
  placeholder?: string
  required?: boolean
  defaultValue?: string | undefined
}

function TextField({
  label,
  description,
  onChange,
  id,
  placeholder,
  required,
  defaultValue,
  ...props
}: TextFieldProps) {
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value || ''
      field.handleChange(newValue)
      onChange?.(newValue || undefined)
    },
    [field, onChange],
  )

  return (
    <Field
      {...props}
      {...(label !== undefined && { label })}
      {...(description !== undefined && { description })}
      {...(errors !== undefined && { error: errors })}
      invalid={isInvalid}
    >
      <Input
        id={id}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        value={field.state.value || ''}
        onChange={handleChange}
        small
      />
    </Field>
  )
}

export { TextField }
