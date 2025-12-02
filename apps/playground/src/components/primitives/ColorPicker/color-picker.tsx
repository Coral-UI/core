'use client'

import type { VariantProps } from 'class-variance-authority'
import { Button } from '@/components/primitives/Button/button'
import { Input } from '@/components/primitives/Input/input'
import { SelectInput, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/Select/select'
import { VisuallyHiddenInput } from '@/components/primitives/VisuallyHiddenInput'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useComposedRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { PipetteIcon } from 'lucide-react'
import * as React from 'react'

import './color-picker.css'

/**
 * @see https://gist.github.com/bkrmendy/f4582173f50fab209ddfef1377ab31e3
 */
interface EyeDropper {
  open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>
}

declare global {
  interface Window {
    EyeDropper?: {
      new (): EyeDropper
    }
  }
}

const colorFormats = ['hex', 'rgb', 'hsl', 'hsb'] as const
type ColorFormat = (typeof colorFormats)[number]

interface ColorValue {
  r: number
  g: number
  b: number
  a: number
}

interface HSVColorValue {
  h: number
  s: number
  v: number
  a: number
}

function hexToRgb(hex: string, alpha?: number): ColorValue {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '')

  // Handle 3-digit hex colors by expanding to 6 digits
  if (cleanHex.length === 3) {
    const expanded = cleanHex
      .split('')
      .map((char) => char + char)
      .join('')
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded)
    return result
      ? {
          r: Number.parseInt(result[1] ?? '0', 16),
          g: Number.parseInt(result[2] ?? '0', 16),
          b: Number.parseInt(result[3] ?? '0', 16),
          a: alpha ?? 1,
        }
      : { r: 0, g: 0, b: 0, a: alpha ?? 1 }
  }

  // Handle 6-digit hex colors
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex)
  return result
    ? {
        r: Number.parseInt(result[1] ?? '0', 16),
        g: Number.parseInt(result[2] ?? '0', 16),
        b: Number.parseInt(result[3] ?? '0', 16),
        a: alpha ?? 1,
      }
    : { r: 0, g: 0, b: 0, a: alpha ?? 1 }
}

function rgbToHex(color: ColorValue): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

function rgbToHsv(color: ColorValue): HSVColorValue {
  const r = color.r / 255
  const g = color.g / 255
  const b = color.b / 255

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
    a: color.a,
  }
}

function hsvToRgb(hsv: HSVColorValue): ColorValue {
  const h = hsv.h / 360
  const s = hsv.s / 100
  const v = hsv.v / 100

  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  let r: number
  let g: number
  let b: number

  switch (i % 6) {
    case 0: {
      r = v
      g = t
      b = p
      break
    }
    case 1: {
      r = q
      g = v
      b = p
      break
    }
    case 2: {
      r = p
      g = v
      b = t
      break
    }
    case 3: {
      r = p
      g = q
      b = v
      break
    }
    case 4: {
      r = t
      g = p
      b = v
      break
    }
    case 5: {
      r = v
      g = p
      b = q
      break
    }
    default: {
      r = 0
      g = 0
      b = 0
    }
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: hsv.a,
  }
}

function colorToString(color: ColorValue, format: ColorFormat = 'hex'): string {
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

function rgbToHsl(color: ColorValue) {
  const r = color.r / 255
  const g = color.g / 255
  const b = color.b / 255

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

function hslToRgb(hsl: { h: number; s: number; l: number }, alpha = 1): ColorValue {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1))
  const m = l - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 1 / 6) {
    r = c
    g = x
    b = 0
  } else if (h >= 1 / 6 && h < 2 / 6) {
    r = x
    g = c
    b = 0
  } else if (h >= 2 / 6 && h < 3 / 6) {
    r = 0
    g = c
    b = x
  } else if (h >= 3 / 6 && h < 4 / 6) {
    r = 0
    g = x
    b = c
  } else if (h >= 4 / 6 && h < 5 / 6) {
    r = x
    g = 0
    b = c
  } else if (h >= 5 / 6 && h < 1) {
    r = c
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: alpha,
  }
}

function parseColorString(value: string): ColorValue | null {
  const trimmed = value.trim()

  // Parse hex colors
  if (trimmed.startsWith('#')) {
    const hexMatch = trimmed.match(/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/)
    if (hexMatch) {
      return hexToRgb(trimmed)
    }
  }

  // Parse rgb/rgba colors
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/)
  if (rgbMatch) {
    return {
      r: Number.parseInt(rgbMatch[1] ?? '0', 10),
      g: Number.parseInt(rgbMatch[2] ?? '0', 10),
      b: Number.parseInt(rgbMatch[3] ?? '0', 10),
      a: rgbMatch[4] ? Number.parseFloat(rgbMatch[4]) : 1,
    }
  }

  // Parse hsl/hsla colors
  const hslMatch = trimmed.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/)
  if (hslMatch) {
    const h = Number.parseInt(hslMatch[1] ?? '0', 10)
    const s = Number.parseInt(hslMatch[2] ?? '0', 10) / 100
    const l = Number.parseInt(hslMatch[3] ?? '0', 10) / 100
    const a = hslMatch[4] ? Number.parseFloat(hslMatch[4]) : 1

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0
    let g = 0
    let b = 0

    if (h >= 0 && h < 60) {
      r = c
      g = x
      b = 0
    } else if (h >= 60 && h < 120) {
      r = x
      g = c
      b = 0
    } else if (h >= 120 && h < 180) {
      r = 0
      g = c
      b = x
    } else if (h >= 180 && h < 240) {
      r = 0
      g = x
      b = c
    } else if (h >= 240 && h < 300) {
      r = x
      g = 0
      b = c
    } else if (h >= 300 && h < 360) {
      r = c
      g = 0
      b = x
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
      a,
    }
  }

  // Parse hsb/hsba colors
  const hsbMatch = trimmed.match(/^hsba?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/)
  if (hsbMatch) {
    const h = Number.parseInt(hsbMatch[1] ?? '0', 10)
    const s = Number.parseInt(hsbMatch[2] ?? '0', 10)
    const v = Number.parseInt(hsbMatch[3] ?? '0', 10)
    const a = hsbMatch[4] ? Number.parseFloat(hsbMatch[4]) : 1

    return hsvToRgb({ h, s, v, a })
  }

  return null
}

type Direction = 'ltr' | 'rtl'

const DirectionContext = React.createContext<Direction | undefined>(undefined)

function useDirection(dirProp?: Direction): Direction {
  const contextDir = React.useContext(DirectionContext)
  return dirProp ?? contextDir ?? 'ltr'
}

function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T | null>(null)

  if (ref.current === null) {
    ref.current = fn()
  }

  return ref as React.RefObject<T>
}

interface ColorPickerStoreState {
  color: ColorValue
  hsv: HSVColorValue
  open: boolean
  format: ColorFormat
}

interface ColorPickerStoreCallbacks {
  onColorChange?: (colorString: string) => void
  onOpenChange?: (open: boolean) => void
  onFormatChange?: (format: ColorFormat) => void
}

interface ColorPickerStore {
  subscribe: (cb: () => void) => () => void
  getState: () => ColorPickerStoreState
  setColor: (value: ColorValue) => void
  setHsv: (value: HSVColorValue) => void
  setOpen: (value: boolean) => void
  setFormat: (value: ColorFormat) => void
  syncFromProp: (color: ColorValue, hsv: HSVColorValue) => void
  syncFormatFromProp: (format: ColorFormat) => void
  notify: () => void
}

function createColorPickerStore(
  listenersRef: React.RefObject<Set<() => void>>,
  stateRef: React.RefObject<ColorPickerStoreState>,
  callbacks?: ColorPickerStoreCallbacks,
): ColorPickerStore {
  const store: ColorPickerStore = {
    subscribe: (cb) => {
      if (listenersRef.current) {
        listenersRef.current.add(cb)
        return () => listenersRef.current?.delete(cb)
      }
      return () => {}
    },
    getState: () =>
      stateRef.current || {
        color: { r: 0, g: 0, b: 0, a: 1 },
        hsv: { h: 0, s: 0, v: 0, a: 1 },
        open: false,
        format: 'hex' as ColorFormat,
      },
    setColor: (value: ColorValue) => {
      if (!stateRef.current) return

      // Check if color values actually changed (not just reference)
      const currentColor = stateRef.current.color
      const colorChanged =
        currentColor.r !== value.r ||
        currentColor.g !== value.g ||
        currentColor.b !== value.b ||
        currentColor.a !== value.a

      if (!colorChanged) return

      const prevState = { ...stateRef.current }
      stateRef.current.color = value

      if (callbacks?.onColorChange) {
        const colorString = colorToString(value, prevState.format)
        callbacks.onColorChange(colorString)
      }

      store.notify()
    },
    setHsv: (value: HSVColorValue) => {
      if (!stateRef.current) return

      // Check if HSV values actually changed (not just reference)
      const currentHsv = stateRef.current.hsv
      const hsvChanged =
        currentHsv.h !== value.h ||
        currentHsv.s !== value.s ||
        currentHsv.v !== value.v ||
        currentHsv.a !== value.a

      if (!hsvChanged) return

      const prevState = { ...stateRef.current }
      stateRef.current.hsv = value

      if (callbacks?.onColorChange) {
        const colorValue = hsvToRgb(value)
        const colorString = colorToString(colorValue, prevState.format)
        callbacks.onColorChange(colorString)
      }

      store.notify()
    },
    setOpen: (value: boolean) => {
      if (!stateRef.current) return
      if (Object.is(stateRef.current.open, value)) return

      stateRef.current.open = value

      if (callbacks?.onOpenChange) {
        callbacks.onOpenChange(value)
      }

      store.notify()
    },
    setFormat: (value: ColorFormat) => {
      if (!stateRef.current) return
      if (Object.is(stateRef.current.format, value)) return

      stateRef.current.format = value

      if (callbacks?.onFormatChange) {
        callbacks.onFormatChange(value)
      }

      store.notify()
    },
    syncFromProp: (color: ColorValue, hsv: HSVColorValue) => {
      if (!stateRef.current) return

      const currentColor = stateRef.current.color
      const currentHsv = stateRef.current.hsv

      // Compare color values (not references)
      const colorChanged =
        currentColor.r !== color.r ||
        currentColor.g !== color.g ||
        currentColor.b !== color.b ||
        currentColor.a !== color.a

      // Compare HSV values (not references)
      const hsvChanged =
        currentHsv.h !== hsv.h || currentHsv.s !== hsv.s || currentHsv.v !== hsv.v || currentHsv.a !== hsv.a

      if (!colorChanged && !hsvChanged) return

      if (colorChanged) {
        stateRef.current.color = color
      }
      if (hsvChanged) {
        stateRef.current.hsv = hsv
      }

      // Don't trigger callbacks when syncing from props
      // Only notify subscribers to update UI
      store.notify()
    },
    syncFormatFromProp: (format: ColorFormat) => {
      if (!stateRef.current) return
      if (stateRef.current.format === format) return

      stateRef.current.format = format

      // Don't trigger callbacks when syncing from props
      // Only notify subscribers to update UI
      store.notify()
    },
    notify: () => {
      if (listenersRef.current) {
        for (const cb of listenersRef.current) {
          cb()
        }
      }
    },
  }

  return store
}

function useColorPickerStoreContext(consumerName: string) {
  const context = React.useContext(ColorPickerStoreContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`ColorPickerRoot\``)
  }
  return context
}

function useColorPickerStore<U>(selector: (state: ColorPickerStoreState) => U): U {
  const store = useColorPickerStoreContext('useColorPickerStoreSelector')

  const getSnapshot = React.useCallback(() => selector(store.getState()), [store, selector])

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}

interface ColorPickerContextValue {
  dir: Direction
  disabled?: boolean
  inline?: boolean
  readOnly?: boolean
  required?: boolean
}

const ColorPickerStoreContext = React.createContext<ColorPickerStore | null>(null)
const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(null)

function useColorPickerContext(consumerName: string) {
  const context = React.useContext(ColorPickerContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`ColorPickerRoot\``)
  }
  return context
}

interface ColorPickerRootProps
  extends Omit<React.ComponentProps<'div'>, 'onValueChange'>,
    Pick<React.ComponentProps<typeof Popover>, 'defaultOpen' | 'open' | 'onOpenChange' | 'modal'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  dir?: Direction
  format?: ColorFormat
  defaultFormat?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  name?: string
  asChild?: boolean
  disabled?: boolean
  inline?: boolean
  readOnly?: boolean
  required?: boolean
}

function ColorPickerRoot(props: ColorPickerRootProps) {
  const {
    value: valueProp,
    defaultValue = '#000000',
    onValueChange,
    format: formatProp,
    defaultFormat = 'hex',
    onFormatChange,
    defaultOpen,
    open: openProp,
    onOpenChange,
    name,
    disabled,
    inline,
    readOnly,
    required,
    ...rootProps
  } = props

  const initialColor = React.useMemo(() => {
    const colorString = valueProp ?? defaultValue
    const color = hexToRgb(colorString)

    return {
      color,
      hsv: rgbToHsv(color),
      open: openProp ?? defaultOpen ?? false,
      format: formatProp ?? defaultFormat,
    }
  }, [valueProp, defaultValue, formatProp, defaultFormat, openProp, defaultOpen])

  const stateRef = useLazyRef(() => initialColor)
  const listenersRef = useLazyRef(() => new Set<() => void>())

  const storeCallbacks = React.useMemo<ColorPickerStoreCallbacks>(() => {
    const callbacks: ColorPickerStoreCallbacks = {}
    if (onValueChange) {
      callbacks.onColorChange = onValueChange
    }
    if (onOpenChange) {
      callbacks.onOpenChange = onOpenChange
    }
    if (onFormatChange) {
      callbacks.onFormatChange = onFormatChange
    }
    return callbacks
  }, [onValueChange, onOpenChange, onFormatChange])

  const store = React.useMemo(
    () => createColorPickerStore(listenersRef, stateRef, storeCallbacks),
    [listenersRef, stateRef, storeCallbacks],
  )

  const rootImplProps = React.useMemo(() => {
    const props: ColorPickerRootImplProps = {
      ...rootProps,
      defaultFormat,
    }
    if (valueProp !== undefined) {
      props.value = valueProp
    }
    if (defaultOpen !== undefined) {
      props.defaultOpen = defaultOpen
    }
    if (openProp !== undefined) {
      props.open = openProp
    }
    if (onOpenChange !== undefined) {
      props.onOpenChange = onOpenChange
    }
    if (formatProp !== undefined) {
      props.format = formatProp
    }
    if (name !== undefined) {
      props.name = name
    }
    if (disabled !== undefined) {
      props.disabled = disabled
    }
    if (inline !== undefined) {
      props.inline = inline
    }
    if (readOnly !== undefined) {
      props.readOnly = readOnly
    }
    if (required !== undefined) {
      props.required = required
    }
    return props
  }, [
    rootProps,
    valueProp,
    defaultOpen,
    openProp,
    onOpenChange,
    formatProp,
    defaultFormat,
    name,
    disabled,
    inline,
    readOnly,
    required,
  ])

  return (
    <ColorPickerStoreContext.Provider value={store}>
      <ColorPickerRootImpl {...rootImplProps} />
    </ColorPickerStoreContext.Provider>
  )
}

interface ColorPickerRootImplProps
  extends Omit<ColorPickerRootProps, 'defaultValue' | 'onValueChange' | 'onFormatChange'> {}

function ColorPickerRootImpl(props: ColorPickerRootImplProps) {
  const {
    value: valueProp,
    dir: dirProp,
    defaultOpen,
    open: openProp,
    onOpenChange,
    format: formatProp,
    defaultFormat = 'hex',
    name,
    ref,
    asChild,
    disabled,
    inline,
    modal,
    readOnly,
    required,
    ...rootProps
  } = props

  const store = useColorPickerStoreContext('ColorPickerRootImpl')

  const dir = useDirection(dirProp)

  const [formTrigger, setFormTrigger] = React.useState<HTMLDivElement | null>(null)
  const composedRef = useComposedRefs(ref && typeof ref !== 'string' ? ref : undefined, (node) => setFormTrigger(node))

  const isFormControl = formTrigger ? !!formTrigger.closest('form') : true

  React.useEffect(() => {
    if (valueProp !== undefined) {
      const currentState = store.getState()

      // Use parseColorString to handle all formats (hex, rgb, hsl, hsb)
      const parsedColor = parseColorString(valueProp)
      if (!parsedColor) {
        // If parsing fails, try hexToRgb as fallback for backward compatibility
        const fallbackColor = hexToRgb(valueProp, currentState.color.a)
        const hsv = rgbToHsv(fallbackColor)
        store.syncFromProp(fallbackColor, hsv)
        return
      }

      // Preserve alpha if not specified in the parsed color
      const finalColor = { ...parsedColor, a: parsedColor.a ?? currentState.color.a }

      // Check if the color values actually changed (compare RGB values, not string format)
      const colorChanged =
        finalColor.r !== currentState.color.r ||
        finalColor.g !== currentState.color.g ||
        finalColor.b !== currentState.color.b ||
        finalColor.a !== currentState.color.a

      // Skip if color values are the same (avoid unnecessary syncs)
      // This handles cases where the format changes but the color is the same
      if (!colorChanged) {
        return
      }

      const hsv = rgbToHsv(finalColor)

      // Use syncFromProp to update without triggering callbacks
      // This prevents onValueChange from being called when syncing from props
      // Don't wrap in setTimeout - syncFromProp already doesn't trigger callbacks
      // and we want the UI to update immediately
      store.syncFromProp(finalColor, hsv)
    }
  }, [valueProp, store])

  React.useEffect(() => {
    if (openProp !== undefined) {
      store.setOpen(openProp)
    }
  }, [openProp, store])

  React.useEffect(() => {
    const format = formatProp ?? defaultFormat
    // Use syncFormatFromProp to update without triggering callbacks
    // This prevents onFormatChange from being called when syncing from props
    store.syncFormatFromProp(format)
  }, [formatProp, defaultFormat, store])

  const contextValue = React.useMemo<ColorPickerContextValue>(() => {
    const value: ColorPickerContextValue = { dir }
    if (disabled !== undefined) {
      value.disabled = disabled
    }
    if (inline !== undefined) {
      value.inline = inline
    }
    if (readOnly !== undefined) {
      value.readOnly = readOnly
    }
    if (required !== undefined) {
      value.required = required
    }
    return value
  }, [dir, disabled, inline, readOnly, required])

  const value = useColorPickerStore((state) => rgbToHex(state.color))

  const open = useColorPickerStore((state) => state.open)

  const onPopoverOpenChange = React.useCallback(
    (newOpen: boolean) => {
      store.setOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [store.setOpen, onOpenChange],
  )

  const RootPrimitive = asChild ? Slot : 'div'

  if (inline) {
    return (
      <ColorPickerContext.Provider value={contextValue}>
        <RootPrimitive {...rootProps} ref={composedRef} />
        {isFormControl && (
          <VisuallyHiddenInput
            type="hidden"
            control={formTrigger}
            name={name}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
        )}
      </ColorPickerContext.Provider>
    )
  }

  const popoverProps = React.useMemo(() => {
    const props: React.ComponentProps<typeof Popover> = {
      open,
      onOpenChange: onPopoverOpenChange,
    }
    if (defaultOpen !== undefined) {
      props.defaultOpen = defaultOpen
    }
    if (modal !== undefined) {
      props.modal = modal
    }
    return props
  }, [defaultOpen, open, onPopoverOpenChange, modal])

  return (
    <ColorPickerContext.Provider value={contextValue}>
      <Popover {...popoverProps}>
        <RootPrimitive {...rootProps} ref={composedRef} />
        {isFormControl && (
          <VisuallyHiddenInput
            type="hidden"
            control={formTrigger}
            name={name}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
        )}
      </Popover>
    </ColorPickerContext.Provider>
  )
}

interface ColorPickerTriggerProps extends React.ComponentProps<typeof PopoverTrigger> {}

function ColorPickerTrigger(props: ColorPickerTriggerProps) {
  const { asChild, disabled, style, className, ...triggerProps } = props
  const context = useColorPickerContext('ColorPickerTrigger')

  const TriggerPrimitive = asChild ? Slot : Button

  const finalDisabled = context.disabled ?? disabled

  return (
    <PopoverTrigger asChild {...(finalDisabled !== undefined && { disabled: finalDisabled })}>
      <TriggerPrimitive
        data-slot="color-picker-trigger"
        {...triggerProps}
        {...(finalDisabled !== undefined && { disabled: finalDisabled })}
        {...(style !== undefined && { style })}
        {...(className !== undefined && { className })}
      />
    </PopoverTrigger>
  )
}

interface ColorPickerContentProps extends React.ComponentProps<typeof PopoverContent> {}

function ColorPickerContent(props: ColorPickerContentProps) {
  const { asChild, className, children, ...popoverContentProps } = props
  const context = useColorPickerContext('ColorPickerContent')

  if (context.inline) {
    const ContentPrimitive = asChild ? Slot : 'div'

    return (
      <ContentPrimitive
        data-slot="color-picker-content"
        {...popoverContentProps}
        className={cn('color-picker-content', className)}
      >
        {children}
      </ContentPrimitive>
    )
  }

  return (
    <PopoverContent
      data-slot="color-picker-content"
      {...(asChild !== undefined && { asChild })}
      {...popoverContentProps}
      className={cn('color-picker-content', className)}
    >
      {children}
    </PopoverContent>
  )
}

interface ColorPickerAreaProps extends React.ComponentProps<'div'> {
  asChild?: boolean
}

function ColorPickerArea(props: ColorPickerAreaProps) {
  const { asChild, className, ref, ...areaProps } = props
  const context = useColorPickerContext('ColorPickerArea')
  const store = useColorPickerStoreContext('ColorPickerArea')

  const hsv = useColorPickerStore((state) => state.hsv)

  const isDraggingRef = React.useRef(false)
  const areaRef = React.useRef<HTMLDivElement>(null)
  const composedRef = useComposedRefs(ref && typeof ref !== 'string' ? ref : undefined, areaRef)

  const updateColorFromPosition = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!areaRef.current) return

      const rect = areaRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height))

      const newHsv: HSVColorValue = {
        h: hsv?.h ?? 0,
        s: Math.round(x * 100),
        v: Math.round(y * 100),
        a: hsv?.a ?? 1,
      }

      store.setHsv(newHsv)
      store.setColor(hsvToRgb(newHsv))
    },
    [hsv, store],
  )

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      if (context.disabled) return

      isDraggingRef.current = true
      areaRef.current?.setPointerCapture(event.pointerId)
      updateColorFromPosition(event.clientX, event.clientY)
    },
    [context.disabled, updateColorFromPosition],
  )

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent) => {
      if (isDraggingRef.current) {
        updateColorFromPosition(event.clientX, event.clientY)
      }
    },
    [updateColorFromPosition],
  )

  const onPointerUp = React.useCallback((event: React.PointerEvent) => {
    isDraggingRef.current = false
    areaRef.current?.releasePointerCapture(event.pointerId)
  }, [])

  const hue = hsv?.h ?? 0
  const backgroundHue = hsvToRgb({ h: hue, s: 100, v: 100, a: 1 })

  const AreaPrimitive = asChild ? Slot : 'div'

  return (
    <AreaPrimitive
      data-slot="color-picker-area"
      {...areaProps}
      className={cn('color-picker-area', context.disabled && 'disabled', className)}
      ref={composedRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="color-picker-area-inner">
        <div
          className="color-picker-area-gradient"
          style={{
            backgroundColor: `rgb(${backgroundHue.r}, ${backgroundHue.g}, ${backgroundHue.b})`,
          }}
        />
        <div
          className="color-picker-area-gradient"
          style={{
            background: 'linear-gradient(to right, #fff, transparent)',
          }}
        />
        <div
          className="color-picker-area-gradient"
          style={{
            background: 'linear-gradient(to bottom, transparent, #000)',
          }}
        />
      </div>
      <div
        className="color-picker-area-gradient-hue"
        style={{
          left: `${hsv?.s ?? 0}%`,
          top: `${100 - (hsv?.v ?? 0)}%`,
        }}
      />
    </AreaPrimitive>
  )
}

interface ColorPickerHueSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {}

function ColorPickerHueSlider(props: ColorPickerHueSliderProps) {
  const { className, ...sliderProps } = props
  const context = useColorPickerContext('ColorPickerHueSlider')
  const store = useColorPickerStoreContext('ColorPickerHueSlider')

  const hsv = useColorPickerStore((state) => state.hsv)

  const onValueChange = React.useCallback(
    (values: number[]) => {
      const newHsv: HSVColorValue = {
        h: values[0] ?? 0,
        s: hsv?.s ?? 0,
        v: hsv?.v ?? 0,
        a: hsv?.a ?? 1,
      }
      store.setHsv(newHsv)
      store.setColor(hsvToRgb(newHsv))
    },
    [hsv, store],
  )

  return (
    <SliderPrimitive.Root
      data-slot="color-picker-hue-slider"
      {...sliderProps}
      max={360}
      step={1}
      className={cn('color-picker-hue-slider', className)}
      value={[hsv?.h ?? 0]}
      onValueChange={onValueChange}
      {...(context.disabled !== undefined && { disabled: context.disabled })}
    >
      <SliderPrimitive.Track className="color-picker-hue-slider-track">
        <SliderPrimitive.Range className="color-picker-hue-slider-range" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="color-picker-hue-slider-thumb" />
    </SliderPrimitive.Root>
  )
}

interface ColorPickerAlphaSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {}

function ColorPickerAlphaSlider(props: ColorPickerAlphaSliderProps) {
  const { className, ...sliderProps } = props
  const context = useColorPickerContext('ColorPickerAlphaSlider')
  const store = useColorPickerStoreContext('ColorPickerAlphaSlider')

  const color = useColorPickerStore((state) => state.color)
  const hsv = useColorPickerStore((state) => state.hsv)

  const onValueChange = React.useCallback(
    (values: number[]) => {
      const alpha = (values[0] ?? 0) / 100
      const newColor = { ...color, a: alpha }
      const newHsv = { ...hsv, a: alpha }
      store.setColor(newColor)
      store.setHsv(newHsv)
    },
    [color, hsv, store],
  )

  const gradientColor = `rgb(${color?.r ?? 0}, ${color?.g ?? 0}, ${color?.b ?? 0})`

  return (
    <SliderPrimitive.Root
      data-slot="color-picker-alpha-slider"
      {...sliderProps}
      max={100}
      step={1}
      {...(context.disabled !== undefined && { disabled: context.disabled })}
      className={cn('color-picker-alpha-slider', className)}
      value={[Math.round((color?.a ?? 1) * 100)]}
      onValueChange={onValueChange}
    >
      <SliderPrimitive.Track className="color-picker-alpha-slider-track">
        <div
          className="color-picker-alpha-slider-wrapper"
          style={{
            background: `linear-gradient(to right, transparent, ${gradientColor})`,
          }}
        />
        <SliderPrimitive.Range className="color-picker-alpha-slider-range" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="color-picker-alpha-slider-thumb" />
    </SliderPrimitive.Root>
  )
}

interface ColorPickerSwatchProps extends React.ComponentProps<'div'> {
  asChild?: boolean
}

function ColorPickerSwatch(props: ColorPickerSwatchProps) {
  const { asChild, className, ...swatchProps } = props
  const context = useColorPickerContext('ColorPickerSwatch')

  const color = useColorPickerStore((state) => state.color)
  const format = useColorPickerStore((state) => state.format)

  const backgroundStyle = React.useMemo(() => {
    if (!color) {
      return {
        background:
          'linear-gradient(to bottom right, transparent calc(50% - 1px), hsl(var(--destructive)) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)) no-repeat',
      }
    }

    const colorString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`

    if (color.a < 1) {
      return {
        background: `linear-gradient(${colorString}, ${colorString}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0% 50% / 8px 8px`,
      }
    }

    return {
      backgroundColor: colorString,
    }
  }, [color])

  const ariaLabel = !color ? 'No color selected' : `Current color: ${colorToString(color, format)}`

  const SwatchPrimitive = asChild ? Slot : 'div'

  return (
    <SwatchPrimitive
      role="img"
      aria-label={ariaLabel}
      data-slot="color-picker-swatch"
      {...swatchProps}
      className={cn('color-picker-swatch', context.disabled && 'opacity-50', className)}
      style={{
        ...backgroundStyle,
        forcedColorAdjust: 'none',
      }}
    />
  )
}

function ColorPickerEyeDropper(props: React.ComponentProps<typeof Button>) {
  const { children, size, ...buttonProps } = props
  const context = useColorPickerContext('ColorPickerEyeDropper')
  const store = useColorPickerStoreContext('ColorPickerEyeDropper')

  const color = useColorPickerStore((state) => state.color)

  const onEyeDropper = React.useCallback(async () => {
    if (!window.EyeDropper) return

    try {
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()

      if (result.sRGBHex) {
        const currentAlpha = color?.a ?? 1
        const newColor = hexToRgb(result.sRGBHex, currentAlpha)
        const newHsv = rgbToHsv(newColor)
        store.setColor(newColor)
        store.setHsv(newHsv)
      }
    } catch (error) {
      console.warn('EyeDropper error:', error)
    }
  }, [color, store])

  const hasEyeDropper = typeof window !== 'undefined' && !!window.EyeDropper

  if (!hasEyeDropper) return null

  const buttonSize = size ?? (children ? 'default' : 'icon')

  return (
    <Button
      data-slot="color-picker-eye-dropper"
      {...buttonProps}
      variant="outline"
      size={buttonSize}
      onClick={onEyeDropper}
      {...(context.disabled !== undefined && { disabled: context.disabled })}
    >
      {children ?? <PipetteIcon />}
    </Button>
  )
}

interface ColorPickerFormatSelectProps
  extends Omit<React.ComponentProps<typeof SelectInput>, 'value' | 'onValueChange'>,
    Pick<React.ComponentProps<typeof SelectTrigger>, 'className'> {}

function ColorPickerFormatSelect(props: ColorPickerFormatSelectProps) {
  const { className, ...selectProps } = props
  const context = useColorPickerContext('ColorPickerFormatSelector')
  const store = useColorPickerStoreContext('ColorPickerFormatSelector')

  const format = useColorPickerStore((state) => state.format)

  const onFormatChange = React.useCallback(
    (value: ColorFormat) => {
      store.setFormat(value)
    },
    [store],
  )

  const handleValueChange = React.useCallback(
    (value: unknown) => {
      if (typeof value === 'string' && (colorFormats as readonly string[]).includes(value)) {
        onFormatChange(value as ColorFormat)
      }
    },
    [onFormatChange],
  )

  return (
    <SelectInput
      {...selectProps}
      value={format}
      onValueChange={handleValueChange}
      {...(context.disabled !== undefined && { disabled: context.disabled })}
      items={colorFormats.map((format) => ({ label: format.toUpperCase(), value: format }))}
      size="sm"
    >
    </SelectInput>
  )
}

interface ColorPickerInputProps extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'color'> {
  withoutAlpha?: boolean
}

function ColorPickerInput(props: ColorPickerInputProps) {
  const context = useColorPickerContext('ColorPickerInput')
  const store = useColorPickerStoreContext('ColorPickerInput')

  const color = useColorPickerStore((state) => state.color)
  const format = useColorPickerStore((state) => state.format)
  const hsv = useColorPickerStore((state) => state.hsv)

  const onColorChange = React.useCallback(
    (newColor: ColorValue) => {
      const newHsv = rgbToHsv(newColor)
      store.setColor(newColor)
      store.setHsv(newHsv)
    },
    [store],
  )

  if (format === 'hex') {
    return <HexInput color={color} onColorChange={onColorChange} context={context} {...props} />
  }

  if (format === 'rgb') {
    return <RgbInput color={color} onColorChange={onColorChange} context={context} {...props} />
  }

  if (format === 'hsl') {
    return <HslInput color={color} onColorChange={onColorChange} context={context} {...props} />
  }

  if (format === 'hsb') {
    return <HsbInput hsv={hsv} onColorChange={onColorChange} context={context} {...props} />
  }
}



interface InputGroupItemProps extends React.ComponentProps<typeof Input> {}

const InputGroupItem = React.forwardRef<HTMLInputElement, InputGroupItemProps>(({ className, ...props }, ref) => {
  return (
    <Input data-slot="color-picker-input" className={cn('flex-1 !min-w-0', className)} ref={ref} {...props} small />
  )
})
InputGroupItem.displayName = 'InputGroupItem'

interface FormatInputProps extends ColorPickerInputProps {
  color: ColorValue
  onColorChange: (color: ColorValue) => void
  context: ColorPickerContextValue
}

function HexInput(props: FormatInputProps) {
  const { color, onColorChange, context, withoutAlpha, className, ...inputProps } = props

  const hexValue = rgbToHex(color)
  const alphaValue = Math.round((color?.a ?? 1) * 100)

  // Local state to track input value while typing
  const [localHexValue, setLocalHexValue] = React.useState(hexValue)
  const lastSyncedValueRef = React.useRef(hexValue)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  // Sync local state when color prop changes externally (not from our own input)
  React.useEffect(() => {
    // Only sync if the value actually changed and it's different from what the user is typing
    // Check if the input is focused - if so, don't sync (user is actively typing)
    const isInputFocused = document.activeElement === inputRef.current
    const valueChanged = hexValue !== lastSyncedValueRef.current

    if (valueChanged && !isInputFocused) {
      setLocalHexValue(hexValue)
      lastSyncedValueRef.current = hexValue
    }
  }, [hexValue])

  const onHexChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      // Update local state immediately so user can see what they're typing
      setLocalHexValue(value)

      // Only update the color if the value is valid
      const parsedColor = parseColorString(value)
      if (parsedColor) {
        onColorChange({ ...parsedColor, a: color?.a ?? 1 })
        // Update the last synced value to prevent unnecessary resets
        const newHexValue = rgbToHex({ ...parsedColor, a: color?.a ?? 1 })
        lastSyncedValueRef.current = newHexValue
      }
    },
    [color, onColorChange],
  )

  const onHexBlur = React.useCallback(() => {
    // When input loses focus, sync with the current color value
    // This ensures the input shows the correct formatted value (e.g., "#aabbcc" instead of "#abc")
    setLocalHexValue(hexValue)
    lastSyncedValueRef.current = hexValue
  }, [hexValue])

  const onAlphaChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10)
      if (!Number.isNaN(value) && value >= 0 && value <= 100) {
        onColorChange({ ...color, a: value / 100 })
      }
    },
    [color, onColorChange],
  )

  if (withoutAlpha) {
    return (
      <InputGroupItem
        ref={inputRef}
        aria-label="Hex color value"

        {...inputProps}
        placeholder="#000000"
        className={cn('font-mono', className)}
        value={localHexValue}
        onChange={onHexChange}
        onBlur={onHexBlur}
        disabled={context.disabled}
      />
    )
  }

  return (
    <div data-slot="color-picker-input-wrapper" className={cn('flex items-center gap-1', className)}>
      <InputGroupItem
        ref={inputRef}
        aria-label="Hex color value"

        {...inputProps}
        placeholder="#000000"
        className="flex-2 font-mono"
        value={localHexValue}
        onChange={onHexChange}
        onBlur={onHexBlur}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Alpha transparency percentage"

        {...inputProps}
        placeholder="100"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="flex-1"
        value={alphaValue}
        onChange={onAlphaChange}
        disabled={context.disabled}
      />
    </div>
  )
}

function RgbInput(props: FormatInputProps) {
  const { color, onColorChange, context, withoutAlpha, className, ...inputProps } = props

  const rValue = Math.round(color?.r ?? 0)
  const gValue = Math.round(color?.g ?? 0)
  const bValue = Math.round(color?.b ?? 0)
  const alphaValue = Math.round((color?.a ?? 1) * 100)

  const onChannelChange = React.useCallback(
    (channel: 'r' | 'g' | 'b' | 'a', max: number, isAlpha = false) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(event.target.value, 10)
        if (!Number.isNaN(value) && value >= 0 && value <= max) {
          const newValue = isAlpha ? value / 100 : value
          onColorChange({ ...color, [channel]: newValue })
        }
      },
    [color, onColorChange],
  )

  return (
    <div data-slot="color-picker-input-wrapper" className={cn('flex items-center gap-1', className)}>
      <InputGroupItem
        aria-label="Red color component (0-255)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="255"
        className="w-14"
        value={rValue}
        onChange={onChannelChange('r', 255)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Green color component (0-255)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="255"
        className="w-14"
        value={gValue}
        onChange={onChannelChange('g', 255)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Blue color component (0-255)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="255"
        className="w-14"
        value={bValue}
        onChange={onChannelChange('b', 255)}
        disabled={context.disabled}
      />
      {!withoutAlpha && (
        <InputGroupItem
          aria-label="Alpha transparency percentage"

          {...inputProps}
          placeholder="100"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="100"
          className="w-14"
          value={alphaValue}
          onChange={onChannelChange('a', 100, true)}
          disabled={context.disabled}
        />
      )}
    </div>
  )
}

function HslInput(props: FormatInputProps) {
  const { color, onColorChange, context, withoutAlpha, className, ...inputProps } = props

  const hsl = React.useMemo(() => rgbToHsl(color), [color])
  const alphaValue = Math.round((color?.a ?? 1) * 100)

  const onHslChannelChange = React.useCallback(
    (channel: 'h' | 's' | 'l', max: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10)
      if (!Number.isNaN(value) && value >= 0 && value <= max) {
        const newHsl = { ...hsl, [channel]: value }
        const newColor = hslToRgb(newHsl, color?.a ?? 1)
        onColorChange(newColor)
      }
    },
    [hsl, color, onColorChange],
  )

  const onAlphaChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10)
      if (!Number.isNaN(value) && value >= 0 && value <= 100) {
        onColorChange({ ...color, a: value / 100 })
      }
    },
    [color, onColorChange],
  )

  return (
    <div data-slot="color-picker-input-wrapper" className={cn('flex items-center gap-1', className)}>
      <InputGroupItem
        aria-label="Hue degree (0-360)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="360"
        className="w-14"
        value={hsl.h}
        onChange={onHslChannelChange('h', 360)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Saturation percentage (0-100)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={hsl.s}
        onChange={onHslChannelChange('s', 100)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Lightness percentage (0-100)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={hsl.l}
        onChange={onHslChannelChange('l', 100)}
        disabled={context.disabled}
      />
      {!withoutAlpha && (
        <InputGroupItem
          aria-label="Alpha transparency percentage"

          {...inputProps}
          placeholder="100"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="100"
          className="w-14"
          value={alphaValue}
          onChange={onAlphaChange}
          disabled={context.disabled}
        />
      )}
    </div>
  )
}

interface HsbInputProps extends Omit<FormatInputProps, 'color'> {
  hsv: HSVColorValue
}

function HsbInput(props: HsbInputProps) {
  const { hsv, onColorChange, context, withoutAlpha, className, ...inputProps } = props

  const alphaValue = Math.round((hsv?.a ?? 1) * 100)

  const onHsvChannelChange = React.useCallback(
    (channel: 'h' | 's' | 'v', max: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10)
      if (!Number.isNaN(value) && value >= 0 && value <= max) {
        const newHsv = { ...hsv, [channel]: value }
        const newColor = hsvToRgb(newHsv)
        onColorChange(newColor)
      }
    },
    [hsv, onColorChange],
  )

  const onAlphaChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10)
      if (!Number.isNaN(value) && value >= 0 && value <= 100) {
        const currentColor = hsvToRgb(hsv)
        onColorChange({ ...currentColor, a: value / 100 })
      }
    },
    [hsv, onColorChange],
  )

  return (
    <div data-slot="color-picker-input-wrapper" className={cn('flex items-center gap-1', className)}>
      <InputGroupItem
        aria-label="Hue degree (0-360)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="360"
        className="w-14"
        value={hsv?.h ?? 0}
        onChange={onHsvChannelChange('h', 360)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Saturation percentage (0-100)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={hsv?.s ?? 0}
        onChange={onHsvChannelChange('s', 100)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Brightness percentage (0-100)"

        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={hsv?.v ?? 0}
        onChange={onHsvChannelChange('v', 100)}
        disabled={context.disabled}
      />
      {!withoutAlpha && (
        <InputGroupItem
          aria-label="Alpha transparency percentage"

          {...inputProps}
          placeholder="100"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="100"
          className="w-14"
          value={alphaValue}
          onChange={onAlphaChange}
          disabled={context.disabled}
        />
      )}
    </div>
  )
}

export {
  ColorPickerRoot as ColorPicker,
  ColorPickerTrigger,
  ColorPickerContent,
  ColorPickerArea,
  ColorPickerHueSlider,
  ColorPickerAlphaSlider,
  ColorPickerSwatch,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerInput,
  //
  ColorPickerRoot as Root,
  ColorPickerTrigger as Trigger,
  ColorPickerContent as Content,
  ColorPickerArea as Area,
  ColorPickerHueSlider as HueSlider,
  ColorPickerAlphaSlider as AlphaSlider,
  ColorPickerSwatch as Swatch,
  ColorPickerEyeDropper as EyeDropper,
  ColorPickerFormatSelect as FormatSelect,
  ColorPickerInput as Input,
  //
  useColorPickerStore as useColorPicker,
}
