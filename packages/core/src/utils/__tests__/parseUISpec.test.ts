import { parseUISpec } from '../parseUISpec'

describe('parseUISpec', () => {
  it('should parse a valid UI specification', async () => {
    const validSpec = {
      $schema: 'https://coral.design/schema.json',
      name: 'TestComponent',
      elementType: 'div',
      componentName: 'TestComponent',
      elementAttributes: {},
      children: [],
    }

    const result = await parseUISpec(validSpec)

    expect(result).toEqual(validSpec)
    expect(result.name).toBe('TestComponent')
    expect(result.elementType).toBe('div')
  })

  it('should parse a complex UI specification with children', async () => {
    const complexSpec = {
      $schema: 'https://coral.design/schema.json',
      name: 'ComplexComponent',
      elementType: 'div',
      componentName: 'ComplexComponent',
      elementAttributes: {
        id: 'test-id',
        'data-test': 'test-value',
      },
      children: [
        {
          name: 'ChildComponent',
          elementType: 'span',
          elementAttributes: {},
          children: [],
        },
      ],
      styles: {
        color: 'red',
        'background-color': 'blue',
      },
    }

    const result = await parseUISpec(complexSpec)

    expect(result.name).toBe('ComplexComponent')
    expect(result.elementType).toBe('div')
    expect(result.children).toHaveLength(1)
    expect(result.children?.[0]?.name).toBe('ChildComponent')
    expect(result.children?.[0]?.elementType).toBe('span')
  })

  it('should parse specification with component properties', async () => {
    const specWithProps = {
      $schema: 'https://coral.design/schema.json',
      name: 'ComponentWithProps',
      elementType: 'div',
      componentName: 'ComponentWithProps',
      elementAttributes: {},
      children: [],
      componentProperties: {
        title: {
          type: 'string',
          defaultValue: 'Default Title',
        },
        count: {
          type: 'number',
          defaultValue: 0,
        },
      },
    }

    const result = await parseUISpec(specWithProps)

    expect(result.componentProperties).toEqual(specWithProps.componentProperties)
  })

  it('should parse specification with state hooks', async () => {
    const specWithState = {
      $schema: 'https://coral.design/schema.json',
      name: 'ComponentWithState',
      elementType: 'div',
      componentName: 'ComponentWithState',
      elementAttributes: {},
      children: [],
      stateHooks: [
        {
          name: 'count',
          setterName: 'setCount',
          initialValue: 0,
          tsType: 'number',
        },
      ],
    }

    const result = await parseUISpec(specWithState)

    expect(result.stateHooks).toEqual(specWithState.stateHooks)
  })

  it('should parse specification with methods', async () => {
    const specWithMethods = {
      $schema: 'https://coral.design/schema.json',
      name: 'ComponentWithMethods',
      elementType: 'div',
      componentName: 'ComponentWithMethods',
      elementAttributes: {},
      children: [],
      methods: [
        {
          name: 'handleClick',
          parameters: ['event'],
          body: 'console.log(event)',
          description: 'Handle click event',
        },
      ],
    }

    const result = await parseUISpec(specWithMethods)

    expect(result.methods).toEqual(specWithMethods.methods)
  })

  it('should throw error for invalid specification', async () => {
    const invalidSpec = {
      name: 123, // Invalid: name should be a string
      elementType: 'invalid-element-type', // Invalid element type
      children: [],
    }

    await expect(parseUISpec(invalidSpec)).rejects.toThrow()
  })

  it('should throw error for invalid element type', async () => {
    const invalidSpec = {
      $schema: 'https://coral.design/schema.json',
      name: 'InvalidComponent',
      elementType: 'invalid-element-type', // Invalid element type
      componentName: 'InvalidComponent',
      elementAttributes: {},
      children: [],
    }

    await expect(parseUISpec(invalidSpec)).rejects.toThrow()
  })

  it('should handle specification without schema', async () => {
    const specWithoutSchema = {
      name: 'TestComponent',
      elementType: 'div',
      componentName: 'TestComponent',
      elementAttributes: {},
      children: [],
    }

    const result = await parseUISpec(specWithoutSchema)

    expect(result.name).toBe('TestComponent')
    expect(result.elementType).toBe('div')
  })

  it('should handle specification with variants', async () => {
    const specWithVariants = {
      $schema: 'https://coral.design/schema.json',
      name: 'ComponentWithVariants',
      elementType: 'div',
      componentName: 'ComponentWithVariants',
      elementAttributes: {},
      children: [],
      variants: [
        {
          name: 'primary',
          elementType: 'div',
          elementAttributes: {},
          children: [],
        },
      ],
    }

    const result = await parseUISpec(specWithVariants)

    expect(result.variants).toEqual(specWithVariants.variants)
  })
})
