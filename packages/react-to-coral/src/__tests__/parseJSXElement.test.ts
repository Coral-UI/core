import { parse } from '@babel/parser'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import type { Result } from '../transformReactComponentToSpec'
import { parseJSXElement } from '../parseJSXElement'

const createMockResult = (): Result => ({
  imports: [],
  methods: [],
  stateHooks: [],
  componentProperties: [],
})

const parseJSXFromString = (jsx: string): t.JSXElement => {
  const ast = parse(`const component = () => ${jsx}`, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  let jsxElement: t.JSXElement | null = null
  traverse(ast, {
    JSXElement(path: NodePath<t.JSXElement>) {
      if (!jsxElement) {
        jsxElement = path.node
      }
    },
  })

  if (!jsxElement) {
    throw new Error('No JSX element found')
  }

  return jsxElement
}

describe('parseJSXElement', () => {
  it('should parse a simple HTML element', () => {
    const jsx = '<div>Hello World</div>'
    const jsxElement = parseJSXFromString(jsx)
    const result = createMockResult()

    const parsed = parseJSXElement(jsxElement, result)

    expect(parsed.elementType).toBe('div')
    expect(parsed.isComponent).toBe(false)
    expect(parsed.textContent).toBe('Hello World')
    expect(parsed.children).toHaveLength(0)
  })

  it('should parse an element with attributes', () => {
    const jsx = '<div className="container" id="main">Content</div>'
    const jsxElement = parseJSXFromString(jsx)
    const result = createMockResult()

    const parsed = parseJSXElement(jsxElement, result)

    expect(parsed.elementType).toBe('div')
    expect(parsed.componentProperties).toHaveProperty('className', 'container')
    expect(parsed.componentProperties).toHaveProperty('id', 'main')
    expect(parsed.textContent).toBe('Content')
  })

  it('should identify React components', () => {
    const jsx = '<MyComponent prop="value" />'
    const jsxElement = parseJSXFromString(jsx)
    const result = createMockResult()

    const parsed = parseJSXElement(jsxElement, result)

    expect(parsed.elementType).toBe('MyComponent')
    expect(parsed.isComponent).toBe(true)
    expect(parsed.componentProperties).toHaveProperty('prop', 'value')
  })

  it('should parse nested elements', () => {
    const jsx = `
      <div>
        <h1>Title</h1>
        <p>Paragraph</p>
      </div>
    `
    const jsxElement = parseJSXFromString(jsx)
    const result = createMockResult()

    const parsed = parseJSXElement(jsxElement, result)

    expect(parsed.elementType).toBe('div')
    expect(parsed.children).toHaveLength(2)
    expect(parsed.children[0]?.elementType).toBe('h1')
    expect(parsed.children[0]?.textContent).toBe('Title')
    expect(parsed.children[1]?.elementType).toBe('p')
    expect(parsed.children[1]?.textContent).toBe('Paragraph')
  })

  it('should handle self-closing elements', () => {
    const jsx = '<img src="test.jpg" alt="Test" />'
    const jsxElement = parseJSXFromString(jsx)
    const result = createMockResult()

    const parsed = parseJSXElement(jsxElement, result)

    expect(parsed.elementType).toBe('img')
    expect(parsed.isComponent).toBe(false)
    expect(parsed.componentProperties).toHaveProperty('src', 'test.jpg')
    expect(parsed.componentProperties).toHaveProperty('alt', 'Test')
    expect(parsed.textContent).toBeUndefined()
    expect(parsed.children).toHaveLength(0)
  })

  it('should handle elements without text content', () => {
    const jsx = '<div></div>'
    const jsxElement = parseJSXFromString(jsx)
    const result = createMockResult()

    const parsed = parseJSXElement(jsxElement, result)

    expect(parsed.elementType).toBe('div')
    expect(parsed.textContent).toBeUndefined()
    expect(parsed.children).toHaveLength(0)
  })

  it('should trim whitespace from text content', () => {
    const jsx = '<div>   Hello World   </div>'
    const jsxElement = parseJSXFromString(jsx)
    const result = createMockResult()

    const parsed = parseJSXElement(jsxElement, result)

    expect(parsed.textContent).toBe('Hello World')
  })
})
