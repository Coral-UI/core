import { createPropReference } from '../createPropReference'

describe('createPropReference', () => {
  it('should identify a method reference', () => {
    const result = {
      methods: [{ name: 'myMethod', parameters: [], body: '' }],
    }
    const propRef = createPropReference('myMethod', result)
    expect(propRef).toEqual({ type: 'method', value: 'myMethod' })
  })

  it('should identify a state hook reference', () => {
    const result = {
      stateHooks: [{ name: 'myState', setterName: 'setMyState', tsType: 'string' }],
    }
    const propRef = createPropReference('myState', result)
    expect(propRef).toEqual({ type: 'state', value: 'myState' })
  })

  it('should identify a component property reference', () => {
    const result = {
      componentProperties: [{ title: { type: 'string' } }],
    }
    const propRef = createPropReference('title', result)
    expect(propRef).toEqual({ type: 'prop', value: 'title' })
  })

  it('should default to a prop reference if not found', () => {
    const result = {
      methods: [],
      stateHooks: [],
      componentProperties: [],
    }
    const propRef = createPropReference('unknownProp', result)
    expect(propRef).toEqual({ type: 'prop', value: 'unknownProp' })
  })

  it('should handle empty result object', () => {
    const propRef = createPropReference('anyProp', {})
    expect(propRef).toEqual({ type: 'prop', value: 'anyProp' })
  })
})