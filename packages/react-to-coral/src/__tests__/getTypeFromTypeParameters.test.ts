import { getTypeFromTypeParameters } from '../getTypeFromTypeParameters'
import * as t from '@babel/types'

describe('getTypeFromTypeParameters', () => {
  it('should return the name of the first type parameter', () => {
    const typeParams = t.tsTypeParameterInstantiation([
      t.tsTypeReference(t.identifier('MyType')),
      t.tsNumberKeyword(),
    ])
    const result = getTypeFromTypeParameters(typeParams)
    expect(result).toBe('MyType')
  })

  it('should return "any" if the first parameter is not a type reference', () => {
    const typeParams = t.tsTypeParameterInstantiation([t.tsNumberKeyword()])
    const result = getTypeFromTypeParameters(typeParams)
    expect(result).toBe('any')
  })

  it('should return "any" if there are no type parameters', () => {
    const typeParams = t.tsTypeParameterInstantiation([])
    const result = getTypeFromTypeParameters(typeParams)
    expect(result).toBe('any')
  })
})