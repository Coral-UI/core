import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input as InputPrimitive } from '@/components/ui/input'
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
  selectLabel: string
  selectPlaceholder: string
  options: { label: string; value: string }[]
  form: UseFormReturn<T>
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
}: InputWithOptionsProps<T>) => {
  return (
    <div className="flex items-center gap-2">
      <FormField
        control={form.control}
        name={inputName as any}
        render={({ field }) => (
          <FormItem className={cn(inputClassName, 'col-span-1')}>
            <FormLabel className="col-span-1 text-xs font-medium">{inputLabel}</FormLabel>
            <FormControl>
              <div className="col-span-3 flex flex-col gap-2">
                <InputPrimitive disabled={disabled} placeholder={inputPlaceholder} type={inputType} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={selectName as any}
        render={({ field }) => (
          <FormItem className={cn(selectClassName, 'col-span-1')}>
            <FormLabel className="col-span-1 text-xs font-medium">{selectLabel}</FormLabel>
            <FormControl>
              <div className="col-span-3 flex flex-col gap-2">
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled || false}>
                  <SelectTrigger>
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
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
