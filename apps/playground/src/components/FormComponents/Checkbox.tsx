import { Checkbox as CheckboxPrimitive } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'

type CheckboxProps = {
  name: string
  label: string
  items: { label: string; id: string }[]
  form: UseFormReturn<any>
}

export const Checkbox = ({ name, label, form, items }: CheckboxProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {items.map(({ label, id }) => (
            <FormField
              key={id}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem key={id}>
                  <FormControl>
                    <CheckboxPrimitive
                      checked={field.value.includes(id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, id])
                          : field.onChange(field.value?.filter((value: string) => value !== id))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">{label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </FormItem>
      )}
    />
  )
}
