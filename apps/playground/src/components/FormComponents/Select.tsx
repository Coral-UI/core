import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { FormControl, FormField } from '@/components/ui/form'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import {
  SelectContent,
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

type SelectProps<T extends FieldValues = FieldValues> = {
  name: FieldPath<T>
  label: string
  disabled?: boolean | undefined
  description?: React.ReactNode | undefined
  placeholder?: string | undefined
  options: { label: string; value: string }[]
  form: UseFormReturn<T>
  className?: string | undefined
  icon?: React.ComponentType<{ className?: string }> | undefined
  iconClassName?: string | undefined
  hideLabel?: boolean | undefined
  isSet?: boolean | undefined
  inheritedFrom?: string | undefined
  onClear?: (() => void) | undefined
}

export const Select = <T extends FieldValues = FieldValues>({
  name,
  label,
  disabled,
  placeholder,
  options,
  form,
  hideLabel = false,
  icon: Icon,
  iconClassName,
  isSet = false,
  inheritedFrom,
  onClear,
}: SelectProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled || false}
      render={({ field, fieldState }) => (
        <Field className="flex items-center" data-invalid={fieldState.invalid}>
          {!hideLabel ? (
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          ) : (
            <label htmlFor={field.name} className="sr-only">
              {label}
            </label>
          )}
          <div className="flex items-center gap-1 w-full">
            <InputGroup className={cn(isSet && 'ring-2 ring-destructive/50')}>
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
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="border-transparent w-full bg-transparent"
                  >
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
            {isSet && onClear && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={onClear}
                      className="shrink-0 h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {inheritedFrom ? `Clear (will inherit from ${inheritedFrom})` : 'Clear value'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </Field>
      )}
    />
  )
}
