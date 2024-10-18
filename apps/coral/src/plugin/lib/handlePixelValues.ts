export const handlesPixelValues = (value: string | number) => {
  if (typeof value !== 'string') return value
  if (value.endsWith('px')) return parseFloat(value)
  const pxIndex = value.indexOf('px')
  return pxIndex !== -1 ? parseFloat(value.substring(0, pxIndex)) : value
}
