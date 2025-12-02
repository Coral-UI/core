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
  useColorPicker,
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

// Helper component to handle format changes and update the value
function ColorFormatHandler({
  onValueChange,
  currentValue,
}: {
  onValueChange?: (value: string) => void
  currentValue?: string
}) {
  const color = useColorPicker((state) => state.color)
  const format = useColorPicker((state) => state.format)
  const prevFormatRef = React.useRef(format)
  const isUpdatingRef = React.useRef(false)

  React.useEffect(() => {
    // Skip if we're in the middle of updating (to avoid infinite loops)
    if (isUpdatingRef.current) {
      return
    }

    if (prevFormatRef.current !== format) {
      // Format changed, convert current color to new format
      const newValue = formatColorValue(color, format)

      // Only update if the new value is different from current value
      // This prevents unnecessary updates and potential parsing issues
      if (newValue && onValueChange && newValue !== currentValue) {
        isUpdatingRef.current = true
        // Use setTimeout to ensure this happens after ColorPicker has finished processing the format change
        setTimeout(() => {
          onValueChange(newValue)
          isUpdatingRef.current = false
        }, 0)
      }
      prevFormatRef.current = format
    }
  }, [format, color, onValueChange, currentValue])

  return null
}

// Helper function to format color value based on format
function formatColorValue(
  color: { r: number; g: number; b: number; a: number },
  format: 'hex' | 'rgb' | 'hsl' | 'hsb',
): string {
  const rgbToHex = (c: { r: number; g: number; b: number }) => {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16)
      return hex.length === 1 ? `0${hex}` : hex
    }
    return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`
  }

  const rgbToHsl = (c: { r: number; g: number; b: number }) => {
    const r = c.r / 255
    const g = c.g / 255
    const b = c.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    const sum = max + min
    const l = sum / 2
    let h = 0
    let s = 0
    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum
      if (max === r) {
        h = (g - b) / diff + (g < b ? 6 : 0)
      } else if (max === g) {
        h = (b - r) / diff + 2
      } else if (max === b) {
        h = (r - g) / diff + 4
      }
      h /= 6
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const rgbToHsv = (c: { r: number; g: number; b: number }) => {
    const r = c.r / 255
    const g = c.g / 255
    const b = c.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    let h = 0
    if (diff !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / diff) % 6
          break
        case g:
          h = (b - r) / diff + 2
          break
        case b:
          h = (r - g) / diff + 4
          break
      }
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360
    const s = max === 0 ? 0 : diff / max
    const v = max
    return {
      h,
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    }
  }

  switch (format) {
    case 'hex':
      return rgbToHex(color)
    case 'rgb':
      return color.a < 1
        ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        : `rgb(${color.r}, ${color.g}, ${color.b})`
    case 'hsl': {
      const hsl = rgbToHsl(color)
      return color.a < 1 ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${color.a})` : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
    case 'hsb': {
      const hsv = rgbToHsv(color)
      return color.a < 1 ? `hsba(${hsv.h}, ${hsv.s}%, ${hsv.v}%, ${color.a})` : `hsb(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
    }
    default:
      return rgbToHex(color)
  }
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

  // Handle format change and convert value
  const handleFormatChange = React.useCallback(
    (newFormat: 'hex' | 'rgb' | 'hsl' | 'hsb') => {
      // Call the original onFormatChange if provided
      onFormatChange?.(newFormat)
    },
    [onFormatChange],
  )

  return (
    <div data-invalid={invalid} className="color-input">
      {!hideLabel && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}

      <div className={clsx('color-input-input', leadingIcon && 'color-input-input-with-icon')} role="group">
        {leadingIcon && <div className={cn('color-input-input-icon')}>{leadingIcon}</div>}
        {/* Hidden input for accessibility and form association */}

        <ColorPicker
          value={value}
          {...(onValueChange && { onValueChange })}
          onFormatChange={handleFormatChange}
          defaultFormat={defaultFormat}
          {...(format !== undefined && { format })}
          className="w-full"
        >
          {onValueChange && <ColorFormatHandler onValueChange={onValueChange} currentValue={value} />}
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
            side="bottom"
            // sideOffset={-20}
            align="start"
            alignOffset={-16}
          >
            <ColorPickerArea />
            <div className="color-picker-actions-wrapper">
              <ColorPickerEyeDropper />
              <div className="color-picker-slider-wrapper">
                <ColorPickerHueSlider />
                <ColorPickerAlphaSlider />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ColorPickerFormatSelect defaultValue={defaultFormat} />
              <ColorPickerInputComponent />
            </div>
          </ColorPickerContent>
        </ColorPicker>
      </div>
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
    </div>
  )
}
