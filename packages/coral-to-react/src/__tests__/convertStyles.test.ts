import type { CoralStyleType } from '@reallygoodwork/coral-core'

import { stylesToInlineStyle } from '../convertStyles'

describe('convertStyles', () => {
  it('should return empty string when no styles provided', () => {
    const result = stylesToInlineStyle()
    expect(result).toBe('')
  })

  it('should convert number values to pixels', () => {
    const styles: CoralStyleType = {
      fontSize: 16,
      padding: 20,
    }

    const result = stylesToInlineStyle(styles)
    expect(result).toContain('fontSize: 16')
    expect(result).toContain('padding: 20')
  })

  it('should convert dimension objects', () => {
    const styles: CoralStyleType = {
      fontSize: { value: 1.5, unit: 'rem' },
      padding: { value: 20, unit: 'px' },
      margin: { value: 2, unit: 'em' },
    }

    const result = stylesToInlineStyle(styles)
    expect(result).toContain("fontSize: '1.5rem'")
    expect(result).toContain("padding: '20px'")
    expect(result).toContain("margin: '2em'")
  })

  it('should convert color objects', () => {
    const styles: CoralStyleType = {
      color: {
        hex: '#333',
        rgb: { r: 51, g: 51, b: 51, a: 1 },
        hsl: { h: 0, s: 0, l: 20, a: 1 },
      },
      backgroundColor: {
        hex: '#fff',
        rgb: { r: 255, g: 255, b: 255, a: 1 },
        hsl: { h: 0, s: 0, l: 100, a: 1 },
      },
    }

    const result = stylesToInlineStyle(styles)
    expect(result).toContain("color: '#333'")
    expect(result).toContain("backgroundColor: '#fff'")
  })

  it('should convert string values', () => {
    const styles: CoralStyleType = {
      display: 'flex',
      position: 'relative',
    }

    const result = stylesToInlineStyle(styles)
    expect(result).toContain("display: 'flex'")
    expect(result).toContain("position: 'relative'")
  })

  it('should handle camelCase to kebab-case conversion for CSS properties', () => {
    const styles: CoralStyleType = {
      backgroundColor: '#fff',
      fontSize: 16,
      paddingTop: 10,
    }

    const result = stylesToInlineStyle(styles)
    // Note: React inline styles use camelCase, not kebab-case
    expect(result).toContain('backgroundColor')
    expect(result).toContain('fontSize')
    expect(result).toContain('paddingTop')
  })
})
