import { CoralNode } from '@reallygoodwork/coral-core'

/**
 * Checks if a node is an SVG element
 */
export const isSVGElement = (node: CoralNode): boolean => {
  return node.elementType === 'svg'
}

/**
 * Checks if a node is an SVG shape element (circle, rect, path, etc.)
 */
export const isSVGShapeElement = (node: CoralNode): boolean => {
  const svgShapes = ['circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'path']
  return svgShapes.includes(node.elementType)
}

/**
 * Parses SVG fill attribute to RGB color
 */
const parseSVGFill = (fill: string | undefined, parentColor?: RGB): Paint[] => {
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
    if (match) {
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

/**
 * Creates a Figma ellipse node from SVG circle element
 */
const createCircleNode = (node: CoralNode, parentColor?: RGB): EllipseNode => {
  const attrs = node.elementAttributes || {}
  const cx = parseFloat(attrs['cx'] as string) || 0
  const cy = parseFloat(attrs['cy'] as string) || 0
  const r = parseFloat(attrs['r'] as string) || 0

  const ellipse = figma.createEllipse()
  ellipse.name = node.name

  // Set size (diameter = 2 * radius)
  ellipse.resize(r * 2, r * 2)

  // Set position (Figma positions are top-left corner, SVG circle uses center)
  ellipse.x = cx - r
  ellipse.y = cy - r

  // Apply fill color
  const fill = attrs['fill'] as string | undefined
  const fills = parseSVGFill(fill, parentColor)
  ellipse.fills = fills

  return ellipse
}

/**
 * Creates a Figma ellipse node from SVG ellipse element
 */
const createEllipseNode = (node: CoralNode, parentColor?: RGB): EllipseNode => {
  const attrs = node.elementAttributes || {}
  const cx = parseFloat(attrs['cx'] as string) || 0
  const cy = parseFloat(attrs['cy'] as string) || 0
  const rx = parseFloat(attrs['rx'] as string) || 0
  const ry = parseFloat(attrs['ry'] as string) || 0

  const ellipse = figma.createEllipse()
  ellipse.name = node.name

  // Set size
  ellipse.resize(rx * 2, ry * 2)

  // Set position
  ellipse.x = cx - rx
  ellipse.y = cy - ry

  // Apply fill color
  const fill = attrs['fill'] as string | undefined
  const fills = parseSVGFill(fill, parentColor)
  ellipse.fills = fills

  return ellipse
}

/**
 * Creates a Figma rectangle node from SVG rect element
 */
const createRectNode = (node: CoralNode, parentColor?: RGB): RectangleNode => {
  const attrs = node.elementAttributes || {}
  const x = parseFloat(attrs['x'] as string) || 0
  const y = parseFloat(attrs['y'] as string) || 0
  const width = parseFloat(attrs['width'] as string) || 0
  const height = parseFloat(attrs['height'] as string) || 0

  const rect = figma.createRectangle()
  rect.name = node.name

  // Set size and position
  rect.resize(width, height)
  rect.x = x
  rect.y = y

  // Apply fill color
  const fill = attrs['fill'] as string | undefined
  const fills = parseSVGFill(fill, parentColor)
  rect.fills = fills

  return rect
}

/**
 * Creates a Figma line node from SVG line element
 */
const createLineNode = (node: CoralNode, parentColor?: RGB): LineNode => {
  const attrs = node.elementAttributes || {}
  const x1 = parseFloat(attrs['x1'] as string) || 0
  const y1 = parseFloat(attrs['y1'] as string) || 0
  const x2 = parseFloat(attrs['x2'] as string) || 0
  const y2 = parseFloat(attrs['y2'] as string) || 0

  const line = figma.createLine()
  line.name = node.name

  // Set line endpoints
  line.resize(Math.abs(x2 - x1), 0)
  line.x = Math.min(x1, x2)
  line.y = y1

  // Rotate if needed for vertical/diagonal lines
  if (y2 !== y1) {
    const angle = Math.atan2(y2 - y1, x2 - x1)
    line.rotation = (angle * 180) / Math.PI
  }

  // Apply stroke color
  const stroke = attrs['stroke'] as string | undefined
  const strokeFills = parseSVGFill(stroke, parentColor)
  line.strokes = strokeFills

  const strokeWidth = parseFloat(attrs['stroke-width'] as string) || 1
  line.strokeWeight = strokeWidth

  return line
}

/**
 * Creates a Figma shape node from an SVG shape element
 */
export const createShapeFromSVG = (
  node: CoralNode,
  parentColor?: RGB,
): SceneNode | null => {
  try {
    switch (node.elementType) {
      case 'circle':
        return createCircleNode(node, parentColor)
      case 'ellipse':
        return createEllipseNode(node, parentColor)
      case 'rect':
        return createRectNode(node, parentColor)
      case 'line':
        return createLineNode(node, parentColor)
      case 'path':
      case 'polygon':
      case 'polyline':
        // These require vector path conversion - skip for now
        console.warn(`SVG ${node.elementType} not yet supported, skipping`)
        return null
      default:
        return null
    }
  } catch (error) {
    console.error(`Error creating ${node.elementType}:`, error)
    return null
  }
}

/**
 * Creates a frame to wrap SVG content (acts as the SVG container)
 */
export const createSVGFrame = async (node: CoralNode, parentColor?: RGB): Promise<FrameNode> => {
  const frame = figma.createFrame()
  frame.name = node.name

  // Get viewBox dimensions if present
  const attrs = node.elementAttributes || {}
  const viewBox = attrs['viewBox'] as string | undefined

  let width = parseFloat(node.styles?.['width'] as string) || 100
  let height = parseFloat(node.styles?.['height'] as string) || 100

  if (viewBox) {
    const parts = viewBox.split(' ')
    if (parts.length === 4) {
      width = parseFloat(parts[2])
      height = parseFloat(parts[3])
    }
  }

  // Set frame size
  frame.resize(width, height)

  // Remove background fill (transparent)
  frame.fills = []

  // Process children (SVG shapes)
  if (node.children) {
    for (const child of node.children) {
      if (isSVGShapeElement(child)) {
        const shape = createShapeFromSVG(child, parentColor)
        if (shape) {
          frame.appendChild(shape)
        }
      }
    }
  }

  return frame
}
