import { cn } from '@/lib/utils'
import * as React from 'react'

import './textarea.css'

type TextAreaFieldProps = Omit<React.ComponentProps<'textarea'>, 'onChange' | 'value'> & {
  value?: string | undefined
  onChange?: (value: string | undefined) => void
  defaultValue?: string | undefined
}

function TextAreaField({ value, onChange, defaultValue, className, ...props }: TextAreaFieldProps) {
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue || '')

  const isControlled = value !== undefined
  const displayValue = isControlled ? value || '' : internalValue

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value || undefined
      if (!isControlled) {
        setInternalValue(newValue || '')
      }
      onChange?.(newValue)
    },
    [isControlled, onChange],
  )

  return <textarea value={displayValue} onChange={handleChange} className={cn('textarea', className)} {...props} />
}

export { TextAreaField }
export type { TextAreaFieldProps }
