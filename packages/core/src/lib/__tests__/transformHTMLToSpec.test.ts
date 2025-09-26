import { transformHTMLToSpec } from '../transformHTMLToSpec'

describe('transformHTMLToSpec', () => {
  it('should transform simple HTML to coral spec', () => {
    const html = '<div>Hello World</div>'
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('div')
    expect(result.textContent).toBe('Hello World')
    expect(result.children).toEqual([])
  })

  it('should transform HTML with attributes', () => {
    const html = '<div id="test" class="container" data-test="value">Content</div>'
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('div')
    expect(result.elementAttributes).toEqual({
      id: 'test',
      class: 'container',
      'data-test': 'value',
    })
    expect(result.textContent).toBe('Content')
  })

  it('should transform nested HTML structure', () => {
    const html = `<div class="container">
        <h1>Title</h1>
        <p>Paragraph text</p>
        <button>Click me</button>
      </div>
    `
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('div')
    expect(result.children).toHaveLength(3)
    expect(result.children?.[0]?.elementType).toBe('h1')
    expect(result.children?.[0]?.textContent).toBe('Title')
    expect(result.children?.[1]?.elementType).toBe('p')
    expect(result.children?.[1]?.textContent).toBe('Paragraph text')
    expect(result.children?.[2]?.elementType).toBe('button')
    expect(result.children?.[2]?.textContent).toBe('Click me')
  })

  it('should transform self-closing tags', () => {
    const html = '<img src="image.jpg" alt="Description" />'
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('img')
    expect(result.elementAttributes).toEqual({
      src: 'image.jpg',
      alt: 'Description',
    })
  })

  it('should transform form elements', () => {
    const html = `<form action="/submit" method="post">
        <input type="text" name="username" placeholder="Enter username" />
        <input type="password" name="password" />
        <button type="submit">Submit</button>
      </form>
    `
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('form')
    expect(result.elementAttributes).toEqual({
      action: '/submit',
      method: 'post',
    })
    expect(result.children).toHaveLength(3)
    expect(result.children?.[0]?.elementType).toBe('input')
    expect(result.children?.[0]?.elementAttributes).toEqual({
      type: 'text',
      name: 'username',
      placeholder: 'Enter username',
    })
  })

  it('should handle complex nested structure', () => {
    const html = `<section class="main-content">
        <header>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <article>
            <h2>Article Title</h2>
            <p>Article content here.</p>
          </article>
        </main>
      </section>
    `
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('section')
    expect(result.children).toHaveLength(2)

    // Check header structure
    expect(result.children?.[0]?.elementType).toBe('header')
    expect(result.children?.[0]?.children?.[0]?.elementType).toBe('nav')
    expect(result.children?.[0]?.children?.[0]?.children?.[0]?.elementType).toBe('ul')
    expect(result.children?.[0]?.children?.[0]?.children?.[0]?.children).toHaveLength(2)

    // Check main structure
    expect(result.children?.[1]?.elementType).toBe('main')
    expect(result.children?.[1]?.children?.[0]?.elementType).toBe('article')
  })

  it('should throw error for empty HTML', () => {
    const html = ''
    expect(() => transformHTMLToSpec(html)).toThrow('Empty HTML')
  })

  xit('should throw error for invalid HTML', () => {
    const html = '<invalid>'
    expect(() => transformHTMLToSpec(html)).toThrow('Invalid HTML')
  })

  it('should handle HTML with comments and whitespace', () => {
    const html = `
      <!-- This is a comment -->
      <div class="test">
        <!-- Another comment -->
        <span>Text</span>
        <!-- End comment -->
      </div>
    `
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('div')
    expect(result.elementAttributes).toEqual({
      class: 'test',
    })
    expect(result.children).toHaveLength(1)
    expect(result.children?.[0]?.elementType).toBe('span')
    expect(result.children?.[0]?.textContent).toBe('Text')
  })

  it('should handle HTML with mixed content', () => {
    const html = '<div>Text before <strong>bold</strong> text after</div>'
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('div')
    expect(result.textContent).toBe('Text before text after')
    expect(result.children).toHaveLength(1)
    expect(result.children?.[0]?.elementType).toBe('strong')
    expect(result.children?.[0]?.textContent).toBe('bold')
  })

  it('should capture class attributes in elementAttributes', () => {
    const html = '<section class="hero-section bg-blue-500">Content</section>'
    const result = transformHTMLToSpec(html)

    expect(result.elementType).toBe('section')
    expect(result.elementAttributes).toEqual({
      class: 'hero-section bg-blue-500',
    })
    expect(result.textContent).toBe('Content')
  })
})
