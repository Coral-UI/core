import { ButtonGroup } from '@/components/ui/button-group'
import { Field, FieldLabel } from '@/components/ui/field'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { FieldValues, UseFormReturn } from 'react-hook-form'

type InputWithOptionsProps<T extends FieldValues = FieldValues> = {
  inputName: string
  inputLabel: string
  inputType: 'text' | 'number' | 'email' | 'password' | 'url' | 'search'
  inputPlaceholder: string
  inputClassName?: string
  selectClassName?: string
  disabled?: boolean
  selectName: string
  selectLabel?: string | undefined
  selectPlaceholder: string
  options: { label: string; value: string }[]
  form: UseFormReturn<T>
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string | undefined
  hideLabel?: boolean
}

export const InputWithOptions = <T extends FieldValues = FieldValues>({
  inputName,
  inputLabel,
  inputPlaceholder,
  selectPlaceholder,
  inputType,
  inputClassName,
  selectClassName,
  disabled,
  selectName,
  selectLabel,
  options,
  form,
  icon: Icon,
  iconClassName,
  hideLabel = false,
}: InputWithOptionsProps<T>) => {
  return (
    <Field className="flex items-center">
      {!hideLabel ? (
        <FieldLabel htmlFor={inputName}>{inputLabel}</FieldLabel>
      ) : (
        <label htmlFor={inputName} className="sr-only">
          {inputLabel}
        </label>
      )}
      <ButtonGroup>
        <InputGroup>
          <FormField
            control={form.control}
            name={inputName as any}
            render={({ field }) => (
              <FormItem className={cn(inputClassName, 'col-span-1 flex-1')}>
                <InputGroupInput {...field} disabled={disabled} placeholder={inputPlaceholder} type={inputType} />
              </FormItem>
            )}
          />
          {Icon && (
            <InputGroupAddon align="inline-start">
              <Icon className={cn('size-4 text-muted-foreground shrink-0', iconClassName)} />
            </InputGroupAddon>
          )}
        </InputGroup>

        <FormField
          control={form.control}
          name={selectName as any}
          render={({ field }) => (
            <FormItem className={cn(selectClassName)}>
              {selectLabel && (
                <label htmlFor={selectName} className="sr-only">
                  {selectLabel}
                </label>
              )}
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled || false}>
                  <SelectTrigger className="rounded-l-none border-l-0">
                    <SelectValue placeholder={selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ButtonGroup>
    </Field>
  )
}
