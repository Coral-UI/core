import type { VariantProps } from 'class-variance-authority'
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput as ColorPickerInputComponent,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from '@/components/style-manager/components/ColorPicker'
import { useFieldContext, useFormContext } from '@/components/style-manager/formContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const inputVariants = cva(
  'w-full [&>input]:w-full min-w-0 rounded-input text-text-primary font-sans border placeholder:text-text-muted [&>input]:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 interactive-invalid-input group interactive-focus-input has-[>input[aria-invalid=true]]:ring-destructive-fg  has-[>input[aria-invalid=true]]:border-destructive-fg has-[>input[aria-invalid=true]]:bg-destructive-bg  overflow-hidden inline-flex items-center  font-normal',
  {
    variants: {
      variant: {
        default: 'bg-input-bg border-input-border',
        transparent: 'bg-transparent border-input-border',
      },
      size: {
        default: 'h-9 text-sm',
        sm: 'h-6 text-xs tracking-wide',
        lg: 'h-12',
      },
      hasLeadingIcon: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        hasLeadingIcon: false,
        size: 'default',
        className: 'px-3',
      },
      {
        hasLeadingIcon: false,
        size: 'sm',
        className: 'px-2',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasLeadingIcon: false,
    },
  },
)

export type ColorInputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants> & {
    leadingIcon?: React.ReactNode
    defaultFormat: 'hex' | 'rgb' | 'hsl' | 'hsb'
    formatName: string
    label: string
    hideLabel?: boolean
  }

function ColorInput({
  label,
  formatName,
  defaultFormat,
  className,
  leadingIcon,
  variant,
  size,
  hideLabel = false,
}: ColorInputProps) {
  const field = useFieldContext<string>()
  const form = useFormContext()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  // const hasChanged = field.state.meta.isDirty;

  // Use field.name as the id for proper label association
  const inputId = field.name

  return (
    <div data-invalid={isInvalid} className="flex w-full max-w-72 flex-col items-start">
      {!hideLabel && (
        <label htmlFor={inputId} className="label-sm h-6 flex items-center ml-1.5">
          {label}
        </label>
      )}
      <div className={cn(className, inputVariants({ variant, size, hasLeadingIcon: !!leadingIcon }))} role="group">
        {leadingIcon && (
          <div
            className={cn(
              'shrink-0  text-text-secondary flex items-center justify-center',
              size === 'sm'
                ? "[&>svg:not([class*='size-'])]:size-3.5 w-6"
                : "[&>svg:not([class*='size-'])]:size-4 w-8 ",
            )}
          >
            {leadingIcon}
          </div>
        )}
        {/* Hidden input for accessibility and form association */}
        <input
          type="text"
          id={inputId}
          name={field.name}
          value={field.state.value}
          readOnly
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only !w-px"
          aria-invalid={isInvalid}
        />
        <ColorPicker
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
          onFormatChange={(format) => {
            // @ts-expect-error - formatName is a dynamic string key, but TypeScript can't infer the field type
            form.setFieldValue(formatName, format)
          }}
          defaultFormat={defaultFormat}
          {...(form.state.values[formatName] !== undefined && {
            format: form.state.values[formatName] as 'hex' | 'rgb' | 'hsl' | 'hsb',
          })}
          className="w-full"
        >
          <div className="flex items-center">
            <ColorPickerTrigger asChild>
              <Button
                data-slot="input-group-control"
                variant="colorPicker"
                className="flex items-center justify-start gap-2 px-3 w-full"
                aria-labelledby={!hideLabel ? inputId : undefined}
                aria-label={hideLabel ? label : undefined}
                aria-invalid={isInvalid}
              >
                <ColorPickerSwatch className="size-4" />
                {field.state.value}
              </Button>
            </ColorPickerTrigger>
          </div>
          <ColorPickerContent
            className="bg-bg-surface border-border-surface shadow-xl"
            side="top"
            sideOffset={-20}
            align="start"
            alignOffset={16}
          >
            <ColorPickerArea />
            <div className="flex items-center gap-2">
              <ColorPickerEyeDropper />
              <div className="flex flex-1 flex-col gap-2">
                <ColorPickerHueSlider />
                <ColorPickerAlphaSlider />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerFormatSelect defaultValue="hex" />
              <ColorPickerInputComponent />
            </div>
          </ColorPickerContent>
        </ColorPicker>
      </div>
    </div>
  )
}

export { ColorInput }
