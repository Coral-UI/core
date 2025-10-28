import type Konva from 'konva'

import type { CoralNode, CoralStyleType } from '@reallygoodwork/coral-core'

export interface CanvasElement {
  id: string
  name: string
  elementType: string
  x: number
  y: number
  width: number
  height: number
  styles?: CoralStyleType
  textContent?: string
  children?: CanvasElement[]
}

// Helper to extract numeric value from dimension
const getDimensionValue = (value: any): number | null => {
  if (typeof value === 'number') return value
  if (typeof value === 'object' && value !== null && 'value' in value && 'unit' in value) {
    return value.value
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }
  return null
}

// Helper to get color string from color object
const getColorValue = (value: any): string | null => {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    if ('value' in value && typeof value.value === 'string') return value.value
    if ('hex' in value && typeof value.hex === 'string') return value.hex
  }
  return null
}

// Canvas for measuring text (reused across calls)
let measureCanvas: HTMLCanvasElement | null = null
let measureContext: CanvasRenderingContext2D | null = null

// Helper to accurately measure text dimensions
const measureTextDimensions = (
  text: string,
  fontSize: number,
  fontFamily: string = 'system-ui',
  fontWeight: string = 'normal',
  letterSpacing: number = 0
): { width: number; height: number } => {
  // Create canvas context for measurement if not exists
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas')
    measureContext = measureCanvas.getContext('2d')
  }

  if (!measureContext) {
    // Fallback to estimation if canvas not available
    const avgCharWidth = fontSize * 0.55
    return {
      width: Math.ceil(text.length * avgCharWidth + (text.length - 1) * letterSpacing),
      height: Math.ceil(fontSize * 1.2),
    }
  }

  // Set font to match what will be rendered
  measureContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`

  // Measure the actual text width
  const metrics = measureContext.measureText(text)
  let width = Math.ceil(metrics.width)

  // Add letter spacing (applied between characters, not after last one)
  if (letterSpacing !== 0 && text.length > 1) {
    width += (text.length - 1) * letterSpacing
  }

  // Height is roughly 1.2x font size (includes line height)
  const height = Math.ceil(fontSize * 1.2)

  return { width, height }
}

// Calculate absolute positions for elements
export const calculateLayout = (node: CoralNode, parentX = 0, parentY = 0, availableWidth = 1440): CanvasElement => {
  const styles = node.styles || {}

  // Map logical properties to physical properties (for LTR, horizontal text)
  // Inline = horizontal axis (left/right), Block = vertical axis (top/bottom)
  const paddingTop =
    getDimensionValue(styles['paddingTop']) ||
    getDimensionValue(styles['paddingBlockStart']) ||
    getDimensionValue(styles['padding']) ||
    0
  const paddingRight =
    getDimensionValue(styles['paddingRight']) ||
    getDimensionValue(styles['paddingInlineEnd']) ||
    getDimensionValue(styles['padding']) ||
    0
  const paddingBottom =
    getDimensionValue(styles['paddingBottom']) ||
    getDimensionValue(styles['paddingBlockEnd']) ||
    getDimensionValue(styles['padding']) ||
    0
  const paddingLeft =
    getDimensionValue(styles['paddingLeft']) ||
    getDimensionValue(styles['paddingInlineStart']) ||
    getDimensionValue(styles['padding']) ||
    0

  // Map logical margins to physical
  const marginTop =
    getDimensionValue(styles['marginTop']) ||
    getDimensionValue(styles['marginBlockStart']) ||
    getDimensionValue(styles['margin']) ||
    0
  const marginRight =
    getDimensionValue(styles['marginRight']) ||
    getDimensionValue(styles['marginInlineEnd']) ||
    getDimensionValue(styles['margin']) ||
    0
  const marginBottom =
    getDimensionValue(styles['marginBottom']) ||
    getDimensionValue(styles['marginBlockEnd']) ||
    getDimensionValue(styles['margin']) ||
    0
  const marginLeft =
    getDimensionValue(styles['marginLeft']) ||
    getDimensionValue(styles['marginInlineStart']) ||
    getDimensionValue(styles['margin']) ||
    0

  // Get display mode with element-specific defaults
  const getDefaultDisplay = (elementType: string): string => {
    // Inline elements
    if (['span', 'a', 'strong', 'em', 'code', 'text'].includes(elementType)) return 'inline'
    // Inline-block elements (form controls, buttons)
    if (['button', 'input', 'select', 'textarea', 'img'].includes(elementType)) return 'inline-block'
    // Block elements (default)
    return 'block'
  }

  const display = (styles['display'] as string) || getDefaultDisplay(node.elementType)
  const isInline = display === 'inline' || display === 'inline-block' || display === 'inline-flex'

  // Calculate intrinsic content size
  let contentWidth = 0
  let contentHeight = 0

  if (node.textContent && node.textContent.trim()) {
    const fontSize = getDimensionValue(styles['fontSize']) || 16
    const fontFamily = typeof styles['fontFamily'] === 'string' ? styles['fontFamily'] : 'sans-serif'
    const fontWeight = typeof styles['fontWeight'] === 'string' ? styles['fontWeight'] : 'normal'
    const letterSpacing = getDimensionValue(styles['letterSpacing']) || 0
    const textDims = measureTextDimensions(node.textContent, fontSize, fontFamily, fontWeight, letterSpacing)
    contentWidth = textDims.width
    contentHeight = textDims.height
  }

  // Calculate position
  const x = parentX + marginLeft
  const y = parentY + marginTop

  // Process children first to know their total size
  let children: CanvasElement[] = []
  let childrenWidth = 0
  let childrenHeight = 0

  if (node.children && Array.isArray(node.children)) {
    let currentY = y + paddingTop
    let currentX = x + paddingLeft
    const gap = getDimensionValue(styles['gap']) || 0

    if (display === 'flex' || display === 'inline-flex') {
      const flexDirection = (styles['flexDirection'] as string) || 'row'

      if (flexDirection === 'row') {
        // Horizontal layout
        children = node.children.map((child, idx) => {
          const childElement = calculateLayout(child, currentX, currentY, availableWidth - paddingLeft - paddingRight)
          currentX += childElement.width + (idx < node.children!.length - 1 ? gap : 0)
          childrenHeight = Math.max(childrenHeight, childElement.height)
          return childElement
        })
        childrenWidth = currentX - (x + paddingLeft) - (children.length > 0 ? gap : 0)
      } else {
        // Vertical layout
        children = node.children.map((child, idx) => {
          const childElement = calculateLayout(child, currentX, currentY, availableWidth - paddingLeft - paddingRight)
          currentY += childElement.height + (idx < node.children!.length - 1 ? gap : 0)
          childrenWidth = Math.max(childrenWidth, childElement.width)
          return childElement
        })
        childrenHeight = currentY - (y + paddingTop) - (children.length > 0 ? gap : 0)
      }
    } else {
      // Block layout (stack vertically)
      children = node.children.map((child, idx) => {
        const childElement = calculateLayout(child, currentX, currentY, availableWidth - paddingLeft - paddingRight)
        currentY += childElement.height + (idx < node.children!.length - 1 ? gap : 0)
        childrenWidth = Math.max(childrenWidth, childElement.width)
        return childElement
      })
      childrenHeight = currentY - (y + paddingTop) - (children.length > 0 ? gap : 0)
    }
  }

  // Determine final dimensions
  let finalWidth: number
  let finalHeight: number

  const explicitWidth = getDimensionValue(styles['width'])
  const explicitHeight = getDimensionValue(styles['height'])
  const minWidth = getDimensionValue(styles['minWidth']) || 0
  const minHeight = getDimensionValue(styles['minHeight']) || 0
  const maxWidth = getDimensionValue(styles['maxWidth']) || Infinity
  const maxHeight = getDimensionValue(styles['maxHeight']) || Infinity

  if (explicitWidth !== null) {
    finalWidth = explicitWidth
  } else if (isInline && contentWidth > 0) {
    // Inline elements shrink to content
    finalWidth = Math.max(
      contentWidth + paddingLeft + paddingRight,
      childrenWidth + paddingLeft + paddingRight,
      minWidth,
    )
  } else if (childrenWidth > 0) {
    // Has children, size to children
    finalWidth = Math.max(childrenWidth + paddingLeft + paddingRight, minWidth)
  } else if (contentWidth > 0) {
    // Has text content
    finalWidth = Math.max(contentWidth + paddingLeft + paddingRight, minWidth)
  } else {
    // Default size
    finalWidth = Math.max(100, minWidth)
  }

  if (explicitHeight !== null) {
    finalHeight = explicitHeight
  } else if (isInline && contentHeight > 0) {
    // Inline elements shrink to content
    finalHeight = Math.max(
      contentHeight + paddingTop + paddingBottom,
      childrenHeight + paddingTop + paddingBottom,
      minHeight,
    )
  } else if (childrenHeight > 0) {
    // Has children, size to children
    finalHeight = Math.max(childrenHeight + paddingTop + paddingBottom, minHeight)
  } else if (contentHeight > 0) {
    // Has text content
    finalHeight = Math.max(contentHeight + paddingTop + paddingBottom, minHeight)
  } else {
    // Default size
    finalHeight = Math.max(50, minHeight)
  }

  // Apply constraints
  finalWidth = Math.min(Math.max(finalWidth, minWidth), maxWidth)
  finalHeight = Math.min(Math.max(finalHeight, minHeight), maxHeight)

  const result: CanvasElement = {
    id: (node as any).id || `node-${Math.random().toString(36).substring(2, 9)}`,
    name: node.name,
    elementType: node.elementType,
    x,
    y,
    width: finalWidth,
    height: finalHeight,
    styles,
    children,
  }

  if (node.textContent) {
    result.textContent = node.textContent
  }

  return result
}

// Get Konva-compatible shape config from canvas element
export const getKonvaConfig = (element: CanvasElement) => {
  const styles = element.styles || {}

  const backgroundColor = getColorValue(styles['backgroundColor']) || 'transparent'
  const color = getColorValue(styles['color']) || '#000000'
  const borderColor = getColorValue(styles['borderColor']) || '#000000'
  const borderWidth = getDimensionValue(styles['borderWidth']) || 0
  const borderRadius = getDimensionValue(styles['borderRadius']) || 0
  const opacity = typeof styles['opacity'] === 'number' ? styles['opacity'] : 1

  // Extract padding for text (map logical properties to physical)
  const basePadding = getDimensionValue(styles['padding']) || 0
  const paddingTop = getDimensionValue(styles['paddingTop']) || getDimensionValue(styles['paddingBlockStart']) || basePadding
  const paddingRight = getDimensionValue(styles['paddingRight']) || getDimensionValue(styles['paddingInlineEnd']) || basePadding
  const paddingBottom = getDimensionValue(styles['paddingBottom']) || getDimensionValue(styles['paddingBlockEnd']) || basePadding
  const paddingLeft = getDimensionValue(styles['paddingLeft']) || getDimensionValue(styles['paddingInlineStart']) || basePadding

  const fontFamily = typeof styles['fontFamily'] === 'string' ? styles['fontFamily'] : 'sans-serif'
  const letterSpacing = getDimensionValue(styles['letterSpacing']) || 0

  // Debug font changes
  if (element.textContent && styles['fontFamily']) {
    console.log('🔤 Font config:', {
      elementType: element.elementType,
      text: element.textContent,
      rawFontFamily: styles['fontFamily'],
      resolvedFontFamily: fontFamily,
    })
  }

  return {
    // Position and size
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,

    // Background and border (for Rect)
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    opacity,

    // Padding (individual sides for proper rendering)
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    // Text styling (for Text)
    color,
    text: element.textContent || '',
    fontSize: getDimensionValue(styles['fontSize']) || 16,
    fontFamily,
    fontStyle: typeof styles['fontWeight'] === 'string' ? styles['fontWeight'] : 'normal',
    letterSpacing,
    align: typeof styles['textAlign'] === 'string' ? (styles['textAlign'] as 'left' | 'center' | 'right') : 'left',
    // Buttons and form controls should center text vertically by default
    verticalAlign: (['button', 'input', 'select'].includes(element.elementType) ? 'middle' : 'top') as 'top' | 'middle' | 'bottom',
  }
}
