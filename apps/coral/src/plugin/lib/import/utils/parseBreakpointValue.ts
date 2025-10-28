// Parse breakpoint value to number for sorting (convert px, rem, em to comparable values)
export const parseBreakpointValue = (value: string): number => {
  const numValue = parseFloat(value)
  if (value.endsWith('rem') || value.endsWith('em')) {
    return numValue * 16 // Convert rem/em to px (assuming 16px base)
  }
  return numValue // Assume px
}
