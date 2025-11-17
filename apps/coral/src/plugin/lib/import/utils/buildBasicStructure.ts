import { CoralColorType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { isCoralColor } from '../../types'
import { isInlineElement } from '../assert/isInlineElement'
import { convertCoralColorToRGB, getColorOpacity } from '../color/convertCoralColorToRGB'
import { applyBorderFromNode } from '../styles/applyBorder'
import { createSVGFrame } from '../vector/createSVGFrame'
import { applyResponsiveStyles } from './applyResponsiveStyles'
import { convertNameToElementType } from './convertNameToElementType'
import { hasMargin, needsWrapperFrame } from './detectLayoutRequirements'
import { extractDimensionValues } from './extractDimensionValues'
import { extractSpacingValues } from './extractSpacingValues'
import { extractStyleValue } from './extractStyleValue'
import { getBreakpointWidth } from './getBreakpointWidth'
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
    const variantComponent = await createBasicComponent(
      specWithResponsiveStyles,
      variantAnalysis,
      variant.name,
      minWidth,
    )
    variantComponent.name = `${spec.name}=${variant.name}`
    variantComponent.x = currentX
    variantComponent.y = 0
    currentX += variantComponent.width + 24
    variants.push(variantComponent)
  }

  // Combine into component set using a temporary frame (build in memory)
  // Note: combineAsVariants requires a parent, but we don't want it on the page yet
  // We'll create a temp frame that's NOT on the page, combine variants into it,
  // then move the component set to the page in code.ts (which will automatically
  // remove it from tempFrame). Then we can clean up tempFrame.
  const tempFrame = figma.createFrame()
  tempFrame.name = 'temp-variant-container'
  // Don't append tempFrame to page - it exists only in memory

  const componentSet = figma.combineAsVariants(variants, tempFrame)
  componentSet.name = spec.name

  // Component set is now a child of tempFrame, which is NOT on the page
  // When we append componentSet to figma.currentPage in code.ts, it will
  // automatically be removed from tempFrame. After that, we can clean up tempFrame.
  // Store reference to tempFrame on componentSet so we can clean it up later
  componentSet.setPluginData('tempFrameId', tempFrame.id)

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
  const rootNode = await buildNode(spec, analysis.autoLayoutNodes, undefined, {}, [])

  // Set minimum width if provided
  if (minWidth && 'resize' in rootNode) {
    const currentHeight = rootNode.height
    // Only resize if current width is less than minimum
    if (rootNode.width < minWidth) {
      rootNode.resize(minWidth, currentHeight)
    }
  }

  // Convert to component
  // rootNode should have no parent since it's built in memory
  // createComponentFromNode will create the component with the same parent relationship
  // If rootNode has no parent, component will also have no parent (which is what we want)
  const component = figma.createComponentFromNode(rootNode)
  component.name = variantName ? `${spec.name}=${variantName}` : spec.name

  // Verify component is not on the page (it shouldn't be if rootNode wasn't on the page)
  // If for some reason it is, we'll handle it in code.ts by checking before appending

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
 * Create a text node wrapped in a frame with margin/padding
 */
async function createTextNodeWithWrapper(
  node: CoralNode | CoralRootNode,
  textAlign?: string,
  mergedStyles?: Record<string, unknown>,
): Promise<FrameNode> {
  const spacing = extractSpacingValues(node)
  const hasMarginValue =
    spacing.marginTop > 0 || spacing.marginBottom > 0 || spacing.marginLeft > 0 || spacing.marginRight > 0
  const hasPadding =
    spacing.paddingTop > 0 || spacing.paddingBottom > 0 || spacing.paddingLeft > 0 || spacing.paddingRight > 0

  // If both margin and padding exist, create nested structure:
  // Outer wrapper (margin) -> Inner wrapper (padding + background + border) -> Text
  if (hasMarginValue && hasPadding) {
    // Create outer margin wrapper (no background)
    const marginWrapper = figma.createFrame()
    marginWrapper.name = `${convertNameToElementType(node.elementType || node.type)}-margin-wrapper`
    marginWrapper.layoutMode = 'VERTICAL'
    marginWrapper.layoutSizingVertical = 'HUG'
    marginWrapper.primaryAxisSizingMode = 'AUTO'
    marginWrapper.fills = [] // No background on margin wrapper

    // Check if this is an inline element - inline elements should use HUG sizing, not FILL
    const isInline = isInlineElement(node)
    marginWrapper.setPluginData('shouldFillHorizontal', isInline ? 'false' : 'true')

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
          color: convertCoralColorToRGB(backgroundColor),
          opacity: getColorOpacity(backgroundColor),
        },
      ]
    } else {
      paddingWrapper.fills = []
    }

    // Apply border radius to padding wrapper
    const borderRadius = node.styles?.['borderRadius']
    if (borderRadius !== undefined) {
      const radiusValue = extractStyleValue(borderRadius)
      if (radiusValue !== undefined) {
        paddingWrapper.cornerRadius = radiusValue
      }
    }

    // Apply border (stroke) to padding wrapper
    applyBorderFromNode(paddingWrapper, node)

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

    // Extract dimension constraints first to determine sizing strategy
    const dimensions = extractDimensionValues(node)
    const hasWidthConstraints =
      (dimensions.maxWidth !== undefined && dimensions.maxWidth > 0) ||
      (dimensions.minWidth !== undefined && dimensions.minWidth > 0)

    // Create text node
    const textNode = await createSimpleTextNode(node, textAlign, mergedStyles)
    paddingWrapper.appendChild(textNode)

    // If width constraints exist, apply them to TEXT NODE and use HUG sizing
    // This allows the wrapper to center properly when parent doesn't have auto-layout
    if (hasWidthConstraints) {
      // Use HUG sizing so text node respects its own width constraints
      textNode.layoutSizingHorizontal = 'HUG'

      if (dimensions.maxWidth !== undefined && dimensions.maxWidth > 0) {
        textNode.maxWidth = dimensions.maxWidth
      }
      if (dimensions.minWidth !== undefined && dimensions.minWidth > 0) {
        textNode.minWidth = dimensions.minWidth
      }
    } else {
      // No width constraints - use FILL sizing (default behavior)
      textNode.layoutSizingHorizontal = 'FILL'
    }

    // Height constraints go on the wrapper to include padding/background
    if (dimensions.maxHeight !== undefined && dimensions.maxHeight > 0) {
      paddingWrapper.maxHeight = dimensions.maxHeight
    }

    if (dimensions.minHeight !== undefined && dimensions.minHeight > 0) {
      paddingWrapper.minHeight = dimensions.minHeight
    }

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

  // Check if this is an inline element - inline elements should use HUG sizing, not FILL
  const isInline = isInlineElement(node)
  wrapper.setPluginData('shouldFillHorizontal', isInline ? 'false' : 'true')

  // Apply non-text styles to wrapper (backgroundColor, borderRadius, etc.)
  const backgroundColor = node.styles?.['backgroundColor']
  if (backgroundColor && isCoralColor(backgroundColor)) {
    const rgb = convertCoralColorToRGB(backgroundColor)
    const opacity = getColorOpacity(backgroundColor)
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
    const radiusValue = extractStyleValue(borderRadius)
    if (radiusValue !== undefined) {
      wrapper.cornerRadius = radiusValue
    }
  }

  // Apply border (stroke) if present
  applyBorderFromNode(wrapper, node)

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

  // Extract dimension constraints first to determine sizing strategy
  const dimensions = extractDimensionValues(node)
  const hasWidthConstraints =
    (dimensions.maxWidth !== undefined && dimensions.maxWidth > 0) ||
    (dimensions.minWidth !== undefined && dimensions.minWidth > 0)

  // Create text node inside with merged styles for inheritance
  const textNode = await createSimpleTextNode(node, textAlign, mergedStyles)
  wrapper.appendChild(textNode)

  // If width constraints exist, apply them to TEXT NODE and use HUG sizing
  // This allows the wrapper to center properly when parent doesn't have auto-layout
  if (hasWidthConstraints) {
    // Use HUG sizing so text node respects its own width constraints
    textNode.layoutSizingHorizontal = 'HUG'

    if (dimensions.maxWidth !== undefined && dimensions.maxWidth > 0) {
      textNode.maxWidth = dimensions.maxWidth
    }
    if (dimensions.minWidth !== undefined && dimensions.minWidth > 0) {
      textNode.minWidth = dimensions.minWidth
    }
  } else {
    // No width constraints - use FILL sizing (default behavior)
    textNode.layoutSizingHorizontal = 'FILL'
  }

  // Height constraints go on the wrapper to include padding/background
  if (dimensions.maxHeight !== undefined && dimensions.maxHeight > 0) {
    wrapper.maxHeight = dimensions.maxHeight
  }

  if (dimensions.minHeight !== undefined && dimensions.minHeight > 0) {
    wrapper.minHeight = dimensions.minHeight
  }

  return wrapper
}

/**
 * Recursively build a Figma node from a Coral node
 */
async function buildNode(
  node: CoralNode | CoralRootNode,
  autoLayoutNodes: AutoLayoutRequirement[],
  inheritedTextAlign?: string,
  inheritedStyles: Record<string, unknown> = {},
  currentPath: string[] = [],
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
    const rgb = convertCoralColorToRGB(backgroundColor)
    const opacity = getColorOpacity(backgroundColor)
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
    const radiusValue = extractStyleValue(borderRadius)
    if (radiusValue !== undefined) {
      frame.cornerRadius = radiusValue
    }
  }

  // Apply border (stroke) if present
  applyBorderFromNode(frame, node)

  // Apply explicit width and height if present
  // For elements with explicit dimensions, use FIXED sizing mode
  const dimensions = extractDimensionValues(node)
  const width = node.styles?.['width']
  const height = node.styles?.['height']

  // Use maxWidth/maxHeight if explicit width/height not set
  const effectiveWidth = width !== undefined && width !== '100%' && width !== 'auto' ? width : dimensions.maxWidth
  const effectiveHeight = height !== undefined && height !== '100%' && height !== 'auto' ? height : dimensions.maxHeight

  const hasExplicitWidth = effectiveWidth !== undefined
  const hasExplicitHeight = effectiveHeight !== undefined

  if (hasExplicitWidth || hasExplicitHeight) {
    const widthValue = extractStyleValue(effectiveWidth)
    const heightValue = extractStyleValue(effectiveHeight)

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
  // Match by nodePath to handle multiple nodes with the same name
  const nodeName = node.name || node.elementType || node.type || 'unknown'
  const nodePath = [...currentPath, nodeName]

  // Check if this node is a grid or flex container
  const display = node.styles?.['display']
  const isGridNode = display === 'grid'
  const isFlexNode = display === 'flex' || display === 'inline-flex'

  const autoLayoutConfig = autoLayoutNodes.find((al) => {
    // First try exact path match
    if (al.nodePath && al.nodePath.length === nodePath.length) {
      const pathMatches = al.nodePath.every(
        (pathPart, index) => pathPart.toLowerCase() === nodePath[index]?.toLowerCase(),
      )
      if (pathMatches) {
        // If this is a grid node, only match grid-layout configs
        if (isGridNode) {
          return al.reason === 'grid-layout'
        }
        return true
      }
    }
    return false // Don't use name-only fallback in find()
  })

  // If no path match found, try name-only fallback with priority for flex/grid
  // IMPORTANT: Only match grid-layout if this node actually has display: grid
  // IMPORTANT: Only match flex-layout if this node actually has display: flex
  // This prevents children from incorrectly getting parent layout types
  const autoLayoutConfigFallback =
    autoLayoutConfig ||
    autoLayoutNodes.find((al) => {
      if (al.nodeName?.toLowerCase() !== nodeName?.toLowerCase()) return false
      // Only match grid-layout if this node is actually a grid
      if (al.reason === 'grid-layout') {
        return isGridNode
      }
      // Only match flex-layout if this node is actually a flex container
      if (al.reason === 'flex-layout') {
        return isFlexNode
      }
      // For other reasons, match without additional checks
      return true
    }) ||
    autoLayoutNodes.find((al) => al.nodeName?.toLowerCase() === nodeName?.toLowerCase())

  const finalAutoLayoutConfig = autoLayoutConfigFallback

  // Apply auto layout if needed
  if (needsAutoLayout || hasChildren || finalAutoLayoutConfig) {
    const isGridLayout = finalAutoLayoutConfig?.reason === 'grid-layout'

    // For grid layouts, defer setup until after children are appended
    if (isGridLayout) {
      // Set to VERTICAL temporarily - will convert to GRID after children
      frame.layoutMode = 'VERTICAL'
      frame.setPluginData('pendingGridLayout', 'true')
      frame.setPluginData('gridTemplateColumns', finalAutoLayoutConfig.gridTemplateColumns || '')
    } else {
      // Set layout mode based on flex direction or default to vertical
      if (finalAutoLayoutConfig?.layoutMode) {
        frame.layoutMode = finalAutoLayoutConfig.layoutMode as 'HORIZONTAL' | 'VERTICAL'
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

    // Apply padding and margin (margins are converted to padding in Figma)
    // Note: For container frames, we apply padding directly
    // Margins are converted to padding since Figma doesn't have margin concept
    const spacing = extractSpacingValues(node)
    // Apply padding
    if (spacing.paddingTop > 0) frame.paddingTop = spacing.paddingTop
    if (spacing.paddingBottom > 0) frame.paddingBottom = spacing.paddingBottom
    if (spacing.paddingLeft > 0) frame.paddingLeft = spacing.paddingLeft
    if (spacing.paddingRight > 0) frame.paddingRight = spacing.paddingRight

    // Convert margins to padding (add to existing padding)
    if (spacing.marginTop > 0) frame.paddingTop = (frame.paddingTop || 0) + spacing.marginTop
    if (spacing.marginBottom > 0) frame.paddingBottom = (frame.paddingBottom || 0) + spacing.marginBottom
    if (spacing.marginLeft > 0) frame.paddingLeft = (frame.paddingLeft || 0) + spacing.marginLeft
    if (spacing.marginRight > 0) frame.paddingRight = (frame.paddingRight || 0) + spacing.marginRight

    // Apply gap/spacing
    if (finalAutoLayoutConfig?.gap) {
      frame.itemSpacing = finalAutoLayoutConfig.gap
    } else if (finalAutoLayoutConfig?.columnGap || finalAutoLayoutConfig?.rowGap) {
      // Use columnGap for horizontal, rowGap for vertical
      const spacing =
        frame.layoutMode === 'HORIZONTAL' ? finalAutoLayoutConfig.columnGap || 0 : finalAutoLayoutConfig.rowGap || 0
      frame.itemSpacing = spacing
    } else {
      frame.itemSpacing = 8 // Default spacing
    }

    // Apply alignment based on flex properties or text alignment
    if (finalAutoLayoutConfig?.reason === 'flex-layout') {
      // Map CSS justify-content to Figma primaryAxisAlignItems
      switch (finalAutoLayoutConfig.justifyContent) {
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
      switch (finalAutoLayoutConfig.alignItems) {
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
    } else if (finalAutoLayoutConfig?.reason === 'child-centering') {
      // Center children horizontally (for elements with width constraints and margin: auto)
      // In VERTICAL layout mode, counterAxis is horizontal, so CENTER aligns children horizontally
      frame.counterAxisAlignItems = 'CENTER'
      frame.primaryAxisAlignItems = 'MIN' // Start alignment vertically
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

    // Apply min/max dimension constraints AFTER setting layoutMode
    // These constraints only work on auto-layout frames and their direct children
    if (dimensions.maxWidth !== undefined && dimensions.maxWidth > 0) {
      frame.maxWidth = dimensions.maxWidth
    }

    if (dimensions.minWidth !== undefined && dimensions.minWidth > 0) {
      frame.minWidth = dimensions.minWidth
    }

    if (dimensions.maxHeight !== undefined && dimensions.maxHeight > 0) {
      frame.maxHeight = dimensions.maxHeight
    }

    if (dimensions.minHeight !== undefined && dimensions.minHeight > 0) {
      frame.minHeight = dimensions.minHeight
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
      const childNode = await buildNode(child, autoLayoutNodes, currentTextAlign, mergedStyles, nodePath)
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
            const leftValue = typeof left === 'number' ? left : extractStyleValue(left)
            if (leftValue !== undefined) {
              childNode.x = leftValue
            }
          } else if (right !== undefined) {
            const rightValue = typeof right === 'number' ? right : extractStyleValue(right)
            if (rightValue !== undefined) {
              childNode.x = frame.width - childNode.width - rightValue
            }
          } else {
            childNode.x = 0
          }

          // Calculate y position (top or bottom)
          if (top !== undefined) {
            const topValue = typeof top === 'number' ? top : extractStyleValue(top)
            if (topValue !== undefined) {
              childNode.y = topValue
            }
          } else if (bottom !== undefined) {
            const bottomValue = typeof bottom === 'number' ? bottom : extractStyleValue(bottom)
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
        const shouldFillData = childNode.getPluginData('shouldFillHorizontal')
        const shouldFill = shouldFillData === 'true'
        const shouldHug = shouldFillData === 'false'

        // Only check block element if plugin data doesn't explicitly set behavior
        const isBlockElement =
          !shouldHug &&
          'elementType' in child &&
          !['span', 'a', 'strong', 'em', 'code'].includes((child as CoralNode).elementType || '')

        if (shouldFill || (isBlockElement && !shouldHug)) {
          childNode.layoutSizingHorizontal = 'FILL'
          // Clear the plugin data
          if (shouldFill) {
            childNode.setPluginData('shouldFillHorizontal', '')
          }
        } else if (shouldHug) {
          // Explicitly set to HUG for inline elements
          childNode.layoutSizingHorizontal = 'HUG'
          childNode.setPluginData('shouldFillHorizontal', '')
        }
      }
    }
  }

  // Store whether this frame has pending grid layout (BEFORE we clear plugin data)
  const isPendingGrid = frame.getPluginData('pendingGridLayout') === 'true'

  // Convert to GRID layout if deferred (MUST happen before margin wrapper)
  if (isPendingGrid) {
    const gridTemplateColumns = frame.getPluginData('gridTemplateColumns')

    // Parse grid-template-columns to determine column count
    let columnCount = 1
    if (gridTemplateColumns) {
      // Handle "repeat(N, ...)" pattern
      const repeatMatch = gridTemplateColumns.match(/repeat\((\d+),/)
      if (repeatMatch && repeatMatch[1]) {
        columnCount = parseInt(repeatMatch[1], 10)
      } else {
        // Count columns by spaces/fr units
        const columns = gridTemplateColumns.split(/\s+/).filter((c) => c && c !== '')
        columnCount = columns.length
      }
    }

    // Calculate row count based on children
    const childCount = hasChildren && node.children ? node.children.length : 0
    const rowCount = Math.ceil(childCount / columnCount)

    // Convert to GRID layout
    frame.layoutMode = 'GRID'
    frame.gridColumnCount = columnCount
    frame.gridRowCount = rowCount

    // Apply gap
    if (finalAutoLayoutConfig?.columnGap) {
      frame.gridColumnGap = finalAutoLayoutConfig.columnGap
    }
    if (finalAutoLayoutConfig?.rowGap) {
      frame.gridRowGap = finalAutoLayoutConfig.rowGap
    }

    // Position children in grid and set explicit sizing
    if ('children' in frame) {
      // Calculate available width per column
      const paddingH = (frame.paddingLeft || 0) + (frame.paddingRight || 0)
      const totalGapWidth = (columnCount - 1) * (finalAutoLayoutConfig?.columnGap || 0)
      const availableWidth = (frame.width || 0) - paddingH - totalGapWidth
      const columnWidth = Math.floor(availableWidth / columnCount)

      // Track row heights to calculate total grid height
      const rowHeights: number[] = []

      for (let i = 0; i < frame.children.length; i++) {
        const child = frame.children[i]
        const childSpec = node.children?.[i]

        // Skip if child is undefined
        if (!child) {
          continue
        }

        // Calculate grid position (row, column) based on index
        const row = Math.floor(i / columnCount)
        const col = i % columnCount

        // Set grid position
        if ('setGridChildPosition' in child && typeof child.setGridChildPosition === 'function') {
          child.setGridChildPosition(row, col)
        }

        // Set FIXED sizing for grid children
        if ('layoutSizingHorizontal' in child) {
          child.layoutSizingHorizontal = 'FIXED'
          child.layoutSizingVertical = 'FIXED'
        }

        // For auto-layout children (frames), set counterAxisSizingMode to FIXED
        if ('counterAxisSizingMode' in child && 'layoutMode' in child && child.layoutMode !== 'NONE') {
          child.counterAxisSizingMode = 'FIXED'

          // Check if child has explicit height in spec
          const childHeight = childSpec?.styles?.['height']
          const hasExplicitHeight = childHeight !== undefined && childHeight !== 'auto' && childHeight !== '100%'

          if (!hasExplicitHeight) {
            // No explicit height - set to HUG (AUTO) for primary axis
            child.primaryAxisSizingMode = 'AUTO'
          }
        }

        // Resize to column width, keeping current height
        if ('resizeWithoutConstraints' in child && typeof child.resizeWithoutConstraints === 'function') {
          const currentHeight = child.height || 100
          child.resizeWithoutConstraints(columnWidth, currentHeight)
        }

        // Track the maximum height for this row
        if (!rowHeights[row]) {
          rowHeights[row] = 0
        }
        rowHeights[row] = Math.max(rowHeights[row], child.height || 0)
      }

      // Calculate total grid height: padding + row heights + gaps between rows
      const paddingV = (frame.paddingTop || 0) + (frame.paddingBottom || 0)
      const totalRowGaps = (rowCount - 1) * (finalAutoLayoutConfig?.rowGap || 0)
      const totalRowHeight = rowHeights.reduce((sum, height) => sum + height, 0)
      const totalGridHeight = paddingV + totalRowHeight + totalRowGaps

      // Resize grid to calculated height
      if (frame.width && totalGridHeight > 0) {
        frame.resizeWithoutConstraints(frame.width, totalGridHeight)
      }
    }

    // Apply margin as padding on the grid frame itself (can't wrap grids)
    if (hasMargin(node)) {
      const spacing = extractSpacingValues(node)
      frame.paddingTop = (frame.paddingTop || 0) + spacing.marginTop
      frame.paddingBottom = (frame.paddingBottom || 0) + spacing.marginBottom
      frame.paddingLeft = (frame.paddingLeft || 0) + spacing.marginLeft
      frame.paddingRight = (frame.paddingRight || 0) + spacing.marginRight
    }

    // Clear plugin data (do this AFTER using isPendingGrid below)
    frame.setPluginData('pendingGridLayout', '')
    frame.setPluginData('gridTemplateColumns', '')
  }

  // TODO: Handle container margin properly
  // For now, we're not wrapping containers with margin
  // Container margins should be handled by converting to padding directly

  return frame
}

/**
 * Create a simple text node
 */
async function createSimpleTextNode(
  node: CoralNode | CoralRootNode,
  textAlign?: string,
  mergedStyles?: Record<string, unknown>,
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
  // Use extractStyleValue to handle Dimension objects properly
  const fontSize = extractStyleValue(node.styles?.['fontSize'])
  if (fontSize !== undefined) {
    textNode.fontSize = fontSize
  }

  const lineHeight = extractStyleValue(node.styles?.['lineHeight'])
  if (lineHeight !== undefined) {
    textNode.lineHeight = { value: lineHeight, unit: 'PIXELS' }
  }

  const letterSpacing = extractStyleValue(node.styles?.['letterSpacing'])
  if (letterSpacing !== undefined) {
    textNode.letterSpacing = { value: letterSpacing, unit: 'PIXELS' }
  }

  // Apply text color - check node styles first, then fall back to inherited styles
  const color = node.styles?.['color'] || mergedStyles?.['color']
  if (color && isCoralColor(color)) {
    const rgb = convertCoralColorToRGB(color)
    const opacity = getColorOpacity(color)
    textNode.fills = [
      {
        type: 'SOLID',
        color: rgb,
        opacity: opacity,
      },
    ]
  }

  // Note: min/max dimension constraints for text nodes are NOT applied here
  // They can only be set on text nodes that are children of auto-layout frames
  // Since text nodes created by this function are standalone and will be appended later,
  // constraints are applied by the parent wrapper frames instead

  return textNode
}
