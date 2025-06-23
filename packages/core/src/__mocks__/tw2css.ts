// Mock for @reallygoodwork/coral-tw2css
export const tailwindToCSS = jest.fn((className: string) => {
  // Return a simple mock implementation
  return {
    [className]: {
      color: 'red',
      'background-color': 'blue'
    }
  }
})