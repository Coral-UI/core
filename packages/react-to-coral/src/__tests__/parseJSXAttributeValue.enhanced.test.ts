import { parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import { parseJSXAttributeValue } from '../parseJSXAttributeValue'

describe('parseJSXAttributeValue - Enhanced Expression Support', () => {
  const parseAttributeValue = (jsxCode: string) => {
    const ast = parse(`<div ${jsxCode} />`, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    })

    let attributeValue: unknown = null
    const result = { methods: [], stateHooks: [], componentProperties: [] }

    traverse(ast, {
      JSXAttribute(path: NodePath<t.JSXAttribute>) {
        attributeValue = parseJSXAttributeValue(path.node.value, result)
      },
    })

    return attributeValue
  }

  describe('Basic literals', () => {
    it('should handle string literals', () => {
      const result = parseAttributeValue('prop="test"')
      expect(result).toBe('test')
    })

    it('should handle numeric literals in expressions', () => {
      const result = parseAttributeValue('prop={42}')
      expect(result).toBe('42')
    })

    it('should handle boolean literals', () => {
      const result = parseAttributeValue('prop={true}')
      expect(result).toBe('true')
    })

    it('should handle null literal', () => {
      const result = parseAttributeValue('prop={null}')
      expect(result).toBe('null')
    })
  })

  describe('Template literals', () => {
    it('should handle template literals', () => {
      const result = parseAttributeValue('prop={`hello ${name}`}')
      expect(result).toContain('hello ${name}')
    })
  })

  describe('Array expressions', () => {
    it('should handle simple arrays', () => {
      const result = parseAttributeValue('prop={[1, 2, 3]}')
      expect(result).toBe('[1, 2, 3]')
    })

    it('should handle arrays with spread operator', () => {
      const result = parseAttributeValue('prop={[...items, newItem]}')
      expect(result).toContain('...items')
      expect(result).toContain('newItem')
    })

    it('should handle arrays with undefined elements', () => {
      const result = parseAttributeValue('prop={[1, , 3]}')
      expect(result).toContain('undefined')
    })
  })

  describe('Object expressions', () => {
    it('should handle simple objects', () => {
      const result = parseAttributeValue('prop={{name: "test", value: 42}}')
      expect(result).toContain('name: "test"')
      expect(result).toContain('value: 42')
    })

    it('should handle objects with spread operator', () => {
      const result = parseAttributeValue('prop={{...props, newProp: "value"}}')
      expect(result).toContain('...props')
      expect(result).toContain('newProp: "value"')
    })
  })

  describe('Function expressions', () => {
    it('should handle arrow functions', () => {
      const result = parseAttributeValue('onClick={() => console.log("clicked")}')
      expect(result).toContain('=>')
      expect(result).toContain('console.log')
    })

    it('should handle function expressions', () => {
      const result = parseAttributeValue('onClick={function() { return true; }}')
      expect(result).toContain('function')
      expect(result).toContain('return true')
    })
  })

  describe('Complex expressions', () => {
    it('should handle member expressions', () => {
      const result = parseAttributeValue('prop={user.name}')
      expect(result).toContain('user.name')
    })

    it('should handle computed member expressions', () => {
      const result = parseAttributeValue('prop={user["name"]}')
      expect(result).toContain('user["name"]')
    })

    it('should handle call expressions', () => {
      const result = parseAttributeValue('prop={getData()}')
      expect(result).toContain('getData()')
    })

    it('should handle logical expressions', () => {
      const result = parseAttributeValue('prop={isVisible && "shown"}')
      expect(result).toContain('isVisible && "shown"')
    })

    it('should handle binary expressions', () => {
      const result = parseAttributeValue('prop={count + 1}')
      expect(result).toContain('count + 1')
    })

    it('should handle unary expressions', () => {
      const result = parseAttributeValue('prop={!isHidden}')
      expect(result).toContain('!isHidden')
    })

    it('should handle conditional (ternary) expressions', () => {
      const result = parseAttributeValue('prop={isActive ? "active" : "inactive"}')
      expect(result).toContain('isActive ? "active" : "inactive"')
    })

    it('should handle assignment expressions', () => {
      const result = parseAttributeValue('onClick={() => counter = counter + 1}')
      expect(result).toContain('counter = counter + 1')
    })

    it('should handle update expressions', () => {
      const result = parseAttributeValue('onClick={() => counter++}')
      expect(result).toContain('counter++')
    })
  })

  describe('Edge cases', () => {
    // Note: Empty JSX expressions are not valid syntax in Babel parser

    it('should handle sequence expressions', () => {
      const result = parseAttributeValue('prop={(console.log("debug"), value)}')
      expect(result).toContain('console.log("debug"), value')
    })

    it('should handle nested complex expressions', () => {
      const result = parseAttributeValue('prop={items.filter(item => item.active).map(item => item.name)}')
      expect(result).toContain('filter')
      expect(result).toContain('map')
      expect(result).toContain('item.active')
    })
  })
})
