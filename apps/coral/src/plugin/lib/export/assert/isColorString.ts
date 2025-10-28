export const isColorString = (value: string): boolean => {
  return (
    value.startsWith('#') ||
    value.startsWith('hsl') ||
    value.startsWith('hsla') ||
    value.startsWith('rgb') ||
    value.startsWith('rgba')
  )
}
