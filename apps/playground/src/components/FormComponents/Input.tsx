import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input as InputPrimitive } from '@/components/ui/input'
import { UseFormReturn, FieldValues } from 'react-hook-form'

type InputProps<T extends FieldValues = FieldValues> = {
  name: string
  label: string
  placeholder: string
  description?: string
  form: UseFormReturn<T>
  className?: string
  disabled?: boolean
  type?: 'text' | 'number' | 'email' | 'password' | 'url' | 'search' | 'color'
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
}: InputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name as any}
      disabled={disabled || false}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="col-span-1 text-xs font-medium">{label}</FormLabel>
          <FormControl>
            <div className="col-span-3 flex flex-col gap-2">
              <InputPrimitive disabled={disabled} placeholder={placeholder} type={type} {...field} />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
