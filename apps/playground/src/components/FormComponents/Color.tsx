import { Button } from '@/components/ui/button'
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from '@/components/ui/color-picker'
import { Field, FieldLabel } from '@/components/ui/field'
import { FormField } from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { colord } from 'colord'
import { X } from 'lucide-react'
import { matchIsValidColor } from 'mui-color-input'
import { useState } from 'react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

type ColorInputProps<T extends FieldValues = FieldValues> = {
  name: FieldPath<T>
  label: string
  placeholder: string
  description?: string
  form: UseFormReturn<T>
  className?: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string | undefined
  hideLabel?: boolean
  isSet?: boolean
  inheritedFrom?: string | undefined
  onClear?: (() => void) | undefined
}

export const Color = <T extends FieldValues = FieldValues>({
  name,
  label,
  form,
  disabled,
  hideLabel = false,
  isSet = false,
  inheritedFrom,
  onClear,
}: ColorInputProps<T>) => {
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl' | 'hsb'>('hex')

  return (
    <FormField
      rules={{ validate: matchIsValidColor }}
      control={form.control}
      name={name}
      disabled={disabled || false}
      render={({ field, fieldState }) => (
        <Field className="flex items-center" data-invalid={fieldState.invalid}>
          <div className="flex items-center gap-1">
            {!hideLabel ? (
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            ) : (
              <label htmlFor={field.name} className="sr-only">
                {label}
              </label>
            )}
            {isSet && onClear && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={onClear}
                      className="shrink-0 text-destructive hover:text-destructive"
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
          <div className="flex items-center gap-1 w-full border border-input rounded-md">
            <div className={cn(isSet && 'flex items-center', 'w-full')}>
              <ColorPicker
                value={field.value}
                className="flex-1"
                onValueChange={field.onChange}
                defaultFormat={format}
                onFormatChange={setFormat}
              >
                <div className="flex items-center gap-3">
                  <ColorPickerTrigger asChild>
                    <Button variant="input" className="flex items-center gap-2 px-3 w-full justify-start">
                      <ColorPickerSwatch className="size-4" />
                      {format === 'hex'
                        ? colord(field.value).toHex()
                        : format === 'rgb'
                          ? colord(field.value).toRgbString()
                          : colord(field.value).toHslString()}
                    </Button>
                  </ColorPickerTrigger>
                </div>
                <ColorPickerContent side="left" align="start">
                  <ColorPickerArea />
                  <div className="flex flex-col items-center gap-2">
                    <ColorPickerHueSlider />
                    <ColorPickerAlphaSlider />
                  </div>
                  <div className="flex items-center gap-2">
                    <ColorPickerFormatSelect />
                    <ColorPickerInput />
                  </div>
                </ColorPickerContent>
              </ColorPicker>
            </div>
          </div>
        </Field>
      )}
    />
  )
}
