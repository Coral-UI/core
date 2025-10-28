export const isGradientString = (value: string): boolean => {
  return value.startsWith('linear-gradient') || value.startsWith('radial-gradient')
}
