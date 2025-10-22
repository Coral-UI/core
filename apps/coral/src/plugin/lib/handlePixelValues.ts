/**
 * Converts CSS value strings to dimension objects
 * Returns dimension object with value and unit
 */
export const handlesPixelValues = (value: string | number) => {
  if (typeof value !== 'string') return value

  // Match CSS values with units (e.g., "16px", "1.5rem", "100%")
  const match = value.match(/^([-\d.]+)(\w+|%)$/)

  if (match) {
    const [, numValue, unit] = match
    const parsedValue = parseFloat(numValue)

    if (!isNaN(parsedValue)) {
      // Return dimension object
      return {
        value: parsedValue,
        unit: unit,
      }
    }
  }

  // If no unit found or invalid, return as-is
  return value
}
