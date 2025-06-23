import { styleAttributeToObject } from '../styleAttributeToObject'

describe('styleAttributeToObject', () => {
  it('should convert basic CSS styles to object', () => {
    const style = 'color: red; background-color: blue; font-size: 16px'
    const result = styleAttributeToObject(style)

    expect(result).toEqual({
      color: 'red',
      'background-color': 'blue',
      'font-size': '16px'
    })
  })

  it('should handle styles with spaces around colons and semicolons', () => {
    const style = 'color : red ; background-color : blue ; font-size : 16px'
    const result = styleAttributeToObject(style)

    expect(result).toEqual({
      color: 'red',
      'background-color': 'blue',
      'font-size': '16px'
    })
  })

  it('should handle single style property', () => {
    const style = 'color: red'
    const result = styleAttributeToObject(style)

    expect(result).toEqual({
      color: 'red'
    })
  })

  it('should handle empty string', () => {
    const result = styleAttributeToObject('')
    expect(result).toEqual({})
  })

  it('should handle undefined input', () => {
    const result = styleAttributeToObject(undefined)
    expect(result).toEqual({})
  })

  it('should ignore malformed style properties', () => {
    const style = 'color: red; invalid-style; background-color: blue'
    const result = styleAttributeToObject(style)

    expect(result).toEqual({
      color: 'red',
      'background-color': 'blue'
    })
  })

  it('should handle styles with multiple colons in values', () => {
    const style = 'background: linear-gradient(to right, red, blue); color: white'
    const result = styleAttributeToObject(style)

    expect(result).toEqual({
      background: 'linear-gradient(to right, red, blue)',
      color: 'white'
    })
  })

  it('should handle styles with empty values', () => {
    const style = 'color: red; border: ; background-color: blue'
    const result = styleAttributeToObject(style)

    expect(result).toEqual({
      color: 'red',
      border: '',
      'background-color': 'blue'
    })
  })

  it('should handle styles with only property names', () => {
    const style = 'color: red; border; background-color: blue'
    const result = styleAttributeToObject(style)

    expect(result).toEqual({
      color: 'red',
      'background-color': 'blue'
    })
  })

  it('should handle complex CSS properties', () => {
    const style = 'box-shadow: 0 2px 4px rgba(0,0,0,0.1); transform: translateX(10px) rotate(45deg)'
    const result = styleAttributeToObject(style)

    expect(result).toEqual({
      'box-shadow': '0 2px 4px rgba(0,0,0,0.1)',
      transform: 'translateX(10px) rotate(45deg)'
    })
  })
})