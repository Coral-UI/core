import { Field, FieldLabel } from '@/components/ui/field'
import { FormField, FormItem } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { matchIsValidColor, MuiColorInput } from 'mui-color-input'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import './ColorInput.css'

type ColorInputProps<T extends FieldValues = FieldValues> = {
  name: string
  label: string
  placeholder: string
  description?: string
  form: UseFormReturn<T>
  className?: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string | undefined
  hideLabel?: boolean
}

export const Color = <T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  description,
  form,
  className,
  disabled,
  icon: Icon,
  iconClassName,
  hideLabel = false,
}: ColorInputProps<T>) => {
  return (
    <FormField
      rules={{ validate: matchIsValidColor }}
      control={form.control}
      name={name as any}
      disabled={disabled || false}
      render={({ field, fieldState }) => (
        <Field className="flex items-center" data-invalid={fieldState.invalid}>
          {!hideLabel ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : <label htmlFor={field.name} className="sr-only">{label}</label>}
          <MuiColorInput
            {...field}
            className="min-w-6"
            format="hex8"
            helperText={fieldState.invalid ? 'Invalid color' : ''}
            error={fieldState.invalid}
          />
        </Field>
      )}
    />

    // <InputGroup>
    //   <FormField
    //     control={form.control}
    //     name={name as any}
    //     disabled={disabled || false}
    //     render={({ field }) => (
    //       <FormItem className={cn('col-span-1 flex-1')}>
    //         <InputGroupInput disabled={disabled} placeholder={placeholder} type={'color'} {...field} className="min-w-6" />
    //       </FormItem>
    //     )}
    //   />

    //   {Icon && (
    //     <InputGroupAddon align="inline-start">
    //       <Icon className={cn('size-4 text-muted-foreground shrink-0', iconClassName)} />
    //     </InputGroupAddon>
    //   )}

    // </InputGroup>
  )
}
