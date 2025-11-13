import { CoralNode, CoralStyleType } from '@reallygoodwork/coral-core'

/**
 * Merge padding and margin styles from wrapper node to its text child
 * This handles the case where Figma adds wrapper frames around text elements
 * for padding/margin handling
 */
/**
 * Map cardinal direction properties to logical properties
 * Figma returns padding-top, padding-bottom, etc., but we need logical properties
 */
const mapCardinalToLogical = (
  wrapperStyles: Record<string, unknown>,
  propertyType: 'padding' | 'margin',
): Record<string, unknown> => {
  const logicalStyles: Record<string, unknown> = {}

  // Map cardinal directions to logical properties (LTR writing mode)
  const mappings = [
    { cardinal: `${propertyType}Top`, logical: `${propertyType}BlockStart` },
    { cardinal: `${propertyType}Bottom`, logical: `${propertyType}BlockEnd` },
    { cardinal: `${propertyType}Left`, logical: `${propertyType}InlineStart` },
    { cardinal: `${propertyType}Right`, logical: `${propertyType}InlineEnd` },
  ]

  for (const { cardinal, logical } of mappings) {
    if (wrapperStyles[cardinal] !== undefined) {
      logicalStyles[logical] = wrapperStyles[cardinal]
    }
  }

  return logicalStyles
}

export const mergeWrapperStyles = (wrapperNode: CoralNode, childNode: CoralNode): void => {
  if (!wrapperNode.styles) {
    console.warn(`Wrapper node "${wrapperNode.name}" has no styles to merge`)
    return
  }

  // Initialize child styles if needed
  if (!childNode.styles) {
    childNode.styles = {}
  }

  let mergedCount = 0

  // First, handle logical properties (already in the correct format)
  const logicalProperties = [
    'paddingBlockStart',
    'paddingBlockEnd',
    'paddingInlineStart',
    'paddingInlineEnd',
    'marginBlockStart',
    'marginBlockEnd',
    'marginInlineStart',
    'marginInlineEnd',
  ]

  for (const prop of logicalProperties) {
    if (wrapperNode.styles[prop] !== undefined) {
      childNode.styles[prop] = wrapperNode.styles[prop]
      delete wrapperNode.styles[prop]
      mergedCount++
    }
  }

  // Handle cardinal direction properties from Figma (padding-top, padding-bottom, etc.)
  // Convert them to logical properties
  const paddingCardinal = mapCardinalToLogical(wrapperNode.styles, 'padding')
  const marginCardinal = mapCardinalToLogical(wrapperNode.styles, 'margin')

  // Merge converted cardinal properties
  for (const [logicalProp, value] of Object.entries({ ...paddingCardinal, ...marginCardinal })) {
    if (value !== undefined) {
      childNode.styles[logicalProp] = value
      mergedCount++
    }
  }

  // Remove cardinal properties from wrapper
  const cardinalProperties = [
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
  ]

  for (const prop of cardinalProperties) {
    if (wrapperNode.styles[prop] !== undefined) {
      delete wrapperNode.styles[prop]
    }
  }

  // Handle shorthand padding/margin (these should already be converted to logical by parseSpacingShorthand)
  const shorthandProperties = ['padding', 'margin']
  for (const prop of shorthandProperties) {
    if (wrapperNode.styles[prop] !== undefined) {
      // If shorthand still exists, it means it wasn't converted - copy as-is for now
      childNode.styles[prop] = wrapperNode.styles[prop]
      delete wrapperNode.styles[prop]
      mergedCount++
    }
  }

  if (mergedCount === 0) {
    console.warn(
      `No padding/margin styles found on wrapper "${wrapperNode.name}" to merge into child "${childNode.name}"`,
    )
  } else {
    console.log(
      `Merged ${mergedCount} spacing properties from wrapper "${wrapperNode.name}" to child "${childNode.name}"`,
    )
  }
}
