import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { FormField, FormItem } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

type InputProps<T extends FieldValues = FieldValues> = {
  name: string
  label: string
  placeholder: string
  description?: string
  form: UseFormReturn<T>
  className?: string
  disabled?: boolean
  type?: 'text' | 'number' | 'email' | 'password' | 'url' | 'search' | 'color'
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string | undefined
  hideLabel?: boolean
  isSet?: boolean
  inheritedFrom?: string
  onClear?: () => void
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
  icon: Icon,
  iconClassName,
  hideLabel = false,
  isSet = false,
  inheritedFrom,
  onClear,
}: InputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name as any}
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
              <FormItem className={cn('col-span-1 flex-1')}>
                <InputGroupInput
                  disabled={disabled}
                  placeholder={placeholder}
                  type={type}
                  {...field}
                  className="min-w-6"
                />
              </FormItem>
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
