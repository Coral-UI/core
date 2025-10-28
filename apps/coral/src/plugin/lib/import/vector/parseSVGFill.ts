/**
 * Parses SVG fill attribute to RGB color
 */
export const parseSVGFill = (fill: string | undefined, parentColor?: RGB): Paint[] => {
  if (!fill || fill === 'none') {
    return []
  }

  // Handle currentColor - use parent color if available
  if (fill === 'currentColor') {
    if (parentColor) {
      return [
        {
          type: 'SOLID',
          color: parentColor,
        },
      ]
    }
    // Default to black if no parent color
    return [
      {
        type: 'SOLID',
        color: { r: 0, g: 0, b: 0 },
      },
    ]
  }

  // Handle hex colors
  if (fill.startsWith('#')) {
    const hex = fill.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    return [
      {
        type: 'SOLID',
        color: { r, g, b },
      },
    ]
  }

  // Handle rgb/rgba
  if (fill.startsWith('rgb')) {
    const match = fill.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match && match[1] && match[2] && match[3]) {
      return [
        {
          type: 'SOLID',
          color: {
            r: parseInt(match[1]) / 255,
            g: parseInt(match[2]) / 255,
            b: parseInt(match[3]) / 255,
          },
        },
      ]
    }
  }

  // Default to black
  return [
    {
      type: 'SOLID',
      color: { r: 0, g: 0, b: 0 },
    },
  ]
}
