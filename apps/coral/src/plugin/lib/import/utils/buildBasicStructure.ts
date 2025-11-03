import { CoralColorType, CoralNode, CoralRootNode, CoralStyleType, ResponsiveStyle } from '@reallygoodwork/coral-core'

import { isCoralColor } from '../../types'
import { createSVGFrame } from '../vector/createSVGFrame'
import { applyResponsiveStyles } from './applyResponsiveStyles'
import { convertNameToElementType } from './convertNameToElementType'
import { AutoLayoutRequirement, collectFontsAndStyles } from './prepareStructure'

/**
 * Build a basic Figma structure from a Coral spec
 * This creates frames and text nodes without applying fonts, colors, or complex styles
 * Focuses on getting the structure right first
 */
export async function buildBasicStructure(
  spec: CoralRootNode,
): Promise<{ component: ComponentSetNode | ComponentNode; analysis: ReturnType<typeof collectFontsAndStyles> }> {
  // Analyze the spec first
  const analysis = collectFontsAndStyles(spec)

  // Load fonts that are needed
  await loadRequiredFonts(analysis.fontsToLoad)

  // Check if we need responsive variants
  const hasResponsiveVariants = analysis.responsiveVariants.length > 0

  if (hasResponsiveVariants) {
    // Create component set with variants for each breakpoint
    const componentSet = await createComponentSetWithVariants(spec, analysis)
    return { component: componentSet, analysis }
  } else {
    // Create single component with 480px minimum width
    const component = await createBasicComponent(spec, analysis, undefined, 480)
    return { component, analysis }
  }
}

/**
 * Load fonts needed by the spec
 */
async function loadRequiredFonts(fontsToLoad: string[]): Promise<void> {
  await Promise.all(
    fontsToLoad.map(async (fontKey) => {
      const [fontFamily, fontStyle] = fontKey.split(':')
      if (!fontFamily || !fontStyle) {
        return
      }
      try {
        await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
      } catch (_error) {
        // Fallback to Inter Regular if font fails to load
        await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
        figma.notify(`Failed to load font: ${fontKey}. Falling back to Inter Regular.`, { error: true })
      }
    }),
  )
}

/**
 * Extract minimum width from breakpoint (mobile-first approach)
 */
function getBreakpointWidth(breakpoint: ResponsiveStyle['breakpoint']): number {
  // For simple breakpoints like { type: 'min-width', value: '768px' }
  if ('type' in breakpoint && breakpoint.type === 'min-width' && breakpoint.value) {
    const value = breakpoint.value.toString().replace('px', '')
    return parseInt(value, 10)
  }

  // For range breakpoints, use the min value
  if ('min' in breakpoint && breakpoint.min) {
    const value = breakpoint.min.value.toString().replace('px', '')
    return parseInt(value, 10)
  }

  return 480 // Default mobile width
}

/**
 * Create a component set with variants for responsive breakpoints
 */
async function createComponentSetWithVariants(
  spec: CoralRootNode,
  analysis: ReturnType<typeof collectFontsAndStyles>,
): Promise<ComponentSetNode> {
  const variants: ComponentNode[] = []

  // Base variant should be 480px minimum (mobile-first)
  const baseComponent = await createBasicComponent(spec, analysis, 'base', 480)
  baseComponent.name = `${spec.name}=base`
  baseComponent.x = 0
  baseComponent.y = 0
  variants.push(baseComponent)

  // Create variant for each responsive breakpoint with appropriate width
  let currentX = baseComponent.width + 24
  for (const variant of analysis.responsiveVariants) {
    const minWidth = getBreakpointWidth(variant.breakpoint)
    // Apply responsive styles for this breakpoint (mobile-first)
    const specWithResponsiveStyles = applyResponsiveStyles(spec, variant.breakpoint)
    // Re-analyze the spec with responsive styles applied
    const variantAnalysis = collectFontsAndStyles(specWithResponsiveStyles)
    const variantComponent = await createBasicComponent(specWithResponsiveStyles, variantAnalysis, variant.name, minWidth)
    variantComponent.name = `${spec.name}=${variant.name}`
    variantComponent.x = currentX
    variantComponent.y = 0
    currentX += variantComponent.width + 24
    variants.push(variantComponent)
  }

  // Combine into component set
  const componentSet = figma.combineAsVariants(variants, figma.currentPage)
  componentSet.name = spec.name

  return componentSet
}

/**
 * Create a basic component from the spec
 */
async function createBasicComponent(
  spec: CoralRootNode,
  analysis: ReturnType<typeof collectFontsAndStyles>,
  variantName?: string,
  minWidth?: number,
): Promise<ComponentNode> {
  // Build the node tree
  const rootNode = await buildNode(spec, analysis.autoLayoutNodes)

  // Set minimum width if provided
  if (minWidth && 'resize' in rootNode) {
    const currentHeight = rootNode.height
    // Only resize if current width is less than minimum
    if (rootNode.width < minWidth) {
      rootNode.resize(minWidth, currentHeight)
    }
  }

  // Convert to component
  const component = figma.createComponentFromNode(rootNode)
  component.name = variantName ? `${spec.name}=${variantName}` : spec.name

  // Apply minimum width to component as well
  if (minWidth) {
    const currentHeight = component.height
    if (component.width < minWidth) {
      component.resize(minWidth, currentHeight)
    }
  }

  return component
}

/**
 * Check if a node has margin (needs wrapper to handle margin spacing)
 */
function hasMargin(node: CoralNode | CoralRootNode): boolean {
  if (!node.styles) return false

  const marginProps = ['marginBlockStart', 'marginBlockEnd', 'marginInlineStart', 'marginInlineEnd']

  return marginProps.some((prop) => {
    const value = node.styles![prop]
    // Ignore "auto" margins (used for centering) and undefined
    return value !== undefined && value !== 'auto'
  })
}

/**
 * Check if a node needs a wrapper frame (has margin or padding)
 */
function needsWrapperFrame(node: CoralNode | CoralRootNode): boolean {
  if (!node.styles) return false

  const spacingProps = [
    'marginBlockStart',
    'marginBlockEnd',
    'marginInlineStart',
    'marginInlineEnd',
    'paddingBlockStart',
    'paddingBlockEnd',
    'paddingInlineStart',
    'paddingInlineEnd',
  ]

  return spacingProps.some((prop) => {
    const value = node.styles![prop]
    // Ignore "auto" margins (used for centering)
    return value !== undefined && value !== 'auto'
  })
}

/**
 * Convert Coral color to Figma RGB
 */
function convertColor(color: CoralColorType): RGB {
  if (!color) return { r: 0, g: 0, b: 0 }

  // Color can be { hex, rgb, hsl }
  if (color.rgb) {
    return {
      r: color.rgb.r / 255,
      g: color.rgb.g / 255,
      b: color.rgb.b / 255,
    }
  }

  // Fallback: parse hex
  if (color.hex) {
    const hex = color.hex.replace('#', '')
    return {
      r: parseInt(hex.substring(0, 2), 16) / 255,
      g: parseInt(hex.substring(2, 4), 16) / 255,
      b: parseInt(hex.substring(4, 6), 16) / 255,
    }
  }

  return { r: 0, g: 0, b: 0 }
}

/**
 * Get opacity from color object
 */
function getOpacity(color: CoralColorType): number {
  if (!color) return 1
  if (color.rgb?.a !== undefined) return color.rgb.a
  if (color.hsl?.a !== undefined) return color.hsl.a
  return 1
}

/**
 * Extract numeric value from a style property (handles numbers and strings like "10px")
 */
function extractNumberValue(value: CoralStyleType[keyof CoralStyleType] | undefined): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace('px', ''))
    return isNaN(parsed) ? undefined : parsed
  }
  if (typeof value === 'object' && 'value' in value) {
    return extractNumberValue(value.value)
  }
  return undefined
}

/**
 * Extract spacing values from styles
 */
function extractSpacingValues(node: CoralNode | CoralRootNode) {
  const styles = node.styles || {}
  return {
    marginTop: extractNumberValue(styles['marginBlockStart']) || 0,
    marginBottom: extractNumberValue(styles['marginBlockEnd']) || 0,
    marginLeft: extractNumberValue(styles['marginInlineStart']) || 0,
    marginRight: extractNumberValue(styles['marginInlineEnd']) || 0,
    paddingTop: extractNumberValue(styles['paddingBlockStart']) || 0,
    paddingBottom: extractNumberValue(styles['paddingBlockEnd']) || 0,
    paddingLeft: extractNumberValue(styles['paddingInlineStart']) || 0,
    paddingRight: extractNumberValue(styles['paddingInlineEnd']) || 0,
  }
}

/**
 * Create a text node wrapped in a frame with margin/padding
 */
async function createTextNodeWithWrapper(
  node: CoralNode | CoralRootNode,
  textAlign?: string,
  mergedStyles?: Record<string, any>,
): Promise<FrameNode> {
  const spacing = extractSpacingValues(node)
  const hasMargin =
    spacing.marginTop > 0 || spacing.marginBottom > 0 || spacing.marginLeft > 0 || spacing.marginRight > 0
  const hasPadding =
    spacing.paddingTop > 0 || spacing.paddingBottom > 0 || spacing.paddingLeft > 0 || spacing.paddingRight > 0

  // If both margin and padding exist, create nested structure:
  // Outer wrapper (margin) -> Inner wrapper (padding + background + border) -> Text
  if (hasMargin && hasPadding) {
    // Create outer margin wrapper (no background)
    const marginWrapper = figma.createFrame()
    marginWrapper.name = `${convertNameToElementType(node.elementType || node.type)}-margin-wrapper`
    marginWrapper.layoutMode = 'VERTICAL'
    marginWrapper.layoutSizingVertical = 'HUG'
    marginWrapper.primaryAxisSizingMode = 'AUTO'
    marginWrapper.fills = [] // No background on margin wrapper
    marginWrapper.setPluginData('shouldFillHorizontal', 'true')

    // Apply margin as padding on outer wrapper
    marginWrapper.paddingTop = spacing.marginTop
    marginWrapper.paddingBottom = spacing.marginBottom
    marginWrapper.paddingLeft = spacing.marginLeft
    marginWrapper.paddingRight = spacing.marginRight

    // Create inner padding wrapper (with background, border, etc.)
    const paddingWrapper = figma.createFrame()
    paddingWrapper.name = `${node.name || node.elementType || node.type}-padding-wrapper`
    paddingWrapper.layoutMode = 'VERTICAL'
    paddingWrapper.layoutSizingVertical = 'HUG'
    // DON'T set layoutSizingHorizontal yet - will be set after appending to marginWrapper
    paddingWrapper.primaryAxisSizingMode = 'AUTO'

    // Apply background color to padding wrapper
    const backgroundColor = node.styles?.['backgroundColor']
    if (backgroundColor && isCoralColor(backgroundColor)) {
      paddingWrapper.fills = [
        {
          type: 'SOLID',
          color: convertColor(backgroundColor),
          opacity: getOpacity(backgroundColor),
        },
      ]
    } else {
      paddingWrapper.fills = []
    }

    // Apply border radius to padding wrapper
    const borderRadius = node.styles?.['borderRadius']
    if (borderRadius !== undefined) {
      const radiusValue = extractNumberValue(borderRadius)
      if (radiusValue !== undefined) {
        paddingWrapper.cornerRadius = radiusValue
      }
    }

    // Apply border (stroke) to padding wrapper
    const borderWidth = node.styles?.['borderWidth']
    const borderColor = node.styles?.['borderColor']
    const borderStyle = node.styles?.['borderStyle']
    if (borderWidth && borderColor && isCoralColor(borderColor)) {
      const strokeWeight = extractNumberValue(borderWidth)
      if (strokeWeight !== undefined && strokeWeight > 0) {
        paddingWrapper.strokeWeight = strokeWeight
        paddingWrapper.strokes = [
          {
            type: 'SOLID',
            color: convertColor(borderColor),
            opacity: getOpacity(borderColor),
          },
        ]
        if (borderStyle === 'dashed') {
          paddingWrapper.dashPattern = [strokeWeight * 3, strokeWeight * 2]
        } else if (borderStyle === 'dotted') {
          paddingWrapper.dashPattern = [strokeWeight, strokeWeight]
        }
      }
    }

    // Apply padding to padding wrapper
    paddingWrapper.paddingTop = spacing.paddingTop
    paddingWrapper.paddingBottom = spacing.paddingBottom
    paddingWrapper.paddingLeft = spacing.paddingLeft
    paddingWrapper.paddingRight = spacing.paddingRight

    // Apply text alignment to padding wrapper
    if (textAlign === 'center') {
      paddingWrapper.counterAxisAlignItems = 'CENTER'
      paddingWrapper.primaryAxisAlignItems = 'CENTER'
    } else if (textAlign === 'right') {
      paddingWrapper.counterAxisAlignItems = 'MAX'
      paddingWrapper.primaryAxisAlignItems = 'MAX'
    } else {
      paddingWrapper.counterAxisAlignItems = 'MIN'
      paddingWrapper.primaryAxisAlignItems = 'MIN'
    }

    // Create text node
    const textNode = await createSimpleTextNode(node, textAlign, mergedStyles)
    paddingWrapper.appendChild(textNode)
    textNode.layoutSizingHorizontal = 'FILL'

    // Assemble: marginWrapper contains paddingWrapper
    marginWrapper.appendChild(paddingWrapper)

    // NOW set FILL sizing on paddingWrapper (safe because it's in auto layout)
    paddingWrapper.layoutSizingHorizontal = 'FILL'

    return marginWrapper
  }

  // If only margin OR only padding (or combined for simple cases), use single wrapper
  const wrapper = figma.createFrame()
  wrapper.name = `${convertNameToElementType(node.elementType || node.type)}-wrapper`
  wrapper.layoutMode = 'VERTICAL'
  wrapper.layoutSizingVertical = 'HUG'
  wrapper.primaryAxisSizingMode = 'AUTO'
  wrapper.setPluginData('shouldFillHorizontal', 'true')

  // Apply non-text styles to wrapper (backgroundColor, borderRadius, etc.)
  const backgroundColor = node.styles?.['backgroundColor']
  if (backgroundColor && isCoralColor(backgroundColor)) {
    const rgb = convertColor(backgroundColor)
    const opacity = getOpacity(backgroundColor)
    wrapper.fills = [
      {
        type: 'SOLID',
        color: rgb,
        opacity: opacity,
      },
    ]
  } else {
    wrapper.fills = [] // No background
  }

  // Apply border radius if present
  const borderRadius = node.styles?.['borderRadius']
  if (borderRadius !== undefined) {
    const radiusValue = extractNumberValue(borderRadius)
    if (radiusValue !== undefined) {
      wrapper.cornerRadius = radiusValue
    }
  }

  // Apply border (stroke) if present
  const borderWidth = node.styles?.['borderWidth']
  const borderColor = node.styles?.['borderColor']
  const borderStyle = node.styles?.['borderStyle']

  if (borderWidth && borderColor && isCoralColor(borderColor)) {
    const strokeWeight = extractNumberValue(borderWidth)
    if (strokeWeight !== undefined && strokeWeight > 0) {
      wrapper.strokeWeight = strokeWeight
      wrapper.strokes = [
        {
          type: 'SOLID',
          color: convertColor(borderColor),
          opacity: getOpacity(borderColor),
        },
      ]

      // Handle border style (solid, dashed, dotted)
      if (borderStyle === 'dashed') {
        wrapper.dashPattern = [strokeWeight * 3, strokeWeight * 2]
      } else if (borderStyle === 'dotted') {
        wrapper.dashPattern = [strokeWeight, strokeWeight]
      }
      // Default is solid (no dashPattern needed)
    }
  }

  // Apply spacing - combine margin + padding when both exist
  wrapper.paddingTop = spacing.paddingTop + spacing.marginTop
  wrapper.paddingBottom = spacing.paddingBottom + spacing.marginBottom
  wrapper.paddingLeft = spacing.paddingLeft + spacing.marginLeft
  wrapper.paddingRight = spacing.paddingRight + spacing.marginRight

  // Apply text alignment to wrapper's auto layout
  if (textAlign === 'center') {
    wrapper.counterAxisAlignItems = 'CENTER'
    wrapper.primaryAxisAlignItems = 'CENTER'
  } else if (textAlign === 'right') {
    wrapper.counterAxisAlignItems = 'MAX'
    wrapper.primaryAxisAlignItems = 'MAX'
  } else {
    wrapper.counterAxisAlignItems = 'MIN'
    wrapper.primaryAxisAlignItems = 'MIN'
  }

  // Create text node inside with merged styles for inheritance
  const textNode = await createSimpleTextNode(node, textAlign, mergedStyles)
  wrapper.appendChild(textNode)

  // Text node should fill horizontally within wrapper (it's inside auto layout now, so this is safe)
  textNode.layoutSizingHorizontal = 'FILL'

  return wrapper
}

/**
 * Recursively build a Figma node from a Coral node
 */
async function buildNode(
  node: CoralNode | CoralRootNode,
  autoLayoutNodes: AutoLayoutRequirement[],
  inheritedTextAlign?: string,
  inheritedStyles: Record<string, any> = {},
): Promise<SceneNode> {
  // const nodePath = [node.name || node.elementType || node.type]
  // const isContainer = node.elementType === 'div' || node.elementType === 'section' || node.elementType === 'article'
  const hasChildren = Boolean(node.children && node.children.length > 0)
  const hasTextContent = 'textContent' in node && node.textContent

  // Merge inherited styles with current node styles (current takes precedence)
  const currentStyles = node.styles || {}
  const mergedStyles = { ...inheritedStyles, ...currentStyles }

  // Get text alignment from merged styles
  const currentTextAlign = (mergedStyles['textAlign'] as string) || inheritedTextAlign
  const needsAutoLayout = autoLayoutNodes.some(
    (al) => al.nodeName === (node.name || node.elementType || node.type) && al.hasChildren,
  )

  // If node has text content but no children, check if it needs a wrapper
  if (hasTextContent && !hasChildren) {
    const needsWrapper = needsWrapperFrame(node)

    if (needsWrapper) {
      // Create wrapper frame with text node inside
      return await createTextNodeWithWrapper(node, currentTextAlign, mergedStyles)
    } else {
      // Just create text node with inherited styles
      return await createSimpleTextNode(node, currentTextAlign, mergedStyles)
    }
  }

  // Handle SVG elements specially - create vector frame
  if (node.elementType === 'svg') {
    // Extract parent color for currentColor resolution
    const colorValue = mergedStyles?.['color']
    let parentColor: RGB | undefined
    if (isCoralColor(colorValue)) {
      const hex = (colorValue as CoralColorType).hex.replace('#', '')
      parentColor = {
        r: parseInt(hex.substring(0, 2), 16) / 255,
        g: parseInt(hex.substring(2, 4), 16) / 255,
        b: parseInt(hex.substring(4, 6), 16) / 255,
      }
    }
    return await createSVGFrame(node, parentColor)
  }

  // Create a frame for container elements
  const frame = figma.createFrame()
  frame.name = convertNameToElementType(node.elementType || node.type || 'container')

  // Apply background color if present
  const backgroundColor = node.styles?.['backgroundColor']
  if (backgroundColor && isCoralColor(backgroundColor)) {
    const rgb = convertColor(backgroundColor)
    const opacity = getOpacity(backgroundColor)
    frame.fills = [
      {
        type: 'SOLID',
        color: rgb,
        opacity: opacity,
      },
    ]
  } else {
    frame.fills = [] // Remove default background
  }

  // Apply border radius if present
  const borderRadius = node.styles?.['borderRadius']
  if (borderRadius !== undefined) {
    const radiusValue = extractNumberValue(borderRadius)
    if (radiusValue !== undefined) {
      frame.cornerRadius = radiusValue
    }
  }

  // Apply border (stroke) if present
  const borderWidth = node.styles?.['borderWidth']
  const borderColor = node.styles?.['borderColor']
  const borderStyle = node.styles?.['borderStyle']

  if (borderWidth && borderColor && isCoralColor(borderColor)) {
    const strokeWeight = extractNumberValue(borderWidth)
    if (strokeWeight !== undefined && strokeWeight > 0) {
      frame.strokeWeight = strokeWeight
      frame.strokes = [
        {
          type: 'SOLID',
          color: convertColor(borderColor),
          opacity: getOpacity(borderColor),
        },
      ]

      // Handle border style (solid, dashed, dotted)
      if (borderStyle === 'dashed') {
        frame.dashPattern = [strokeWeight * 3, strokeWeight * 2]
      } else if (borderStyle === 'dotted') {
        frame.dashPattern = [strokeWeight, strokeWeight]
      }
      // Default is solid (no dashPattern needed)
    }
  }

  // Apply explicit width and height if present
  // For elements with explicit dimensions, use FIXED sizing mode
  const width = node.styles?.['width']
  const height = node.styles?.['height']
  const hasExplicitWidth = width !== undefined && width !== '100%' && width !== 'auto'
  const hasExplicitHeight = height !== undefined && height !== '100%' && height !== 'auto'

  if (hasExplicitWidth || hasExplicitHeight) {
    const widthValue = extractNumberValue(width)
    const heightValue = extractNumberValue(height)

    // Get current dimensions as fallback
    const currentWidth = widthValue !== undefined && widthValue > 0 ? widthValue : frame.width
    const currentHeight = heightValue !== undefined && heightValue > 0 ? heightValue : frame.height

    // Resize the frame with explicit dimensions
    if (currentWidth > 0 && currentHeight > 0) {
      frame.resize(currentWidth, currentHeight)

      // Use FIXED sizing for elements with explicit dimensions
      // This prevents auto layout from overriding the size
      if (hasExplicitWidth) {
        frame.layoutSizingHorizontal = 'FIXED'
      }
      if (hasExplicitHeight) {
        frame.layoutSizingVertical = 'FIXED'
      }
    }
  }

  // Find auto layout configuration for this node
  const nodeName = node.name || node.elementType || node.type
  // Use case-insensitive matching since names might differ in capitalization
  const autoLayoutConfig = autoLayoutNodes.find((al) =>
    al.nodeName?.toLowerCase() === nodeName?.toLowerCase()
  )

  // Debug: log when looking for grid nodes
  const hasGridInList = autoLayoutNodes.some(al => al.reason === 'grid-layout')
  if (hasGridInList) {
    console.log('🟦 Looking for node:', nodeName, 'in autoLayoutNodes. Grid nodes available:',
      autoLayoutNodes.filter(al => al.reason === 'grid-layout').map(al => al.nodeName))
  }

  // Apply auto layout if needed
  if (needsAutoLayout || hasChildren || autoLayoutConfig) {
    const isGridLayout = autoLayoutConfig?.reason === 'grid-layout'

    // For grid layouts, defer setup until after children are appended
    if (isGridLayout) {
      console.log('🟦 Detected GRID layout for:', node.name || node.elementType, 'columns:', autoLayoutConfig.gridTemplateColumns)
      // Set to VERTICAL temporarily - will convert to GRID after children
      frame.layoutMode = 'VERTICAL'
      frame.setPluginData('pendingGridLayout', 'true')
      frame.setPluginData('gridTemplateColumns', autoLayoutConfig.gridTemplateColumns || '')
    } else {
      // Set layout mode based on flex direction or default to vertical
      if (autoLayoutConfig?.layoutMode) {
        frame.layoutMode = autoLayoutConfig.layoutMode as 'HORIZONTAL' | 'VERTICAL'
      } else {
        frame.layoutMode = 'VERTICAL'
      }
    }

    // Only set HUG sizing if there are no explicit dimensions
    // Elements with explicit width/height use FIXED sizing (set earlier)
    if (!hasExplicitWidth) {
      frame.layoutSizingHorizontal = 'HUG'
    }
    if (!hasExplicitHeight) {
      frame.layoutSizingVertical = 'HUG'
    }
    frame.primaryAxisSizingMode = 'AUTO'

    // Apply padding if present
    // Note: For container frames, we apply padding directly
    // Margins on containers are handled by parent's itemSpacing (from gap)
    const spacing = extractSpacingValues(node)
    if (spacing.paddingTop > 0) frame.paddingTop = spacing.paddingTop
    if (spacing.paddingBottom > 0) frame.paddingBottom = spacing.paddingBottom
    if (spacing.paddingLeft > 0) frame.paddingLeft = spacing.paddingLeft
    if (spacing.paddingRight > 0) frame.paddingRight = spacing.paddingRight

    // Apply gap/spacing
    if (autoLayoutConfig?.gap) {
      frame.itemSpacing = autoLayoutConfig.gap
    } else if (autoLayoutConfig?.columnGap || autoLayoutConfig?.rowGap) {
      // Use columnGap for horizontal, rowGap for vertical
      const spacing = frame.layoutMode === 'HORIZONTAL' ? autoLayoutConfig.columnGap || 0 : autoLayoutConfig.rowGap || 0
      frame.itemSpacing = spacing
    } else {
      frame.itemSpacing = 8 // Default spacing
    }

    // Apply alignment based on flex properties or text alignment
    if (autoLayoutConfig?.reason === 'flex-layout') {
      // Map CSS justify-content to Figma primaryAxisAlignItems
      switch (autoLayoutConfig.justifyContent) {
        case 'center':
          frame.primaryAxisAlignItems = 'CENTER'
          break
        case 'flex-start':
        case 'start':
          frame.primaryAxisAlignItems = 'MIN'
          break
        case 'flex-end':
        case 'end':
          frame.primaryAxisAlignItems = 'MAX'
          break
        case 'space-between':
          frame.primaryAxisAlignItems = 'SPACE_BETWEEN'
          break
        default:
          frame.primaryAxisAlignItems = 'MIN'
      }

      // Map CSS align-items to Figma counterAxisAlignItems
      switch (autoLayoutConfig.alignItems) {
        case 'center':
          frame.counterAxisAlignItems = 'CENTER'
          break
        case 'flex-start':
        case 'start':
          frame.counterAxisAlignItems = 'MIN'
          break
        case 'flex-end':
        case 'end':
          frame.counterAxisAlignItems = 'MAX'
          break
        case 'baseline':
          frame.counterAxisAlignItems = 'BASELINE'
          break
        default:
          frame.counterAxisAlignItems = 'MIN'
      }
    } else if (currentTextAlign) {
      // Apply text alignment to auto layout
      if (currentTextAlign === 'center') {
        frame.counterAxisAlignItems = 'CENTER'
        frame.primaryAxisAlignItems = 'CENTER'
      } else if (currentTextAlign === 'right') {
        frame.counterAxisAlignItems = 'MAX'
        frame.primaryAxisAlignItems = 'MAX'
      } else {
        frame.counterAxisAlignItems = 'MIN'
        frame.primaryAxisAlignItems = 'MIN'
      }
    } else {
      // Default alignment
      frame.counterAxisAlignItems = 'MIN'
      frame.primaryAxisAlignItems = 'MIN'
    }
  }

  // Add text content as first child if present (before other children)
  if (hasTextContent && hasChildren) {
    const textNode = await createSimpleTextNode(node, currentTextAlign, mergedStyles)
    frame.appendChild(textNode)
  }

  // Process children
  if (hasChildren && node.children) {
    for (const child of node.children) {
      const childNode = await buildNode(child, autoLayoutNodes, currentTextAlign, mergedStyles)
      frame.appendChild(childNode)

      // Handle absolute positioning AFTER appending
      const isAbsolute = child.styles?.['position'] === 'absolute'
      if (isAbsolute && 'layoutPositioning' in childNode && frame.layoutMode !== 'NONE') {
        childNode.layoutPositioning = 'ABSOLUTE'

        // Handle inset: 0 (stretch to fill parent)
        const hasInset = child.styles?.['inset'] !== undefined
        const insetValue = child.styles?.['inset']

        if (hasInset && insetValue === 0) {
          childNode.x = 0
          childNode.y = 0
          if ('constraints' in childNode) {
            childNode.constraints = {
              horizontal: 'STRETCH',
              vertical: 'STRETCH',
            }
          }
          childNode.resize(frame.width, frame.height)
        } else {
          // Handle individual position properties (top, right, bottom, left)
          const top = child.styles?.['top']
          const right = child.styles?.['right']
          const bottom = child.styles?.['bottom']
          const left = child.styles?.['left']

          // Calculate x position (left or right)
          if (left !== undefined) {
            const leftValue = typeof left === 'number' ? left : extractNumberValue(left)
            if (leftValue !== undefined) {
              childNode.x = leftValue
            }
          } else if (right !== undefined) {
            const rightValue = typeof right === 'number' ? right : extractNumberValue(right)
            if (rightValue !== undefined) {
              childNode.x = frame.width - childNode.width - rightValue
            }
          } else {
            childNode.x = 0
          }

          // Calculate y position (top or bottom)
          if (top !== undefined) {
            const topValue = typeof top === 'number' ? top : extractNumberValue(top)
            if (topValue !== undefined) {
              childNode.y = topValue
            }
          } else if (bottom !== undefined) {
            const bottomValue = typeof bottom === 'number' ? bottom : extractNumberValue(bottom)
            if (bottomValue !== undefined) {
              childNode.y = frame.height - childNode.height - bottomValue
            }
          } else {
            childNode.y = 0
          }

          // Set appropriate constraints based on which sides are set
          if ('constraints' in childNode) {
            const currentConstraints = childNode.constraints || { horizontal: 'MIN', vertical: 'MIN' }

            if (left !== undefined && right !== undefined) {
              childNode.constraints = { horizontal: 'STRETCH', vertical: currentConstraints.vertical }
            } else if (left !== undefined) {
              childNode.constraints = { horizontal: 'MIN', vertical: currentConstraints.vertical }
            } else if (right !== undefined) {
              childNode.constraints = { horizontal: 'MAX', vertical: currentConstraints.vertical }
            }

            if (top !== undefined && bottom !== undefined) {
              childNode.constraints = { horizontal: currentConstraints.horizontal, vertical: 'STRETCH' }
            } else if (top !== undefined) {
              childNode.constraints = { horizontal: currentConstraints.horizontal, vertical: 'MIN' }
            } else if (bottom !== undefined) {
              childNode.constraints = { horizontal: currentConstraints.horizontal, vertical: 'MAX' }
            }
          }
        }
      } else if (frame.layoutMode !== 'NONE' && 'layoutSizingHorizontal' in childNode) {
        // NOT absolutely positioned - use auto-layout FILL sizing if needed
        // Check if this child should fill (from plugin data or default block behavior)
        const shouldFill = childNode.getPluginData('shouldFillHorizontal') === 'true'
        const isBlockElement =
          'elementType' in child &&
          !['span', 'a', 'strong', 'em', 'code'].includes((child as CoralNode).elementType || '')

        if (shouldFill || isBlockElement) {
          childNode.layoutSizingHorizontal = 'FILL'
          // Clear the plugin data
          if (shouldFill) {
            childNode.setPluginData('shouldFillHorizontal', '')
          }
        }
      }
    }
  }

  // Store whether this frame has pending grid layout
  const isPendingGrid = frame.getPluginData('pendingGridLayout') === 'true'

  // Convert to GRID layout if deferred (MUST happen before margin wrapper)
  if (isPendingGrid) {
    const gridTemplateColumns = frame.getPluginData('gridTemplateColumns')
    console.log('🟦 Converting to GRID layout:', frame.name, 'columns:', gridTemplateColumns)

    // Parse grid-template-columns to determine column count
    let columnCount = 1
    if (gridTemplateColumns) {
      // Handle "repeat(N, ...)" pattern
      const repeatMatch = gridTemplateColumns.match(/repeat\((\d+),/)
      if (repeatMatch) {
        columnCount = parseInt(repeatMatch[1], 10)
      } else {
        // Count columns by spaces/fr units
        const columns = gridTemplateColumns.split(/\s+/).filter(c => c && c !== '')
        columnCount = columns.length
      }
    }

    // Calculate row count based on children
    const childCount = hasChildren && node.children ? node.children.length : 0
    const rowCount = Math.ceil(childCount / columnCount)

    console.log('🟦 Grid config:', { columnCount, rowCount, childCount })

    // Convert to GRID layout
    frame.layoutMode = 'GRID'
    frame.gridColumnCount = columnCount
    frame.gridRowCount = rowCount

    // Apply gap
    if (autoLayoutConfig?.columnGap) {
      frame.gridColumnGap = autoLayoutConfig.columnGap
    }
    if (autoLayoutConfig?.rowGap) {
      frame.gridRowGap = autoLayoutConfig.rowGap
    }

    // Grid children must use FIXED sizing
    if ('children' in frame) {
      for (let i = 0; i < frame.children.length; i++) {
        const child = frame.children[i]
        if ('layoutSizingHorizontal' in child) {
          child.layoutSizingHorizontal = 'FIXED'
          child.layoutSizingVertical = 'FIXED'
        }
      }
    }

    console.log('🟦 Grid layout applied successfully')

    // Apply margin as padding on the grid frame itself (can't wrap grids)
    if (hasMargin(node)) {
      const spacing = extractSpacingValues(node)
      frame.paddingTop = (frame.paddingTop || 0) + spacing.marginTop
      frame.paddingBottom = (frame.paddingBottom || 0) + spacing.marginBottom
      frame.paddingLeft = (frame.paddingLeft || 0) + spacing.marginLeft
      frame.paddingRight = (frame.paddingRight || 0) + spacing.marginRight
    }

    // Clear plugin data
    frame.setPluginData('pendingGridLayout', '')
    frame.setPluginData('gridTemplateColumns', '')
  }

  // If this container frame has margin, wrap it to convert margin to padding
  // BUT: Don't wrap grid layouts - grid margins should be handled differently
  if (hasMargin(node) && !isPendingGrid) {
    const wrapper = figma.createFrame()
    wrapper.name = `${convertNameToElementType(frame.elementType || frame.type)}-margin-wrapper`
    wrapper.layoutMode = 'VERTICAL'
    wrapper.layoutSizingHorizontal = 'HUG'
    wrapper.layoutSizingVertical = 'HUG'
    wrapper.fills = [] // No background on margin wrapper

    // Convert margin to padding on wrapper
    const spacing = extractSpacingValues(node)
    wrapper.paddingTop = spacing.marginTop
    wrapper.paddingBottom = spacing.marginBottom
    wrapper.paddingLeft = spacing.marginLeft
    wrapper.paddingRight = spacing.marginRight

    // Append the frame to the wrapper
    wrapper.appendChild(frame)

    // Transfer any shouldFill plugin data to the wrapper
    if (frame.getPluginData('shouldFillHorizontal') === 'true') {
      wrapper.setPluginData('shouldFillHorizontal', 'true')
      frame.setPluginData('shouldFillHorizontal', '')
    }

    return wrapper
  }

  return frame
}

/**
 * Create a simple text node
 */
async function createSimpleTextNode(
  node: CoralNode | CoralRootNode,
  textAlign?: string,
  mergedStyles?: Record<string, any>,
): Promise<TextNode> {
  const textNode = figma.createText()

  // Get font info from node styles or inherited styles, with defaults
  const fontFamily = ((node.styles?.['fontFamily'] || mergedStyles?.['fontFamily']) as string)?.split(',')[0] || 'Inter'
  const fontWeight = (node.styles?.['fontWeight'] || mergedStyles?.['fontWeight'] || 400) as number

  // Transform font weight to Figma style
  const transformFontWeightToFigmaFontStyle = (weight: number): string => {
    if (weight >= 700) return 'Bold'
    if (weight >= 600) return 'Semi Bold'
    if (weight >= 500) return 'Medium'
    return 'Regular'
  }

  const fontStyle = transformFontWeightToFigmaFontStyle(fontWeight)

  // Load and apply font
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
    textNode.fontName = { family: fontFamily, style: fontStyle }
  } catch {
    // Fallback to Inter Regular
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
    textNode.fontName = { family: 'Inter', style: 'Regular' }
  }

  // Set text content
  const textContent = 'textContent' in node ? node.textContent : ''
  textNode.characters = textContent || node.name || 'Text'
  textNode.name = convertNameToElementType(node.elementType || node.type || 'text')

  // Apply text alignment
  if (textAlign === 'center') {
    textNode.textAlignHorizontal = 'CENTER'
  } else if (textAlign === 'right') {
    textNode.textAlignHorizontal = 'RIGHT'
  } else {
    textNode.textAlignHorizontal = 'LEFT'
  }

  // Apply typography styles
  const fontSize = node.styles?.['fontSize']
  if (fontSize) {
    const fontSizeValue = typeof fontSize === 'object' && 'value' in fontSize ? fontSize.value : fontSize
    textNode.fontSize = Number(fontSizeValue)
  }

  const lineHeight = node.styles?.['lineHeight']
  if (lineHeight) {
    const lineHeightValue = typeof lineHeight === 'object' && 'value' in lineHeight ? lineHeight.value : lineHeight
    if (typeof lineHeightValue === 'number') {
      textNode.lineHeight = { value: lineHeightValue, unit: 'PIXELS' }
    }
  }

  const letterSpacing = node.styles?.['letterSpacing']
  if (letterSpacing && typeof letterSpacing === 'number') {
    textNode.letterSpacing = { value: letterSpacing, unit: 'PIXELS' }
  }

  // Apply text color - check node styles first, then fall back to inherited styles
  const color = node.styles?.['color'] || mergedStyles?.['color']
  if (color && isCoralColor(color)) {
    const rgb = convertColor(color)
    const opacity = getOpacity(color)
    textNode.fills = [
      {
        type: 'SOLID',
        color: rgb,
        opacity: opacity,
      },
    ]
  }

  return textNode
}
