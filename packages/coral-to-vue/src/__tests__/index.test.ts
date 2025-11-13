import type { CoralRootNode } from '@reallygoodwork/coral-core'

import { coralToVue } from '../index'

describe('coralToVue', () => {
  it('should convert a simple coral node to Vue component', async () => {
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

    const result = await coralToVue(coralSpec)
    expect(result).toContain('<script setup lang="ts">')
    expect(result).toContain('<template>')
    expect(result).toContain('<div>')
    expect(result).toContain('<p>')
    expect(result).toContain('Hello, World!')
    expect(result).toContain('</p>')
    expect(result).toContain('</div>')
    expect(result).toContain('</template>')
  })

  it('should handle component with custom name', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      textContent: 'Click me',
    }

    const result = await coralToVue(coralSpec)
    expect(result).toContain('<script setup lang="ts">')
    expect(result).toContain('<template>')
    expect(result).toContain('<button>')
    expect(result).toContain('Click me')
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

    const result = await coralToVue(coralSpec)
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

    const result = await coralToVue(coralSpec)
    expect(result).toContain('interface ButtonProps')
    expect(result).toContain('label: string')
    expect(result).toContain('onClick?: function')
    expect(result).toContain('const props = defineProps<ButtonProps>()')
  })

  it('should generate state declarations', async () => {
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

    const result = await coralToVue(coralSpec)
    expect(result).toContain("import { ref } from 'vue'")
    expect(result).toContain('const count = ref<number>(0)')
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

    const result = await coralToVue(coralSpec)
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

    const result = await coralToVue(coralSpec)
    expect(result).toContain(':style=')
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

    const result = await coralToVue(coralSpec)
    expect(result).toContain('id="main"')
    expect(result).toContain('class="container"')
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

    const result = await coralToVue(coralSpec)
    expect(result).toContain('<section>')
    expect(result).toContain('<h1>')
    expect(result).toContain('Title')
    expect(result).toContain('</h1>')
    expect(result).toContain('<p>')
    expect(result).toContain('Content')
    expect(result).toContain('</p>')
    expect(result).toContain('</section>')
  })

  it('should handle imports', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      imports: [
        {
          source: 'vue',
          specifiers: [{ name: 'computed', isDefault: false }],
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

    const result = await coralToVue(coralSpec)
    expect(result).toContain("import { computed } from 'vue'")
    expect(result).toContain("import helper, { util } from './utils'")
  })

  it('should handle component without props', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Simple',
      componentName: 'Simple',
      elementType: 'div',
      textContent: 'Simple component',
    }

    const result = await coralToVue(coralSpec)
    expect(result).toContain('<script setup lang="ts">')
    expect(result).toContain('<template>')
  })

  it('should format code with Prettier when enabled', async () => {
    const coralSpec: CoralRootNode = {
      name: 'Button',
      componentName: 'Button',
      elementType: 'button',
      textContent: 'Click',
    }

    const result = await coralToVue(coralSpec, { prettier: true })
    // Prettier should format the code properly
    expect(result).toMatch(/\n/)
    // Check that it's properly formatted
    expect(result).toContain('<script setup lang="ts">')
    expect(result).toContain('<template>')
  })
})
