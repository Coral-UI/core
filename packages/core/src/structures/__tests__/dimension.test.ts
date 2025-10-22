import { dimensionToCSS, normalizeDimension, zDimensionSchema } from '../dimension'

describe('zDimensionSchema', () => {
  it('should accept a plain number', () => {
    const result = zDimensionSchema.safeParse(16)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe(16)
    }
  })

  it('should accept a dimension object with px unit', () => {
    const result = zDimensionSchema.safeParse({ value: 16, unit: 'px' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ value: 16, unit: 'px' })
    }
  })

  it('should accept a dimension object with rem unit', () => {
    const result = zDimensionSchema.safeParse({ value: 1.5, unit: 'rem' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ value: 1.5, unit: 'rem' })
    }
  })

  it('should accept a dimension object with em unit', () => {
    const result = zDimensionSchema.safeParse({ value: 2, unit: 'em' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ value: 2, unit: 'em' })
    }
  })

  it('should accept various CSS units', () => {
    const units = ['px', 'em', 'rem', 'vw', 'vh', 'vmin', 'vmax', '%', 'ch', 'ex']
    units.forEach((unit) => {
      const result = zDimensionSchema.safeParse({ value: 10, unit })
      expect(result.success).toBe(true)
    })
  })

  it('should reject invalid unit', () => {
    const result = zDimensionSchema.safeParse({ value: 16, unit: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('should reject dimension object without value', () => {
    const result = zDimensionSchema.safeParse({ unit: 'px' })
    expect(result.success).toBe(false)
  })

  it('should reject dimension object without unit', () => {
    const result = zDimensionSchema.safeParse({ value: 16 })
    expect(result.success).toBe(false)
  })
})

describe('dimensionToCSS', () => {
  it('should convert a number to px', () => {
    expect(dimensionToCSS(16)).toBe('16px')
  })

  it('should convert a dimension object to CSS string', () => {
    expect(dimensionToCSS({ value: 1.5, unit: 'rem' })).toBe('1.5rem')
    expect(dimensionToCSS({ value: 2, unit: 'em' })).toBe('2em')
    expect(dimensionToCSS({ value: 100, unit: '%' })).toBe('100%')
    expect(dimensionToCSS({ value: 50, unit: 'vw' })).toBe('50vw')
  })
})

describe('normalizeDimension', () => {
  it('should normalize a number to dimension object with px unit', () => {
    expect(normalizeDimension(16)).toEqual({ value: 16, unit: 'px' })
  })

  it('should return dimension object unchanged', () => {
    const dimension = { value: 1.5, unit: 'rem' as const }
    expect(normalizeDimension(dimension)).toEqual(dimension)
  })
})
