import { useFieldContext } from '@/components/Editor/component-manager/formContext'
import { Field } from '@base-ui-components/react/field'
import * as React from 'react'

type TextFieldProps = React.ComponentProps<typeof Field.Root> & {
  label: string
  description?: string
  error?: string
  value?: string | undefined
  onChange?: (value: string | undefined) => void
  defaultValue?: string | undefined
  id?: string
  placeholder?: string
}

function TextField({
  label,
  description,
  error,
  value,
  onChange,
  defaultValue,
  id,
  placeholder,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field.Root {...props}>
      <Field.Label className="h-6 flex items-center ml-1.5 label-sm">{label}</Field.Label>
      <Field.Control
        required
        placeholder={placeholder}
        className="flex rounded-md items-center bg-input border border-input-border has-[>input[aria-invalid=true]]:ring-destructive-fg  has-[>input[aria-invalid=true]]:border-destructive-fg has-[>input[aria-invalid=true]]:bg-destructive-bg interactive-focus-input w-full h-8 text-sm text-foreground tabular-nums focus:z-1 focus:outline-none min-w-8 flex-1 shrink-0 px-2 font-normal placeholder:text-muted-foreground"
        onValueChange={(value: string) => {
          field.handleChange(value)
          onChange?.(value)
        }}
        defaultValue={field.state.value || defaultValue}
      />

      {description && (
        <Field.Description className="text-xs text-muted-foreground ml-1.5 mt-1">{description}</Field.Description>
      )}

      {isInvalid && Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0 && (
        <div className="text-xs text-destructive-foreground mt-1 ml-1.5">
          {field.state.meta.errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </Field.Root>
  )
}

export { TextField }
