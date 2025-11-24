import { Field as BaseField } from '@base-ui-components/react/field'
import * as React from 'react'

type FieldRootProps = React.ComponentProps<typeof BaseField.Root>

type FieldProps = FieldRootProps & {
  label?: string
  description?: string
  error?: string | string[]
  required?: boolean
  children: React.ReactNode
}

function Field({ label, description, error, required, children, invalid, ...props }: FieldProps) {
  const errors = React.useMemo(() => {
    if (!error) return []
    return Array.isArray(error) ? error : [error]
  }, [error])

  const hasError = invalid || errors.length > 0

  return (
    <BaseField.Root {...props} invalid={hasError}>
      {label && <BaseField.Label className="h-6 flex items-center ml-1.5 label-sm">{label}</BaseField.Label>}
      {children}
      {description && (
        <BaseField.Description className="text-xs text-text-muted ml-1.5 mt-1">{description}</BaseField.Description>
      )}
      {hasError && errors.length > 0 && (
        <div className="text-xs text-red-800 mt-1 ml-1.5" role="alert">
          {errors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </div>
      )}
    </BaseField.Root>
  )
}

export { Field }
export type { FieldProps }
