import { Field, FieldLabel } from '@/components/ui/field'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import {
  SelectContent,
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
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
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string | undefined
  hideLabel?: boolean
}

export const Select = <T extends FieldValues = FieldValues>({
  name,
  label,
  disabled,
  placeholder,
  options,
  form,
  hideLabel = false,
  className,
  icon: Icon,
  iconClassName,
}: SelectProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name as any}
      disabled={disabled || false}
      render={({ field, fieldState }) => (
        <Field className="flex items-center" data-invalid={fieldState.invalid}>
          {!hideLabel ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : <label htmlFor={field.name} className="sr-only">{label}</label>}
          <InputGroup>
            <SelectPrimitive
              name={field.name}
              value={field.value}
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
                <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="border-transparent w-full bg-transparent">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-full" position="item-aligned">
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPrimitive>

            {Icon && (
              <InputGroupAddon align="inline-start">
                <Icon className={cn('size-4 text-muted-foreground shrink-0', iconClassName)} />
              </InputGroupAddon>
            )}
          </InputGroup>
        </Field>
      )}
    />
  )
}
