import { Field, FieldLabel } from '@/components/ui/field'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

type ToggleProps<T extends FieldValues = FieldValues> = {
  name: FieldPath<T>
  label: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  form: UseFormReturn<T>
  hideLabel?: boolean
}

export const Toggle = <T extends FieldValues = FieldValues>({
  name,
  label,
  options,
  form,
  hideLabel = false,
}: ToggleProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Field>
          {!hideLabel ? (
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
          ) : (
            <label htmlFor={name} className="sr-only">
              {label}
            </label>
          )}
          <FormItem>
            <FormControl>
              <ToggleGroup type="single" variant="outline" value={field.value} onValueChange={field.onChange}>
                {options.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
                    {option.icon && <option.icon className="size-4" />}
                    <span className="sr-only">{option.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
          </FormItem>
        </Field>
      )}
    />
  )
}
