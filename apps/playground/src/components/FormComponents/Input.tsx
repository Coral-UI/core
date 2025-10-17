import { FormField, FormItem  } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { Label } from '@radix-ui/react-label'
import { FieldValues, UseFormReturn } from 'react-hook-form'

type InputProps<T extends FieldValues = FieldValues> = {
  name: string
  label: string
  placeholder: string
  description?: string
  form: UseFormReturn<T>
  className?: string
  disabled?: boolean
  type?: 'text' | 'number' | 'email' | 'password' | 'url' | 'search' | 'color'
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string
  hideLabel?: boolean
}

export const Input = <T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  description,
  form,
  className,
  disabled,
  type = 'text',
  icon: Icon,
  iconClassName,
  hideLabel = false,
}: InputProps<T>) => {
  return (
    <InputGroup>
      <FormField
        control={form.control}
        name={name as any}
        disabled={disabled || false}
        render={({ field }) => (
          <FormItem className={cn('col-span-1 flex-1')}>
            <InputGroupInput disabled={disabled} placeholder={placeholder} type={type} {...field} className="min-w-6" />
          </FormItem>
        )}
      />
      {Icon && (
        <InputGroupAddon align="inline-start">
          <Icon className={cn('size-4 text-muted-foreground shrink-0', iconClassName)} />
        </InputGroupAddon>
      )}
      <InputGroupAddon align="inline-start">
        <Label className="text-xs font-medium whitespace-nowrap text-muted-foreground" htmlFor={name}>
          {label}
        </Label>
      </InputGroupAddon>

    </InputGroup>
  )
}
