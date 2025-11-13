import { useFieldContext } from '@/components/component-manager/formContext'
import { Field } from '@base-ui-components/react/field'
import * as React from 'react'

type TextAreaFieldProps = React.ComponentProps<typeof Field.Root> & {
  label: string
  description?: string
  error?: string
  value?: string | undefined
  onChange?: (value: string | undefined) => void
  defaultValue?: string | undefined
  id?: string
  placeholder?: string
}

function TextAreaField({
  label,
  description,
  error,
  value,
  onChange,
  defaultValue,
  id,
  placeholder,
  ...props
}: TextAreaFieldProps) {
  const field = useFieldContext<string | undefined>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field.Root {...props}>
      <Field.Label className="h-6 flex items-center ml-1.5 label-sm">{label}</Field.Label>
      <textarea
        placeholder={placeholder}
        className="flex border border-input-border rounded-input items-center bg-input-bg has-[>input[aria-invalid=true]]:ring-destructive-fg  has-[>input[aria-invalid=true]]:border-destructive-fg has-[>input[aria-invalid=true]]:bg-destructive-bg interactive-focus-input w-full min-h-7.5 text-xs text-base text-text-primary tabular-nums focus:z-1 focus:outline-none min-w-8 w-full tracking-wide flex-1 shrink-0 px-2 py-1.5 max-h-32"
        rows={3}
        value={field.state.value || ''}
        onChange={(e) => {
          const newValue = e.target.value || undefined
          field.handleChange(newValue)
          onChange?.(newValue)
        }}
      />

      {description && (
        <Field.Description className="text-xs text-text-muted ml-1.5 mt-1">{description}</Field.Description>
      )}

      {isInvalid && Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0 && (
        <div className="text-xs text-red-800 mt-1 ml-1.5">
          {field.state.meta.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </Field.Root>
  )
}

export { TextAreaField }
