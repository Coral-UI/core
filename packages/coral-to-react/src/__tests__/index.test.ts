import type { CoralRootNode } from '@reallygoodwork/coral-core'

import { coralToReact } from '../index'

describe('coralToReact', () => {
  it('should convert a simple coral node to React component', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      children: [
        {
          name: 'p',
          elementType: 'p',
          textContent: 'Hello, World!',
        },
      ],
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain("import React from 'react'")
    expect(result).toContain('export function div')
    expect(result).toContain('<div>')
    expect(result).toContain('<p>')
    expect(result).toContain('Hello, World!')
    expect(result).toContain('</p>')
    expect(result).toContain('</div>')
  })

  it('should handle component with custom name', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      textContent: 'Click me',
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('export function Button')
    expect(result).toContain('<button>')
    expect(result).toContain('Click me')
    expect(result).toContain('</button>')
  })

  it('should handle self-closing tags', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      children: [
        {
          name: 'img',
          elementType: 'img',
          elementAttributes: {
            src: 'test.jpg',
            alt: 'Test',
          },
        },
        {
          name: 'br',
          elementType: 'br',
        },
      ],
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('<img src="test.jpg" alt="Test" />')
    expect(result).toContain('<br />')
  })

  it('should generate props interface when componentProperties exist', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      componentProperties: {
        label: {
          type: 'string',
          optional: false,
        },
        onClick: {
          type: 'function',
          optional: true,
        },
      },
      textContent: 'Click',
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('interface ButtonProps')
    expect(result).toContain('label: string')
    expect(result).toContain('onClick?: function')
    expect(result).toContain('export function Button(props: ButtonProps)')
  })

  it('should generate state hooks', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Counter',
      componentName: 'Counter',
      elementType: 'div',
      stateHooks: [
        {
          name: 'count',
          setterName: 'setCount',
          tsType: 'number',
          initialValue: 0,
        },
      ],
      textContent: 'Count: 0',
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('const [count, setCount] = useState<number>(0)')
  })

  it('should generate methods', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      methods: [
        {
          name: 'handleClick',
          body: 'console.log("clicked")',
          parameters: [],
        },
      ],
      textContent: 'Click',
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('function handleClick()')
    expect(result).toContain('console.log("clicked")')
  })

  it('should handle inline styles', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      styles: {
        fontSize: 16,
        padding: { value: 20, unit: 'px' },
        color: {
          hex: '#333',
          rgb: { r: 51, g: 51, b: 51, a: 1 },
          hsl: { h: 0, s: 0, l: 20, a: 1 },
        },
      },
      textContent: 'Styled',
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('style={{')
    expect(result).toContain('fontSize: 16')
    expect(result).toContain("padding: '20px'")
    expect(result).toContain("color: '#333'")
  })

  it('should handle element attributes', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      elementAttributes: {
        id: 'main',
        class: 'container',
        'data-testid': 'test',
      },
      textContent: 'Content',
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('id="main"')
    expect(result).toContain('className="container"')
    expect(result).toContain('data-testid="test"')
  })

  it('should handle nested children', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      children: [
        {
          name: 'section',
          elementType: 'section',
          children: [
            {
              name: 'h1',
              elementType: 'h1',
              textContent: 'Title',
            },
            {
              name: 'p',
              elementType: 'p',
              textContent: 'Content',
            },
          ],
        },
      ],
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('<section>')
    expect(result).toContain('<h1>')
    expect(result).toContain('Title')
    expect(result).toContain('</h1>')
    expect(result).toContain('<p>')
    expect(result).toContain('Content')
    expect(result).toContain('</p>')
    expect(result).toContain('</section>')
  })

  it('should generate arrow function component when specified', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      textContent: 'Click',
    }

    const result = await coralToReact(coralSpec, { componentFormat: 'arrow' })
    expect(result).toContain('export const Button = () => {')
    expect(result).not.toContain('export function Button')
  })

  it('should handle imports', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      imports: [
        {
          source: 'react',
          specifiers: [{ name: 'useState', isDefault: false }],
        },
        {
          source: './utils',
          specifiers: [
            { name: 'helper', isDefault: true },
            { name: 'util', isDefault: false },
          ],
        },
      ],
      textContent: 'Click',
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain("import React from 'react'")
    expect(result).toContain("import { useState } from 'react'")
    expect(result).toContain("import helper, { util } from './utils'")
  })

  it('should handle component without props', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Simple',
      componentName: 'Simple',
      elementType: 'div',
      textContent: 'Simple component',
    }

    const result = await coralToReact(coralSpec)
    expect(result).toContain('export function Simple() {')
  })

  it('should format code with Prettier when enabled', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      textContent: 'Click',
    }

    const result = await coralToReact(coralSpec, { prettier: true })
    // Prettier should format the code properly
    expect(result).toMatch(/\n/)
    // Check that it's properly formatted (no extra spaces, proper indentation)
    expect(result).toContain("import React from 'react'")
    expect(result).toContain('export function Button()')
  })
})
