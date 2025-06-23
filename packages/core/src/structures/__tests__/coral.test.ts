import { zCoralRootSchema, zCoralSchema } from '../coral'

describe('Coral Schemas', () => {
  describe('zCoralSchema', () => {
    it('should validate a basic coral node', () => {
      const validNode = {
        name: 'TestComponent',
        elementType: 'div',
        elementAttributes: {},
        children: [],
      }

      const result = zCoralSchema.safeParse(validNode)
      expect(result.success).toBe(true)
    })

    it('should validate coral node with all optional properties', () => {
      const completeNode = {
        name: 'CompleteComponent',
        elementType: 'div',
        description: 'A test component',
        figmaType: 'FRAME',
        elementAttributes: {
          id: 'test-id',
          'data-test': 'test-value',
        },
        figmaNodeRef: 'figma-node-ref',
        hasBackgroundImage: true,
        isComponentInstance: false,
        options: {
          variant: 'primary',
        },
        styles: {
          color: 'red',
          'background-color': 'blue',
        },
        textContent: 'Hello World',
        tsType: 'string',
        type: 'COMPONENT',
        variantProperties: {
          size: {
            type: 'string',
            value: 'large',
          },
        },
        children: [],
      }

      const result = zCoralSchema.safeParse(completeNode)
      expect(result.success).toBe(true)
    })

    it('should reject invalid element type', () => {
      const invalidNode = {
        name: 'TestComponent',
        elementType: 'invalid-element',
        elementAttributes: {},
        children: [],
      }

      const result = zCoralSchema.safeParse(invalidNode)
      expect(result.success).toBe(false)
    })

    it('should reject node without required name', () => {
      const invalidNode = {
        elementType: 'div',
        elementAttributes: {},
        children: [],
      }

      const result = zCoralSchema.safeParse(invalidNode)
      expect(result.success).toBe(false)
    })

    it('should reject node without required elementType', () => {
      const invalidNode = {
        name: 'TestComponent',
        elementAttributes: {},
        children: [],
      }

      const result = zCoralSchema.safeParse(invalidNode)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.elementType).toBe('div')
      }
    })
  })

  describe('zCoralRootSchema', () => {
    it('should validate a basic coral root node', () => {
      const validRootNode = {
        $schema: 'https://coral.design/schema.json',
        name: 'TestComponent',
        elementType: 'div',
        componentName: 'TestComponent',
        elementAttributes: {},
        children: [],
      }

      const result = zCoralRootSchema.safeParse(validRootNode)
      expect(result.success).toBe(true)
    })

    it('should validate coral root node with all optional properties', () => {
      const completeRootNode = {
        $schema: 'https://coral.design/schema.json',
        name: 'CompleteComponent',
        elementType: 'div',
        componentName: 'CompleteComponent',
        description: 'A test component',
        elementAttributes: {
          id: 'test-id',
          'data-test': 'test-value',
        },
        children: [],
        config: {
          theme: 'dark',
        },
        dependencies: [
          {
            name: 'react',
            version: '18.0.0',
            path: 'react',
          },
        ],
        designTokens: {
          primaryColor: {
            property: 'color',
            tokenName: 'primary',
            fallbackValue: '#007bff',
          },
        },
        imports: [
          {
            source: 'react',
            version: 'latest',
            specifiers: [
              {
                name: 'useState',
                isDefault: false,
                as: 'useState',
              },
            ],
          },
        ],
        isComponentSet: false,
        methods: [
          {
            name: 'handleClick',
            parameters: ['event'],
            body: 'console.log(event)',
            description: 'Handle click event',
          },
        ],
        stateHooks: [
          {
            name: 'count',
            setterName: 'setCount',
            initialValue: 0,
            tsType: 'number',
          },
        ],
        numberOfVariants: 3,
      }

      const result = zCoralRootSchema.safeParse(completeRootNode)
      expect(result.success).toBe(true)
    })

    it('should validate coral root node without schema', () => {
      const rootNodeWithoutSchema = {
        name: 'TestComponent',
        elementType: 'div',
        componentName: 'TestComponent',
        elementAttributes: {},
        children: [],
      }

      const result = zCoralRootSchema.safeParse(rootNodeWithoutSchema)
      expect(result.success).toBe(true)
    })

    it('should reject invalid schema URL', () => {
      const invalidRootNode = {
        $schema: 'https://invalid-schema.json',
        name: 'TestComponent',
        elementType: 'div',
        componentName: 'TestComponent',
        elementAttributes: {},
        children: [],
      }

      const result = zCoralRootSchema.safeParse(invalidRootNode)
      expect(result.success).toBe(false)
    })

    it('should validate component properties', () => {
      const rootNodeWithProps = {
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

      const result = zCoralRootSchema.safeParse(rootNodeWithProps)
      expect(result.success).toBe(true)
    })
  })
})
