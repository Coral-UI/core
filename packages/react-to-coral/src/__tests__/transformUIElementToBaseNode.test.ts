import { transformUIElementToBaseNode } from '../transformUIElementToBaseNode'
import type { UIElement } from '../transformReactComponentToSpec'

describe('transformUIElementToBaseNode', () => {
  it('should transform a simple HTML element', () => {
    const element: UIElement = {
      elementType: 'div',
      isComponent: false,
      componentProperties: {
        className: 'container'
      },
      children: []
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.elementType).toBe('div')
    expect(result.name).toBe('div')
    expect(result.elementAttributes?.class).toBe('container')
    expect(result.children).toEqual([])
  })

  it('should handle elements with multiple attributes', () => {
    const element: UIElement = {
      elementType: 'img',
      isComponent: false,
      componentProperties: {
        src: 'test.jpg',
        alt: 'Test image',
        width: 100,
        height: 200,
        loading: 'lazy'
      },
      children: []
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.elementType).toBe('img')
    expect(result.elementAttributes?.src).toBe('test.jpg')
    expect(result.elementAttributes?.alt).toBe('Test image')
    expect(result.elementAttributes?.width).toBe(100)
    expect(result.elementAttributes?.height).toBe(200)
    expect(result.elementAttributes?.loading).toBe('lazy')
  })

  it('should handle elements with children', () => {
    const element: UIElement = {
      elementType: 'div',
      isComponent: false,
      componentProperties: {},
      children: [
        {
          elementType: 'h1',
          isComponent: false,
          componentProperties: {},
          children: [],
          textContent: 'Title'
        },
        {
          elementType: 'p',
          isComponent: false,
          componentProperties: {},
          children: [],
          textContent: 'Paragraph'
        }
      ]
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.children).toHaveLength(2)
    expect(result.children?.[0]?.elementType).toBe('h1')
    expect(result.children?.[0]?.textContent).toBe('Title')
    expect(result.children?.[1]?.elementType).toBe('p')
    expect(result.children?.[1]?.textContent).toBe('Paragraph')
  })

  it('should handle text content', () => {
    const element: UIElement = {
      elementType: 'p',
      isComponent: false,
      componentProperties: {},
      children: [],
      textContent: 'Hello, World!'
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.textContent).toBe('Hello, World!')
  })

  it('should apply Tailwind CSS styles from className', () => {
    const element: UIElement = {
      elementType: 'div',
      isComponent: false,
      componentProperties: {
        className: 'container'
      },
      children: []
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.styles).toBeDefined()
    // The mock should return styles for 'container'
    expect(result.styles?.['max-width']).toBe('1200px')
    expect(result.styles?.['margin']).toBe('0 auto')
  })

  it('should merge custom styles with Tailwind styles', () => {
    const element: UIElement = {
      elementType: 'div',
      isComponent: false,
      componentProperties: {
        className: 'flex',
        styles: {
          padding: '16px',
          'border-radius': '8px'
        }
      },
      children: []
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.styles).toBeDefined()
    // Should have both custom styles and Tailwind styles
    expect(result.styles?.['padding']).toBe('16px')
    expect(result.styles?.['border-radius']).toBe('8px')
    expect(result.styles?.['display']).toBe('flex') // From Tailwind mock
  })

  it('should handle boolean attributes', () => {
    const element: UIElement = {
      elementType: 'input',
      isComponent: false,
      componentProperties: {
        type: 'checkbox',
        checked: true,
        disabled: false,
        required: true
      },
      children: []
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.elementAttributes?.type).toBe('checkbox')
    expect(result.elementAttributes?.checked).toBe(true)
    expect(result.elementAttributes?.disabled).toBe(false)
    expect(result.elementAttributes?.required).toBe(true)
  })

  it('should handle array attributes', () => {
    const element: UIElement = {
      elementType: 'select',
      isComponent: false,
      componentProperties: {
        'data-options': ['option1', 'option2', 'option3']
      },
      children: []
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.elementAttributes?.['data-options']).toEqual(['option1', 'option2', 'option3'])
  })

  it('should filter out invalid attribute types', () => {
    const element: UIElement = {
      elementType: 'div',
      isComponent: false,
      componentProperties: {
        validString: 'test',
        validNumber: 42,
        validBoolean: true,
        validArray: ['a', 'b'],
        invalidObject: { nested: 'object' },
        invalidFunction: () => 'test'
      },
      children: []
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.elementAttributes?.validString).toBe('test')
    expect(result.elementAttributes?.validNumber).toBe(42)
    expect(result.elementAttributes?.validBoolean).toBe(true)
    expect(result.elementAttributes?.validArray).toEqual(['a', 'b'])
    expect(result.elementAttributes?.invalidObject).toBeUndefined()
    expect(result.elementAttributes?.invalidFunction).toBeUndefined()
  })

  it('should handle nested elements with complex structures', () => {
    const element: UIElement = {
      elementType: 'article',
      isComponent: false,
      componentProperties: {
        className: 'article-container'
      },
      children: [
        {
          elementType: 'header',
          isComponent: false,
          componentProperties: {},
          children: [
            {
              elementType: 'h1',
              isComponent: false,
              componentProperties: { className: 'title' },
              children: [],
              textContent: 'Article Title'
            }
          ]
        },
        {
          elementType: 'section',
          isComponent: false,
          componentProperties: { className: 'content' },
          children: [
            {
              elementType: 'p',
              isComponent: false,
              componentProperties: {},
              children: [],
              textContent: 'Article content goes here.'
            }
          ]
        }
      ]
    }

    const result = transformUIElementToBaseNode(element)

    expect(result.elementType).toBe('article')
    expect(result.children).toHaveLength(2)

    const header = result.children?.[0]
    expect(header?.elementType).toBe('header')
    expect(header?.children).toHaveLength(1)
    expect(header?.children?.[0]?.elementType).toBe('h1')
    expect(header?.children?.[0]?.textContent).toBe('Article Title')

    const section = result.children?.[1]
    expect(section?.elementType).toBe('section')
    expect(section?.children).toHaveLength(1)
    expect(section?.children?.[0]?.elementType).toBe('p')
    expect(section?.children?.[0]?.textContent).toBe('Article content goes here.')
  })
})