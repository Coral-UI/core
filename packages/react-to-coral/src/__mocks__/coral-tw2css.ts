// Mock for @reallygoodwork/coral-tw2css
export const tailwindToCSS = jest.fn((className: string) => {
  // Return a simple mock implementation for testing
  if (className === 'container') {
    return {
      'max-width': '1200px',
      margin: '0 auto',
    }
  }
  if (className === 'flex') {
    return {
      display: 'flex',
    }
  }
  if (className === 'text-red-500') {
    return {
      color: '#ef4444',
    }
  }
  // Default fallback
  return {
    [className]: {
      color: 'inherit',
    },
  }
})
