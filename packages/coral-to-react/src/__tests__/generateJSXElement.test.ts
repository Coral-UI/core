import type { CoralNode } from '@reallygoodwork/coral-core'

import { generateJSXElement } from '../generateJSXElement'

describe('generateJSXElement', () => {
  it('should generate simple div element', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
    }

    const result = generateJSXElement(node)
    expect(result).toBe('<div></div>')
  })

  it('should generate element with text content', () => {
    const node: CoralNode = {
      name: 'p',
      elementType: 'p',
      textContent: 'Hello, World!',
    }

    const result = generateJSXElement(node)
    expect(result).toContain('<p>')
    expect(result).toContain('Hello, World!')
    expect(result).toContain('</p>')
  })

  it('should generate self-closing element', () => {
    const node: CoralNode = {
      name: 'img',
      elementType: 'img',
      elementAttributes: {
        src: 'test.jpg',
        alt: 'Test',
      },
    }

    const result = generateJSXElement(node)
    expect(result).toBe('<img src="test.jpg" alt="Test" />')
  })

  it('should convert class to className', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
      elementAttributes: {
        class: 'container',
        id: 'main',
      },
    }

    const result = generateJSXElement(node)
    expect(result).toContain('className="container"')
    expect(result).toContain('id="main"')
  })

  it('should handle boolean attributes', () => {
    const node: CoralNode = {
      name: 'input',
      elementType: 'input',
      elementAttributes: {
        disabled: true,
        required: false,
      },
    }

    const result = generateJSXElement(node)
    expect(result).toContain('disabled')
    expect(result).not.toContain('required')
  })

  it('should handle array attributes', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
      elementAttributes: {
        class: ['container', 'main'],
      },
    }

    const result = generateJSXElement(node)
    expect(result).toContain('className="container main"')
  })

  it('should handle non-class array attributes', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
      elementAttributes: {
        'data-items': ['item1', 'item2'],
      },
    }

    const result = generateJSXElement(node)
    expect(result).toContain("data-items={['item1', 'item2']}")
  })

  it('should handle inline styles', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
      styles: {
        fontSize: 16,
        color: {
          hex: '#333',
          rgb: { r: 51, g: 51, b: 51, a: 1 },
          hsl: { h: 0, s: 0, l: 20, a: 1 },
        },
      },
    }

    const result = generateJSXElement(node)
    expect(result).toContain('style={{')
    expect(result).toContain('fontSize: 16')
  })

  it('should handle nested children', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
      children: [
        {
          name: 'p',
          elementType: 'p',
          textContent: 'Child 1',
        },
        {
          name: 'p',
          elementType: 'p',
          textContent: 'Child 2',
        },
      ],
    }

    const result = generateJSXElement(node)
    expect(result).toContain('<div>')
    expect(result).toContain('<p>')
    expect(result).toContain('Child 1')
    expect(result).toContain('Child 2')
    expect(result).toContain('</p>')
    expect(result).toContain('</div>')
  })

  it('should handle indentation', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
      children: [
        {
          name: 'p',
          elementType: 'p',
          textContent: 'Child',
        },
      ],
    }

    const result = generateJSXElement(node, 2)
    expect(result).toMatch(/^    <div>/)
  })
})
