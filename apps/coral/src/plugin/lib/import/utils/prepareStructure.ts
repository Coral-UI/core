import { CoralNode, CoralRootNode, ResponsiveStyle } from '@reallygoodwork/coral-core'

import { loadFont } from '../typography/loadFont'
import { transformFontWeightToFigmaFontStyle } from '../typography/transformFontWeightToFigmaFontStyle'

export const TEXT_STYLE_PROPERTIES = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'textDecoration',
  'textTransform',
  'color',
] as const

export interface NodeStyleInfo {
  nodeType: string
  inherited: Record<string, any>
  current: Record<string, any>
  merged: Record<string, any>
}

export interface ResponsiveVariant {
  name: string
  breakpoint: ResponsiveStyle['breakpoint']
  label?: string
  depth: number
  nodePath: string[]
}

export interface AutoLayoutRequirement {
  nodeName: string
  nodeType: string
  depth: number
  nodePath: string[]
  reason: 'text-align' | 'flex-layout' | 'text-spacing'
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  hasChildren: boolean
  needsWrapper?: boolean
  // Flex properties
  layoutMode?: 'HORIZONTAL' | 'VERTICAL'
  justifyContent?: string
  alignItems?: string
  flexDirection?: string
  gap?: number
  columnGap?: number
  rowGap?: number
}

export interface PrepareStructureResult {
  fontsToLoad: string[]
  nodeStyles: NodeStyleInfo[]
  responsiveVariants: ResponsiveVariant[]
  autoLayoutNodes: AutoLayoutRequirement[]
  wrapperNodes: string[]
}

function generateVariantName(responsiveStyle: ResponsiveStyle): string {
  // Use label if provided
  if (responsiveStyle.label) {
    return responsiveStyle.label
  }

  // Otherwise generate from breakpoint
  const bp = responsiveStyle.breakpoint

  // Check if it's a range breakpoint
  if ('min' in bp || 'max' in bp) {
    const parts: string[] = []
    if (bp.min) {
      parts.push(`${bp.min.type}:${bp.min.value}`)
    }
    if (bp.max) {
      parts.push(`${bp.max.type}:${bp.max.value}`)
    }
    return parts.join(' AND ')
  }

  // Simple breakpoint
  return 'type' in bp ? `${bp.type}:${bp.value}` : 'range'
}

function needsWrapperFrame(node: CoralNode): boolean {
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

  return spacingProps.some((prop) => node.styles![prop] !== undefined)
}

export function collectFontsAndStyles(spec: CoralRootNode): PrepareStructureResult {
  const fontsToLoad = new Set<string>()
  const nodeStyles: NodeStyleInfo[] = []
  const responsiveVariants: ResponsiveVariant[] = []
  const autoLayoutNodes: AutoLayoutRequirement[] = []
  const wrapperNodes: string[] = []
  const seenBreakpoints = new Map<string, ResponsiveVariant>()

  function collectFonts(node: CoralNode, inheritedStyles: Record<string, any> = {}, depth = 0, path: string[] = []) {
    const currentPath = [...path, node.name || node.elementType || node.type]
    const hasChildren = Boolean(node.children && node.children.length > 0)

    // Extract text styles from current node
    const currentTextStyles: Record<string, any> = {}
    if (node.styles) {
      for (const prop of TEXT_STYLE_PROPERTIES) {
        if (node.styles[prop] !== undefined) {
          currentTextStyles[prop] = node.styles[prop]
        }
      }
    }

    // Merge inherited styles with current styles (current takes precedence)
    const mergedStyles = { ...inheritedStyles, ...currentTextStyles }

    // Store node style info
    nodeStyles.push({
      nodeType: node.elementType || node.type,
      inherited: inheritedStyles,
      current: currentTextStyles,
      merged: mergedStyles,
    })

    // Collect font if present in merged styles
    const fontFamily = (mergedStyles['fontFamily'] as string)?.split(',')[0]
    const fontWeight = transformFontWeightToFigmaFontStyle(mergedStyles['fontWeight'] as number)

    if (fontFamily) {
      const fontKey = `${fontFamily}:${fontWeight}`
      fontsToLoad.add(fontKey)
    }

    // Check if this node needs auto layout
    const isContainer = node.elementType === 'div' || node.elementType === 'section' || node.elementType === 'article'
    const hasTextAlign = currentTextStyles['textAlign'] !== undefined
    const isTextElement = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a'].includes(node.elementType || '')
    const hasTextContent = 'textContent' in node && node.textContent

    // Check for flex/display properties
    const display = node.styles?.['display'] as string | undefined
    const flexDirection = node.styles?.['flexDirection'] as string | undefined
    const justifyContent = node.styles?.['justifyContent'] as string | undefined
    const alignItems = node.styles?.['alignItems'] as string | undefined
    const gap = node.styles?.['gap'] as number | undefined
    const columnGap = node.styles?.['columnGap'] as number | undefined
    const rowGap = node.styles?.['rowGap'] as number | undefined

    const isFlex = display === 'flex' || display === 'inline-flex'
    const isGrid = display === 'grid'

    // Determine layout mode from flexDirection
    let layoutMode: 'HORIZONTAL' | 'VERTICAL' | undefined
    if (isFlex) {
      layoutMode = flexDirection === 'column' || flexDirection === 'column-reverse' ? 'VERTICAL' : 'HORIZONTAL'
    }

    // Add auto layout requirement for flex containers
    if (isFlex && hasChildren) {
      autoLayoutNodes.push({
        nodeName: node.name || node.elementType || node.type,
        nodeType: node.elementType || node.type,
        depth,
        nodePath: currentPath,
        reason: 'flex-layout',
        hasChildren,
        layoutMode,
        flexDirection,
        justifyContent,
        alignItems,
        gap,
        columnGap,
        rowGap,
      })
    } else if (isGrid && hasChildren) {
      // Add grid layout requirement
      const gridTemplateColumns = node.styles?.['gridTemplateColumns'] as string | undefined
      autoLayoutNodes.push({
        nodeName: node.name || node.elementType || node.type,
        nodeType: node.elementType || node.type,
        depth,
        nodePath: currentPath,
        reason: 'grid-layout',
        hasChildren,
        layoutMode: 'GRID' as any,
        gridTemplateColumns,
        columnGap,
        rowGap,
      })
    } else if (isContainer && hasTextAlign && hasChildren) {
      // Container with textAlign needs auto layout for text alignment
      autoLayoutNodes.push({
        nodeName: node.name || node.elementType || node.type,
        nodeType: node.elementType || node.type,
        depth,
        nodePath: currentPath,
        reason: 'text-align',
        textAlign: currentTextStyles['textAlign'] as 'left' | 'center' | 'right' | 'justify',
        hasChildren,
      })
    }

    // Check if text node needs wrapper for margin/padding
    if (isTextElement && hasTextContent && !hasChildren && needsWrapperFrame(node)) {
      const nodeName = node.name || node.elementType || node.type
      wrapperNodes.push(nodeName)

      // Use merged styles for textAlign (could be inherited)
      const effectiveTextAlign = mergedStyles['textAlign'] as 'left' | 'center' | 'right' | 'justify' | undefined

      autoLayoutNodes.push({
        nodeName: `${nodeName}-wrapper`,
        nodeType: node.elementType || node.type,
        depth,
        nodePath: currentPath,
        reason: 'text-spacing',
        textAlign: effectiveTextAlign,
        hasChildren: false,
        needsWrapper: true,
      })
    }

    // Collect responsive variants from this node
    if (node.responsiveStyles && node.responsiveStyles.length > 0) {
      for (const responsiveStyle of node.responsiveStyles) {
        const breakpointKey = JSON.stringify(responsiveStyle.breakpoint)

        // Only add unique breakpoints (first occurrence)
        if (!seenBreakpoints.has(breakpointKey)) {
          const variant: ResponsiveVariant = {
            name: generateVariantName(responsiveStyle),
            breakpoint: responsiveStyle.breakpoint,
            label: responsiveStyle.label,
            depth,
            nodePath: currentPath,
          }
          seenBreakpoints.set(breakpointKey, variant)
          responsiveVariants.push(variant)
        }
      }
    }

    // If the node has children, recursively collect fonts from each child
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        collectFonts(child, mergedStyles, depth + 1, currentPath)
      }
    }
  }

  collectFonts(spec)

  return {
    fontsToLoad: Array.from(fontsToLoad),
    nodeStyles,
    responsiveVariants,
    autoLayoutNodes,
    wrapperNodes,
  }
}

export const prepareStructure = async (spec: CoralRootNode) => {
  const { fontsToLoad } = collectFontsAndStyles(spec)

  // Load all fonts in parallel
  await Promise.all(
    fontsToLoad.map((fontKey) => {
      const [fontFamily, fontWeight] = fontKey.split(':')
      if (!fontFamily || !fontWeight) {
        return
      }
      return loadFont(fontFamily ?? 'Inter', fontWeight)
    }),
  )
}
