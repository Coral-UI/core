import { cn } from '@/lib/utils'
import { Field as BaseField } from '@base-ui-components/react/field'
import * as React from 'react'

import './field.css'

type FieldRootProps = React.ComponentProps<typeof BaseField.Root>

type FieldProps = FieldRootProps & {
  label?: string
  description?: string
  error?: string | string[] | { message?: string } | undefined
  required?: boolean
  children: React.ReactNode
  labelClassName?: string
}

function Field({ label, description, error, required, children, invalid, labelClassName, ...props }: FieldProps) {
  const errors = React.useMemo(() => {
    if (!error) return []
    return Array.isArray(error) ? error : [error]
  }, [error])

  const hasError = invalid || errors.length > 0

  return (
    <BaseField.Root {...props} invalid={hasError}>
      {label && <BaseField.Label className={cn('field-label', labelClassName)}>{label}</BaseField.Label>}
      {children}
      {description && <BaseField.Description className="field-description">{description}</BaseField.Description>}
      {hasError && errors.length > 0 && (
        <div className="field-error" role="alert">
          {errors.map((err, index) => (
            <div key={index}>{typeof err === 'string' ? err : err?.message}</div>
          ))}
        </div>
      )}
    </BaseField.Root>
  )
}

// Export Field.Control for automatic id propagation
const FieldControl = BaseField.Control

export { Field, FieldControl }
export type { FieldProps }
