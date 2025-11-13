import type { CoralComponentPropertyType } from '@reallygoodwork/coral-core'

import { generatePropsInterface } from '../generatePropsInterface'

describe('generatePropsInterface', () => {
  it('should return empty string when no properties provided', () => {
    const result = generatePropsInterface()
    expect(result).toBe('')
  })

  it('should generate interface with simple properties', () => {
    const props: CoralComponentPropertyType = {
      label: {
        type: 'string',
        optional: false,
      },
      count: {
        type: 'number',
        optional: true,
      },
    }

    const result = generatePropsInterface(props, 'Button')
    expect(result).toContain('interface ButtonProps')
    expect(result).toContain('label: string')
    expect(result).toContain('count?: number')
  })

  it('should handle union types', () => {
    const props: CoralComponentPropertyType = {
      variant: {
        type: ['string', 'number'],
        optional: true,
      },
    }

    const result = generatePropsInterface(props, 'Button')
    expect(result).toContain('variant?: string | number')
  })

  it('should handle default component name', () => {
    const props: CoralComponentPropertyType = {
      label: {
        type: 'string',
        optional: false,
      },
    }

    const result = generatePropsInterface(props)
    expect(result).toContain('interface Props')
  })

  it('should handle descriptions', () => {
    const props: CoralComponentPropertyType = {
      label: {
        type: 'string',
        optional: false,
        description: 'Button label text',
      },
    }

    const result = generatePropsInterface(props, 'Button')
    expect(result).toContain('label: string // Button label text')
  })
})
