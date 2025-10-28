import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field, FieldLabel } from '@/components/ui/field'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

type InputWithOptionsProps<T extends FieldValues = FieldValues> = {
  inputName: FieldPath<T>
  inputLabel: string
  inputType: 'text' | 'number' | 'email' | 'password' | 'url' | 'search'
  inputPlaceholder: string
  inputClassName?: string | undefined
  selectClassName?: string | undefined
  disabled?: boolean | undefined
  selectName: FieldPath<T>
  selectLabel?: string | undefined
  selectPlaceholder: string
  options: { label: string; value: string }[]
  form: UseFormReturn<T>
  icon?: React.ComponentType<{ className?: string }> | undefined
  iconClassName?: string | undefined
  hideLabel?: boolean | undefined
  isSet?: boolean | undefined
  inheritedFrom?: string | undefined
  onClear?: (() => void) | undefined
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
  isSet = false,
  inheritedFrom,
  onClear,
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
      <div className="flex items-center gap-1 w-full">
        <ButtonGroup className={cn(isSet && 'ring-2 ring-destructive/50')}>
          <InputGroup>
            <FormField
              control={form.control}
              name={inputName}
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
            name={selectName}
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
  )
}
