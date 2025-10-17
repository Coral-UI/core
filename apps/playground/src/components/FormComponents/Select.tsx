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
import { Label } from '@radix-ui/react-label'
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
  iconClassName?: string
  hideLabel?: boolean
}

export const Select = <T extends FieldValues = FieldValues>({
  name,
  label,
  disabled,
  placeholder,
  options,
  form,
  className,
  icon: Icon,
  iconClassName,
}: SelectProps<T>) => {
  return (
    <InputGroup>
      <FormField
        control={form.control}
        name={name as any}
        disabled={disabled || false}
        render={({ field }) => (
          <FormItem className={cn(className, 'col-span-1 flex-1')}>
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
