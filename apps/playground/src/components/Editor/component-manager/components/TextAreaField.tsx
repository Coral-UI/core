import { useFieldContext } from '@/components/Editor/component-manager/formContext'
import { Field, FieldControl } from '@/components/primitives/Field/Field'
import { TextAreaField as TextAreaFieldPrimitive } from '@/components/primitives/TextAreaField/TextAreaField'
import * as React from 'react'

type TextAreaFieldProps = Omit<React.ComponentProps<typeof Field>, 'children' | 'error'> & {
  onChange?: (value: string | undefined) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  required?: boolean
  defaultValue?: string | undefined
  id?: string
}

function TextAreaField({
  label,
  description,
  onChange,
  placeholder,
  rows = 3,
  disabled,
  required,
  defaultValue,
  id,
  ...props
}: TextAreaFieldProps) {
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

  const handleChange = React.useCallback(
    (value: string | undefined) => {
      field.handleChange(value)
      onChange?.(value)
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
      <FieldControl
        render={
          <TextAreaFieldPrimitive
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            required={required}
            defaultValue={defaultValue}
            value={field.state.value}
            onChange={handleChange}
            {...(id !== undefined && { id })}
            className="w-full"
            small
          />
        }
      />
    </Field>
  )
}

export { TextAreaField }
