import * as t from '@babel/types'

import { getTypeFromAnnotation } from '../getTypeFromAnnotation'

describe('getTypeFromAnnotation', () => {
  it('should return "string" for a TSStringKeyword', () => {
    const annotation = t.tsTypeAnnotation(t.tsStringKeyword())
    const result = getTypeFromAnnotation(annotation)
    expect(result).toBe('string')
  })

  it('should return "number" for a TSNumberKeyword', () => {
    const annotation = t.tsTypeAnnotation(t.tsNumberKeyword())
    const result = getTypeFromAnnotation(annotation)
    expect(result).toBe('number')
  })

  it('should return "boolean" for a TSBooleanKeyword', () => {
    const annotation = t.tsTypeAnnotation(t.tsBooleanKeyword())
    const result = getTypeFromAnnotation(annotation)
    expect(result).toBe('boolean')
  })

  it('should return "array" for a TSArrayType', () => {
    const annotation = t.tsTypeAnnotation(t.tsArrayType(t.tsStringKeyword()))
    const result = getTypeFromAnnotation(annotation)
    expect(result).toBe('array')
  })

  it('should return "function" for a TSFunctionType', () => {
    const annotation = t.tsTypeAnnotation(t.tsFunctionType(null, [t.identifier('param1')]))
    const result = getTypeFromAnnotation(annotation)
    expect(result).toBe('function')
  })

  it('should return the type name for a TSTypeReference', () => {
    const annotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier('MyType')))
    const result = getTypeFromAnnotation(annotation)
    expect(result).toBe('MyType')
  })

  it('should return "any" for an unknown type', () => {
    const annotation = t.tsTypeAnnotation(t.tsAnyKeyword())
    const result = getTypeFromAnnotation(annotation)
    expect(result).toBe('any')
  })

  it('should return "any" for a non-TS-type-annotation', () => {
    const annotation = t.typeAnnotation(t.anyTypeAnnotation())
    const result = getTypeFromAnnotation(annotation)
    expect(result).toBe('any')
  })
})
