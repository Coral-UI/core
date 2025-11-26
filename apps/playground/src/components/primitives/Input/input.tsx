import { cn } from '@/lib/utils'
import { Input as BaseInput, InputProps as BaseInputProps } from '@base-ui-components/react/input'
import * as React from 'react'

import './input.css'

const Input = React.forwardRef<HTMLInputElement, BaseInputProps>(({ className, type, ...props }, ref) => {
  return (
    <BaseInput
      type={type}
      ref={ref}
      className={cn(
        'input',
        // 'focus-visible:border-popover-foreground focus-visible:ring-popover-foreground focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
