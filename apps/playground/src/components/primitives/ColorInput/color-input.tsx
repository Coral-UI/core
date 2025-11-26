import { Button } from '@/components/primitives/Button/button'
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
} from '@/components/primitives/ColorPicker/color-picker'
import { cn } from '@/lib/utils'
import * as React from 'react'

import './color-input.css'

import clsx from 'clsx'

export type ColorInputProps = Omit<React.ComponentProps<'div'>, 'size'> & {
  /**
   * The current color value (hex, rgb, hsl, or hsb format)
   */
  value?: string
  /**
   * Callback when color value changes
   */
  onValueChange?: (value: string) => void
  /**
   * The current color format
   */
  format?: 'hex' | 'rgb' | 'hsl' | 'hsb'
  /**
   * Default color format
   */
  defaultFormat?: 'hex' | 'rgb' | 'hsl' | 'hsb'
  /**
   * Callback when format changes
   */
  onFormatChange?: (format: 'hex' | 'rgb' | 'hsl' | 'hsb') => void
  /**
   * Leading icon to display
   */
  leadingIcon?: React.ReactNode
  /**
   * Label text
   */
  label: string
  /**
   * Hide the label visually (but keep it accessible)
   */
  hideLabel?: boolean
  /**
   * Input ID for accessibility
   */
  id?: string
  /**
   * Input name for form submission
   */
  name?: string
  /**
   * Whether the input is invalid
   */
  invalid?: boolean
  /**
   * Additional className
   */
  className?: string
}

export function ColorInput({
  label,
  value = '',
  onValueChange,
  format,
  defaultFormat = 'hex',
  onFormatChange,
  leadingIcon,
  hideLabel = false,
  id,
  name,
  invalid = false,
}: ColorInputProps) {
  const inputId = id || `color-input-${React.useId()}`

  return (
    <div data-invalid={invalid} className="color-input">
      {!hideLabel && (
        <label htmlFor={inputId} className="color-input-label">
          {label}
        </label>
      )}
      <input
        type="hidden"
        id={inputId}
        name={name}
        value={value}
        readOnly
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
        aria-invalid={invalid}
      />
      <div className={clsx('color-input-input', leadingIcon && 'color-input-input-with-icon')} role="group">
        {leadingIcon && <div className={cn('color-input-input-icon')}>{leadingIcon}</div>}
        {/* Hidden input for accessibility and form association */}

        <ColorPicker
          value={value}
          {...(onValueChange && { onValueChange })}
          {...(onFormatChange && { onFormatChange })}
          defaultFormat={defaultFormat}
          {...(format !== undefined && { format })}
          className="w-full"
        >
          <div className="color-picker-wrapper">
            <ColorPickerTrigger asChild>
              <Button
                variant="colorPicker"
                // className="flex items-center justify-start gap-2 px-3 w-full"
                aria-labelledby={!hideLabel ? inputId : undefined}
                aria-label={hideLabel ? label : undefined}
                aria-invalid={invalid}
              >
                <ColorPickerSwatch className="color-picker-swatch" />
                {value || ''}
              </Button>
            </ColorPickerTrigger>
          </div>
          <ColorPickerContent
            className="color-picker-content"
            side="top"
            sideOffset={-20}
            align="start"
            alignOffset={16}
          >
            <ColorPickerArea />
            <div className="color-picker-actions-wrapper">
              <ColorPickerEyeDropper />
              <div className="color-picker-slider-wrapper">
                <ColorPickerHueSlider />
                <ColorPickerAlphaSlider />
              </div>
            </div>
            <div className="color-picker-format-actions-wrapper">
              <ColorPickerFormatSelect defaultValue={defaultFormat} />
              <ColorPickerInputComponent />
            </div>
          </ColorPickerContent>
        </ColorPicker>
      </div>
    </div>
  )
}
