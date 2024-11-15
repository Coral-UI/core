export type StyleObject = {
  [key: string]: string | number | ColorObject | StyleObject
}

export type ColorObject = {
  hex?: string
  rgb?: {
    r: number
    g: number
    b: number
    a: number
  }
  hsl?: {
    h: number
    s: number
    l: number
    a: number
  }
}

const styles = {
  backgroundColor: {
    hex: '#fafafa',
    rgb: {
      r: 250,
      g: 250,
      b: 250,
      a: 1,
    },
    hsl: {
      h: 0,
      s: 0,
      l: 98,
      a: 1,
    },
  },
  paddingBlockStart: 96,
  paddingBlockEnd: 96,
  sm: {
    paddingBlockStart: 128,
    paddingBlockEnd: 128,
  },
}

export const styleToTailwind = (style: StyleObject): string => {
  let tailwindClasses = ''

  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'object' && value !== null) {
      // Recursive call for nested objects
      const nestedClasses = styleToTailwind(value as StyleObject)
      tailwindClasses += nestedClasses ? ` ${nestedClasses}` : ''
    } else {
      // Convert the key-value pair to a Tailwind class
      const tailwindClass = convertToTailwindClass(key, value)
      tailwindClasses += tailwindClass ? ` ${tailwindClass}` : ''
    }
  }

  return tailwindClasses.trim()
}

// Helper function to convert a key-value pair to a Tailwind class
function convertToTailwindClass(key: string, value: string | number): string {
  // This is a placeholder. You'll need to implement the actual conversion logic here.
  return `${key}-${value}`
}

styleToTailwind(styles)
