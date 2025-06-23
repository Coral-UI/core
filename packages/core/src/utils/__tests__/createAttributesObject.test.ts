import { createAttributesObject } from '../createAttributesObject'

describe('createAttributesObject', () => {
  it('should return the same object when no class property exists', () => {
    const attributes = {
      id: 'test-id',
      'data-test': 'test-value',
      disabled: true
    }

    const result = createAttributesObject(attributes)

    expect(result).toEqual(attributes)
    expect(result).toBe(attributes)
  })

  it('should include class property when present', () => {
    const attributes = {
      id: 'test-id',
      class: 'test-class',
      'data-test': 'test-value'
    }

    const result = createAttributesObject(attributes)

    expect(result).toEqual({
      id: 'test-id',
      class: 'test-class',
      'data-test': 'test-value'
    })
    expect(result).toHaveProperty('class', 'test-class')
  })

  it('should handle object with only class property', () => {
    const attributes = {
      class: 'test-class'
    }

    const result = createAttributesObject(attributes)

    expect(result).toEqual({
      class: 'test-class'
    })
    expect(result).toHaveProperty('class', 'test-class')
  })

  it('should handle empty object', () => {
    const attributes = {}

    const result = createAttributesObject(attributes)

    expect(result).toEqual({})
  })

  it('should handle object with various data types', () => {
    const attributes = {
      id: 'test-id',
      class: 'test-class',
      count: 42,
      active: true,
      disabled: false
    }

    const result = createAttributesObject(attributes)

    expect(result).toEqual({
      id: 'test-id',
      class: 'test-class',
      count: 42,
      active: true,
      disabled: false
    })
    expect(result).toHaveProperty('class', 'test-class')
  })

  it('should handle object with class as first property', () => {
    const attributes = {
      class: 'test-class',
      id: 'test-id',
      'data-test': 'test-value'
    }

    const result = createAttributesObject(attributes)

    expect(result).toEqual({
      class: 'test-class',
      id: 'test-id',
      'data-test': 'test-value'
    })
    expect(result).toHaveProperty('class', 'test-class')
  })

  it('should handle object with class as last property', () => {
    const attributes = {
      id: 'test-id',
      'data-test': 'test-value',
      class: 'test-class'
    }

    const result = createAttributesObject(attributes)

    expect(result).toEqual({
      id: 'test-id',
      'data-test': 'test-value',
      class: 'test-class'
    })
    expect(result).toHaveProperty('class', 'test-class')
  })

  it('should preserve all properties including class when present', () => {
    const attributes = {
      id: 'test-id',
      class: 'test-class',
      'data-test': 'test-value',
      disabled: true,
      count: 42,
      'aria-label': 'test label'
    }

    const result = createAttributesObject(attributes)

    expect(result).toEqual({
      id: 'test-id',
      class: 'test-class',
      'data-test': 'test-value',
      disabled: true,
      count: 42,
      'aria-label': 'test label'
    })
    expect(result).toHaveProperty('class', 'test-class')
  })
})