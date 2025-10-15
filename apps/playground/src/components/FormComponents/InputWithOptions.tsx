import { ButtonGroup } from '@/components/ui/button-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input as InputPrimitive } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Label } from '@radix-ui/react-label'
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
  selectLabel?: string
  selectPlaceholder: string
  options: { label: string; value: string }[]
  form: UseFormReturn<T>
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string
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
    <ButtonGroup>
      <InputGroup>
        <FormField
          control={form.control}
          name={inputName as any}
          render={({ field }) => (
            <FormItem className={cn(inputClassName, 'col-span-1 flex-1')}>
              <InputGroupInput disabled={disabled} placeholder={inputPlaceholder} type={inputType} {...field} />
            </FormItem>
          )}
        />
        {Icon && (
          <InputGroupAddon align="inline-start">
            <Icon className={cn('size-4 text-muted-foreground shrink-0', iconClassName)} />
          </InputGroupAddon>
        )}
        <InputGroupAddon align="inline-start">
          <Label className="text-xs font-medium whitespace-nowrap text-muted-foreground" htmlFor={inputName}>{inputLabel}</Label>
        </InputGroupAddon>

      </InputGroup>
      <FormField
        control={form.control}
        name={selectName as any}
        render={({ field }) => (
          <FormItem className={cn(selectClassName)}>
            {!hideLabel && selectLabel && (
              <FormLabel className="col-span-1 text-xs font-medium whitespace-nowrap text-muted-foreground">
                {selectLabel}
              </FormLabel>
            )}
            <FormControl>
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ButtonGroup>
  )
}
