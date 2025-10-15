import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  SelectContent,
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldValues, UseFormReturn } from 'react-hook-form'

type SelectProps<T extends FieldValues = FieldValues> = {
  name: string
  label: string
  disabled?: boolean
  description?: React.ReactNode
  placeholder?: string
  options: { label: string; value: string }[]
  form: UseFormReturn<T>
  className?: string
}

export const Select = <T extends FieldValues = FieldValues>({
  name,
  label,
  disabled,
  description,
  placeholder,
  options,
  form,
  className,
}: SelectProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name as any}
      disabled={disabled || false}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="col-span-1 text-xs font-medium">{label}</FormLabel>
          <div className="col-span-3 flex flex-col gap-2">
            <SelectPrimitive
              onValueChange={field.onChange}
              onOpenChange={(open) => {
                if (!open) {
                  field.onBlur()
                }
              }}
              defaultValue={field.value}
              disabled={disabled || false}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full">
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPrimitive>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
