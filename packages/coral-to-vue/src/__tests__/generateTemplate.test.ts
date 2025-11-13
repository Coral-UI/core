import type { CoralNode } from '@reallygoodwork/coral-core'

import { generateTemplateElement } from '../generateTemplate'

describe('generateTemplateElement', () => {
  it('should generate simple div element', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
    }

    const result = generateTemplateElement(node)
    expect(result).toBe('<div></div>')
  })

  it('should generate element with text content', () => {
    const node: CoralNode = {
      name: 'p',
      elementType: 'p',
      textContent: 'Hello, World!',
    }

    const result = generateTemplateElement(node)
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

    const result = generateTemplateElement(node)
    expect(result).toBe('<img src="test.jpg" alt="Test" />')
  })

  it('should use class instead of className', () => {
    const node: CoralNode = {
      name: 'div',
      elementType: 'div',
      elementAttributes: {
        class: 'container',
        id: 'main',
      },
    }

    const result = generateTemplateElement(node)
    expect(result).toContain('class="container"')
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

    const result = generateTemplateElement(node)
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

    const result = generateTemplateElement(node)
    expect(result).toContain('class="container main"')
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

    const result = generateTemplateElement(node)
    expect(result).toContain(':style=')
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

    const result = generateTemplateElement(node)
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

    const result = generateTemplateElement(node, 2)
    expect(result).toMatch(/^    <div>/)
  })
})
