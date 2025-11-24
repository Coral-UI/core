import { cn } from '@/lib/utils'
import * as React from 'react'

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

  return (
    <textarea
      value={displayValue}
      onChange={handleChange}
      className={cn(
        'flex rounded-md items-center bg-input border border-input-border interactive-focus-input min-h-7.5 text-sm text-foreground tabular-nums focus:z-1 focus:outline-none min-w-8 w-full flex-1 shrink-0 px-2 py-1.5 max-h-32 inset-shadow-xs inset-shadow-shadow-input font-normal placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:ring-destructive-fg aria-invalid:border-destructive-fg aria-invalid:bg-destructive-bg',
        className,
      )}
      {...props}
    />
  )
}

export { TextAreaField }
export type { TextAreaFieldProps }
