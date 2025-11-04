import { CoralNode } from '@reallygoodwork/coral-core'

import { isCoralColor } from '../../types'
import { parseSVGFill } from './parseSVGFill'

/**
 * Normalizes SVG path data to ensure proper spacing between commands and numbers
 * Figma's vectorPaths API requires properly formatted path data
 *
 * Note: Figma supports a limited set of SVG path commands:
 * - M, L, Q, C, Z (and their lowercase equivalents, but uppercase is preferred)
 * - Arc commands (A/a) are NOT supported by Figma
 *
 * Handles cases like:
 * - "M16.704" -> "M 16.704" (separates command from number)
 * - "4.153a" -> "4.153 A" (separates number from command, converts to uppercase)
 * - "M10,20" -> "M 10 20" (replaces commas with spaces)
 * - ".75.75" -> ".75 .75" (separates concatenated decimal numbers)
 */
function normalizePathData(pathData: string): string {
  if (!pathData || pathData.trim().length === 0) {
    return pathData
  }

  let normalized = pathData.trim()

  // Step 1: Replace commas with spaces (Figma prefers space-separated)
  normalized = normalized.replace(/,/g, ' ')

  // Step 2: Convert lowercase commands to uppercase (Figma prefers uppercase)
  // This also helps identify commands for later processing
  normalized = normalized.replace(/([m])/g, 'M') // move to
  normalized = normalized.replace(/([l])/g, 'L') // line to
  normalized = normalized.replace(/([h])/g, 'H') // horizontal line to
  normalized = normalized.replace(/([v])/g, 'V') // vertical line to
  normalized = normalized.replace(/([c])/g, 'C') // cubic bezier to
  normalized = normalized.replace(/([s])/g, 'S') // smooth cubic bezier to
  normalized = normalized.replace(/([q])/g, 'Q') // quadratic bezier to
  normalized = normalized.replace(/([t])/g, 'T') // smooth quadratic bezier to
  normalized = normalized.replace(/([z])/g, 'Z') // close path
  // Note: Arc (A/a) is not supported by Figma - we'll handle this separately

  // Step 3: Separate command letters from numbers that follow them
  // Add space after command if followed by a non-space character
  normalized = normalized.replace(/([MLLHVCQSTZ])([^\s])/g, '$1 $2')

  // Step 4: Separate numbers from command letters that follow them
  // Pattern: number/decimal followed by command letter (e.g., "4.153A" -> "4.153 A")
  // Match: digit(s) or decimal number ending with digit, followed immediately by command
  // This handles: "4.153A", "16L", ".75Q", etc.
  normalized = normalized.replace(/(\d+\.?\d*|\.\d+)([MLLHVCQSTAZ])/g, '$1 $2')

  // Step 5: Handle concatenated decimal numbers (e.g., ".75.75" -> ".75 .75")
  // Pattern: decimal number ending in digit, followed by decimal point and digits
  // This matches cases like ".75.75" where two decimal numbers are concatenated
  normalized = normalized.replace(/(\.\d+)(\.\d+)/g, '$1 $2')

  // Step 6: Handle numbers with multiple decimal points (e.g., "1.127.075" -> "1.127 .075")
  // This happens when two numbers are concatenated: one with decimal, one starting with decimal
  // Pattern: number with one decimal point, followed by another decimal point and digits
  normalized = normalized.replace(/(\d+\.\d+)(\.\d+)/g, '$1 $2')

  // Step 7: Separate numbers from negative numbers that follow them
  // Pattern: number (with optional decimal) followed immediately by minus sign and another number
  // Examples: "1-1.127" -> "1 -1.127", "-4.5-4.5" -> "-4.5 -4.5", "1.06-1.06" -> "1.06 -1.06"
  // Match: number pattern (whole, decimal, or starting with decimal) followed by minus and number
  normalized = normalized.replace(/(\d+\.?\d*|\.\d+)-(\d+\.?\d*|\.\d+)/g, '$1 -$2')

  // Step 8: Handle negative numbers - ensure minus signs are properly attached (no space before minus)
  // Pattern: space followed by minus followed by digit -> remove the space before minus
  normalized = normalized.replace(/\s+-(\d)/g, ' -$1')

  // Step 9: Normalize all whitespace (multiple spaces/tabs/newlines to single space)
  normalized = normalized.replace(/\s+/g, ' ')

  // Step 10: Trim and return
  return normalized.trim()
}

/**
 * Checks if path contains unsupported commands (arcs A/a)
 * Figma does not support arc commands in vectorPaths
 */
function hasUnsupportedCommands(pathData: string): boolean {
  // Check for arc commands (both uppercase and lowercase)
  // Match: A or a followed by optional space and then digits/decimals
  // This catches both "A 1 2" and "4.153a.75" patterns
  return /[Aa](?:\s|[\d.])/.test(pathData)
}

/**
 * Creates a Figma VectorNode from an SVG path element
 */
export const createPathNode = (node: CoralNode, parentColor?: RGB): VectorNode | null => {
  const attrs = node.elementAttributes || {}
  const d = attrs['d'] as string | undefined

  if (!d) {
    console.warn('Path element missing "d" attribute')
    return null
  }

  try {
    const vector = figma.createVector()
    vector.name = node.name || 'path'

    // Parse fill first to ensure we have valid colors
    const fillAttr = attrs['fill'] as string | undefined
    const fillRule = (attrs['fill-rule'] || attrs['fillRule']) as string | undefined
    // Get color from node styles or parent color
    const colorValue = node.styles?.['color']
    let effectiveParentColor = parentColor
    if (!effectiveParentColor && colorValue && isCoralColor(colorValue)) {
      const hex = colorValue.hex.replace('#', '')
      effectiveParentColor = {
        r: parseInt(hex.substring(0, 2), 16) / 255,
        g: parseInt(hex.substring(2, 4), 16) / 255,
        b: parseInt(hex.substring(4, 6), 16) / 255,
      }
    }
    const fills = parseSVGFill(fillAttr, effectiveParentColor)

    // Set the SVG path data
    try {
      // Check for unsupported commands (arcs) before processing
      if (hasUnsupportedCommands(d)) {
        console.warn('Path contains arc commands (A/a) which are not supported by Figma. Skipping path creation.')
        // Return null to skip this path element
        return null
      }

      const windingRule = fillRule === 'evenodd' ? 'EVENODD' : 'NONZERO'
      // Normalize path data to ensure proper formatting for Figma
      const normalizedPathData = normalizePathData(d)
      console.log('Original path data:', d)
      console.log('Normalized path data:', normalizedPathData)
      vector.vectorPaths = [
        {
          windingRule: windingRule as 'NONZERO' | 'EVENODD',
          data: normalizedPathData,
        },
      ]
    } catch (pathError) {
      console.error('Invalid SVG path data:', {
        original: d,
        error: pathError,
        nodeName: node.name || 'path',
      })
      console.warn('Creating placeholder rectangle due to invalid path data')
      // Create a small placeholder rectangle if path data is invalid
      const rect = figma.createRectangle()
      rect.name = node.name || 'path'
      rect.resize(20, 20)
      if (fills) rect.fills = fills
      return rect as unknown as VectorNode
    }

    // Apply fill color
    if (fills) {
      vector.fills = fills
    }

    // Handle stroke
    const strokeAttr = attrs['stroke'] as string | undefined
    if (strokeAttr && strokeAttr !== 'none') {
      const strokeWidth = parseFloat((attrs['stroke-width'] || attrs['strokeWidth'] || '1') as string)
      vector.strokeWeight = strokeWidth
      const strokeFills = parseSVGFill(strokeAttr, effectiveParentColor)
      vector.strokes = strokeFills.length > 0 ? strokeFills : [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    }

    return vector
  } catch (error) {
    console.error('Error creating path node:', error)
    // Return null to skip this path element rather than blocking entire creation
    return null
  }
}
