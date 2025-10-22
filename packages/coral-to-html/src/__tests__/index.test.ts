import type { CoralRootNode } from '@reallygoodwork/coral-core'

import { coralToHTML } from '../index'

describe('coralToHTML', () => {
  it('should convert a simple coral node to HTML', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      elementAttributes: {
        class: 'container',
      },
      children: [
        {
          name: 'p',
          elementType: 'p',
          textContent: 'Hello, World!',
        },
      ],
    }

    const result = await coralToHTML(coralSpec)
    expect(result).toContain('<div class="container">')
    expect(result).toContain('<p>Hello, World!</p>')
    expect(result).toContain('</div>')
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

    const result = await coralToHTML(coralSpec)
    expect(result).toContain('<img src="test.jpg" alt="Test" />')
    expect(result).toContain('<br />')
  })

  it('should handle nodes without attributes', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      children: [
        {
          name: 'p',
          elementType: 'p',
          textContent: 'Plain text',
        },
      ],
    }

    const result = await coralToHTML(coralSpec)
    expect(result).toContain('<div>')
    expect(result).toContain('<p>Plain text</p>')
  })

  it('should handle nested elements', async () => {
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

    const result = await coralToHTML(coralSpec)
    expect(result).toContain('<section>')
    expect(result).toContain('<h1>Title</h1>')
    expect(result).toContain('<p>Content</p>')
    expect(result).toContain('</section>')
  })

  it('should format the output using prettier', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      children: [
        {
          name: 'p',
          elementType: 'p',
          textContent: 'Test',
        },
      ],
    }

    const result = await coralToHTML(coralSpec)
    // Prettier should format the HTML properly
    expect(result).toMatch(/\n/)
    expect(result.trim()).toMatch(/<div>\s*<p>Test<\/p>\s*<\/div>/)
  })

  it('should handle styles with dimension objects', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      styles: {
        fontSize: { value: 1.5, unit: 'rem' },
        padding: 16,
        margin: { value: 2, unit: 'em' },
        width: { value: 100, unit: '%' },
      },
      children: [],
    }

    const result = await coralToHTML(coralSpec)
    expect(result).toContain('style=')
    expect(result).toContain('font-size: 1.5rem')
    expect(result).toContain('padding: 16px')
    expect(result).toContain('margin: 2em')
    expect(result).toContain('width: 100%')
  })

  it('should handle styles with plain numbers', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      styles: {
        fontSize: 16,
        padding: 20,
      },
      textContent: 'Styled text',
    }

    const result = await coralToHTML(coralSpec)
    expect(result).toContain('style=')
    expect(result).toContain('font-size: 16px')
    expect(result).toContain('padding: 20px')
  })

  it('should handle mixed styles and attributes', async () => {
    const coralSpec: CoralRootNode = {
      name: 'div',
      elementType: 'div',
      elementAttributes: {
        class: 'container',
        id: 'main',
      },
      styles: {
        fontSize: { value: 1.25, unit: 'rem' },
        color: '#333',
      },
      textContent: 'Content',
    }

    const result = await coralToHTML(coralSpec)
    expect(result).toContain('class="container"')
    expect(result).toContain('id="main"')
    expect(result).toContain('style=')
    expect(result).toContain('font-size: 1.25rem')
    expect(result).toContain('color: #333')
  })
})
