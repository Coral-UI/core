import { colord } from 'colord'

import type { CoralColorType, Dimension } from '@reallygoodwork/coral-core'

/**
 * Properties that should be converted to dimension objects
 * Each property name maps to its corresponding unit property name
 */
const DIMENSION_PROPERTIES: Record<string, string> = {
  fontSize: 'fontSizeUnit',
  lineHeight: 'lineHeightUnit',
  letterSpacing: 'letterSpacingUnit',
  width: 'widthUnit',
  height: 'heightUnit',
  minWidth: 'minWidthUnit',
  minHeight: 'minHeightUnit',
  maxWidth: 'maxWidthUnit',
  maxHeight: 'maxHeightUnit',
  marginInlineStart: 'marginInlineStartUnit',
  marginInlineEnd: 'marginInlineEndUnit',
  marginBlockStart: 'marginBlockStartUnit',
  marginBlockEnd: 'marginBlockEndUnit',
  paddingInlineStart: 'paddingInlineStartUnit',
  paddingInlineEnd: 'paddingInlineEndUnit',
  paddingBlockStart: 'paddingBlockStartUnit',
  paddingBlockEnd: 'paddingBlockEndUnit',
  gapX: 'gapXUnit',
  gapY: 'gapYUnit',
  top: 'topUnit',
  right: 'rightUnit',
  bottom: 'bottomUnit',
  left: 'leftUnit',
  borderTopLeftRadius: 'borderTopLeftRadiusUnit',
  borderTopRightRadius: 'borderTopRightRadiusUnit',
  borderBottomLeftRadius: 'borderBottomLeftRadiusUnit',
  borderBottomRightRadius: 'borderBottomRightRadiusUnit',
  borderInlineStartWidth: 'borderInlineStartWidthUnit',
  borderInlineEndWidth: 'borderInlineEndWidthUnit',
  borderBlockStartWidth: 'borderBlockStartWidthUnit',
  borderBlockEndWidth: 'borderBlockEndWidthUnit',
}

/**
 * Properties that should be converted to Coral color objects
 */
const COLOR_PROPERTIES = [
  'backgroundColor',
  'color',
  'borderInlineStartColor',
  'borderInlineEndColor',
  'borderBlockStartColor',
  'borderBlockEndColor',
] as const

/**
 * Format properties that should be excluded from Coral styles
 * These are form metadata, not actual style values
 */
const FORMAT_PROPERTIES = ['backgroundColorFormat', 'colorFormat'] as const

/**
 * Convert a color string (hex, rgb, hsl) to Coral color format
 */
function convertColorStringToCoralColor(colorString: string): CoralColorType {
  const color = colord(colorString)

  if (!color.isValid()) {
    // Fallback to black if invalid
    return {
      hex: '#000000',
      rgb: { r: 0, g: 0, b: 0, a: 1 },
      hsl: { h: 0, s: 0, l: 0, a: 1 },
    }
  }

  const rgb = color.toRgb()
  const hslRaw = color.toHsl()

  // colord().toHsl() returns HSL with s and l as decimals (0-1)
  // Coral schema expects s and l as percentages (0-100)
  // Check if values are already in percentage format (0-100 range)
  // If s or l is > 1, it's already a percentage, otherwise convert from decimal
  const hsl = {
    h: Math.round(hslRaw.h),
    s: hslRaw.s > 1 ? Math.round(hslRaw.s) : Math.round(hslRaw.s * 100),
    l: hslRaw.l > 1 ? Math.round(hslRaw.l) : Math.round(hslRaw.l * 100),
    a: hslRaw.a ?? 1,
  }

  // Ensure values are within valid range (0-100 for s and l)
  hsl.s = Math.max(0, Math.min(100, hsl.s))
  hsl.l = Math.max(0, Math.min(100, hsl.l))

  return {
    hex: color.toHex(),
    rgb: {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      a: rgb.a ?? 1,
    },
    hsl,
  }
}

/**
 * Convert form values to Coral style values
 * Combines dimension values with their units into dimension objects
 * Always returns dimension objects with units (never plain numbers)
 */
export function convertFormValueToCoralStyle(
  key: string,
  value: unknown,
  allFormValues: Record<string, unknown>,
): unknown {
  // Check if this is a dimension property
  if (key in DIMENSION_PROPERTIES) {
    const unitKey = DIMENSION_PROPERTIES[key]
    const unit = (unitKey && allFormValues[unitKey]) || 'px' // Default to 'px' if no unit specified

    // Only create dimension object if we have a valid value
    if (typeof value === 'number' && !isNaN(value) && value !== null && value !== undefined) {
      // Always create dimension object with unit
      return {
        value,
        unit,
      } as Dimension
    }

    return undefined
  }

  // Skip unit properties - they're combined with their value properties
  if (Object.values(DIMENSION_PROPERTIES).includes(key)) {
    return undefined
  }

  return value
}

/**
 * Convert form values object to Coral styles object
 * Handles dimension properties by combining values and units
 * Only processes fields that are explicitly passed in formValues
 */
export function convertFormValuesToCoralStyles(
  formValues: Record<string, unknown>,
  // defaultValues: Record<string, unknown>,
  // currentStyles?: Record<string, unknown>,
): Record<string, unknown> {
  const coralStyles: Record<string, unknown> = {}

  // Only process the fields that are actually in formValues
  // This ensures we only convert fields that were explicitly passed
  Object.entries(formValues).forEach(([key, value]) => {
    // Skip format properties - these are form metadata, not style values
    if (FORMAT_PROPERTIES.includes(key as (typeof FORMAT_PROPERTIES)[number])) {
      return
    }

    // Skip "Enabled" properties - these are form metadata indicating section state
    if (key.endsWith('Enabled')) {
      return
    }

    // Skip if this is a unit property - it will be handled with its value property
    if (Object.values(DIMENSION_PROPERTIES).includes(key)) {
      return
    }

    // Check if value is meaningful (not empty/null/undefined)
    const hasValue = value !== '' && value !== null && value !== undefined

    // For dimension properties, check if the value is actually set (not just the default empty)
    if (key in DIMENSION_PROPERTIES) {
      // Skip if value is undefined (represents "auto" for width/height)
      if (value === undefined || value === null) {
        return
      }

      // Convert string to number if needed
      let numericValue: number | undefined
      if (typeof value === 'number') {
        numericValue = value
      } else if (typeof value === 'string' && value !== '') {
        const parsed = parseFloat(value)
        if (!isNaN(parsed)) {
          numericValue = parsed
        }
      }

      // Only include if we have a valid numeric value
      // Since we're only processing fields that were explicitly passed,
      // we include them regardless of default values
      if (numericValue !== undefined && !isNaN(numericValue)) {
        const convertedValue = convertFormValueToCoralStyle(key, numericValue, formValues)
        if (convertedValue !== undefined) {
          coralStyles[key] = convertedValue
        }
      }
    } else {
      // For non-dimension properties
      // Since we're only processing fields that were explicitly passed,
      // we include them if they have a meaningful value
      if (hasValue) {
        // Check if this is a color property
        if (COLOR_PROPERTIES.includes(key as (typeof COLOR_PROPERTIES)[number])) {
          // Convert color string to Coral color format
          if (typeof value === 'string') {
            coralStyles[key] = convertColorStringToCoralColor(value)
          } else {
            // If it's already a CoralColorType, use it as-is
            coralStyles[key] = value
          }
        } else {
          // Regular property
          coralStyles[key] = value
        }
      }
    }
  })

  return coralStyles
}

/**
 * Convert Coral styles to form values
 * Splits dimension objects into separate value and unit fields
 * Infers "Enabled" properties based on whether related style properties exist
 *
 * @param coralStyles - The Coral styles object to convert
 * @param preserveEnabledStates - Optional object containing current "Enabled" states to preserve.
 *                                If an enabled state is `true` here, it will be preserved even if
 *                                there are no corresponding style properties in coralStyles.
 */
export function convertCoralStylesToFormValues(
  coralStyles: Record<string, unknown>,
  preserveEnabledStates?: Record<string, boolean>,
): Record<string, unknown> {
  const formValues: Record<string, unknown> = {}

  Object.entries(coralStyles).forEach(([key, value]) => {
    // Check if this is a dimension object
    if (
      typeof value === 'object' &&
      value !== null &&
      'value' in value &&
      'unit' in value &&
      typeof (value as Dimension & { value: number }).value === 'number' &&
      typeof (value as Dimension & { unit: string }).unit === 'string'
    ) {
      const dimension = value as Dimension & { value: number; unit: string }
      formValues[key] = dimension.value
      const unitKey = DIMENSION_PROPERTIES[key]
      if (unitKey) {
        formValues[unitKey] = dimension.unit
      }
    } else if (typeof value === 'number' && key in DIMENSION_PROPERTIES) {
      // Plain number for a dimension property - use 'px' as unit
      formValues[key] = value
      const unitKey = DIMENSION_PROPERTIES[key]
      if (unitKey) {
        formValues[unitKey] = 'px'
      }
    } else if (
      typeof value === 'object' &&
      value !== null &&
      'hex' in value &&
      'rgb' in value &&
      'hsl' in value &&
      COLOR_PROPERTIES.includes(key as (typeof COLOR_PROPERTIES)[number])
    ) {
      // Coral color object - extract hex string for form
      const coralColor = value as CoralColorType
      formValues[key] = coralColor.hex
      // Note: colorFormat is handled separately in the form
    } else {
      // Regular property
      formValues[key] = value
    }
  })

  // Infer "Enabled" properties based on whether related style properties exist
  // This ensures optional sections stay open when they have values
  const styleKeys = Object.keys(coralStyles)

  // typographyEnabled: true if any typography-related properties exist
  // OR if it's preserved as true in preserveEnabledStates
  const typographyProperties = ['fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'letterSpacing']
  const hasTypographyProperties = typographyProperties.some((prop) => styleKeys.includes(prop))
  const preserveTypographyEnabled = preserveEnabledStates?.['typographyEnabled'] === true
  if (hasTypographyProperties || preserveTypographyEnabled) {
    formValues['typographyEnabled'] = true
  }

  // borderEnabled: true if any border-related properties exist
  // Check both naming conventions (borderTopLeftRadius in Coral styles, borderRadiusTopLeft in form)
  const borderProperties = [
    'borderColor',
    'borderWidth',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderRadiusTopLeft',
    'borderRadiusTopRight',
    'borderRadiusBottomRight',
    'borderRadiusBottomLeft',
    'borderRadius',
  ]
  const hasBorderProperties = borderProperties.some((prop) => styleKeys.includes(prop))
  const preserveBorderEnabled = preserveEnabledStates?.['borderEnabled'] === true
  if (hasBorderProperties || preserveBorderEnabled) {
    formValues['borderEnabled'] = true
  }

  // overflowEnabled: true if overflow properties exist
  const overflowProperties = ['overflowX', 'overflowY', 'overflow']
  const hasOverflowProperties = overflowProperties.some((prop) => styleKeys.includes(prop))
  const preserveOverflowEnabled = preserveEnabledStates?.['overflowEnabled'] === true
  if (hasOverflowProperties || preserveOverflowEnabled) {
    formValues['overflowEnabled'] = true
  }

  return formValues
}
