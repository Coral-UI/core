import type { Dimension } from '@reallygoodwork/coral-core'

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
 * Only includes values that differ from the current element styles
 */
export function convertFormValuesToCoralStyles(
  formValues: Record<string, unknown>,
  defaultValues: Record<string, unknown>,
  currentStyles?: Record<string, unknown>,
): Record<string, unknown> {
  const coralStyles: Record<string, unknown> = {}

  Object.entries(formValues).forEach(([key, value]) => {
    // Skip if this is a unit property - it will be handled with its value property
    if (Object.values(DIMENSION_PROPERTIES).includes(key)) {
      return
    }

    const defaultValue = defaultValues[key]

    // Check if value is meaningful (not empty/null/undefined)
    const hasValue = value !== '' && value !== null && value !== undefined

    // For dimension properties, check if the value is actually set (not just the default empty)
    if (key in DIMENSION_PROPERTIES) {
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

      // Check if this value exists in current styles
      const currentValue = currentStyles?.[key]
      const currentNumeric =
        typeof currentValue === 'object' && currentValue !== null && 'value' in currentValue
          ? (currentValue as any).value
          : typeof currentValue === 'number'
            ? currentValue
            : undefined

      // Only include if:
      // 1. We have a valid numeric value AND
      // 2. Either the current style doesn't exist OR the value is different
      if (numericValue !== undefined && !isNaN(numericValue)) {
        // Always include if element already has this style set
        if (currentNumeric !== undefined) {
          const convertedValue = convertFormValueToCoralStyle(key, numericValue, formValues)
          if (convertedValue !== undefined) {
            coralStyles[key] = convertedValue
          }
        }
        // Only include if different from default
        else if (numericValue !== defaultValue) {
          const convertedValue = convertFormValueToCoralStyle(key, numericValue, formValues)
          if (convertedValue !== undefined) {
            coralStyles[key] = convertedValue
          }
        }
      }
    } else {
      // For non-dimension properties, use the original logic
      const isDefault =
        value === defaultValue ||
        (value === '' && (defaultValue === '' || defaultValue === null || defaultValue === undefined)) ||
        (value === null && defaultValue === null) ||
        (value === undefined && defaultValue === undefined)

      if (!isDefault && hasValue) {
        coralStyles[key] = value
      }
    }
  })

  return coralStyles
}

/**
 * Convert Coral styles to form values
 * Splits dimension objects into separate value and unit fields
 */
export function convertCoralStylesToFormValues(coralStyles: Record<string, unknown>): Record<string, unknown> {
  const formValues: Record<string, unknown> = {}

  Object.entries(coralStyles).forEach(([key, value]) => {
    // Check if this is a dimension object
    if (
      typeof value === 'object' &&
      value !== null &&
      'value' in value &&
      'unit' in value &&
      typeof (value as any).value === 'number' &&
      typeof (value as any).unit === 'string'
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
    } else {
      // Regular property
      formValues[key] = value
    }
  })

  return formValues
}
