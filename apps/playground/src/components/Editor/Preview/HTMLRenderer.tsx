import { useRef } from 'react'

import type { CoralNode, CoralRootNode, CoralStyleType, Dimension, CoralColorType } from '@reallygoodwork/coral-core'

interface HTMLRendererProps {
  spec: CoralRootNode
  onElementClick: ((elementId: string) => void) | undefined
  selectedElementId: string | null | undefined
  viewportWidth: number
}

// Define dimension object type explicitly
type DimensionObject = {
  value: number
  unit: string
}

// Helper to check if value is a dimension object
const isDimension = (value: unknown): value is DimensionObject => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value &&
    typeof (value as DimensionObject).value === 'number' &&
    typeof (value as DimensionObject).unit === 'string'
  )
}

// Helper to convert dimension to CSS string
const dimensionToCSS = (dimension: Dimension | number | DimensionObject): string => {
  if (typeof dimension === 'number') {
    return `${dimension}px`
  }
  if (isDimension(dimension)) {
    return `${dimension.value}${dimension.unit}`
  }
  // Fallback for unknown types
  return '0px'
}

// Define color object type
type ColorValue = {
  type: 'color'
  value: string
}

// Helper to check if value is a Coral color object
const isCoralColor = (value: unknown): value is CoralColorType => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'hex' in value &&
    'rgb' in value &&
    'hsl' in value &&
    typeof (value as CoralColorType).hex === 'string'
  )
}

// Helper to check if value is a color object (legacy format or Coral format)
const isColorValue = (value: unknown): value is ColorValue | CoralColorType => {
  if (isCoralColor(value)) {
    return true
  }
  return typeof value === 'object' && value !== null && 'type' in value && (value as ColorValue).type === 'color'
}

// Helper to convert color object to CSS string
const colorToCSS = (color: unknown): string => {
  // Handle Coral color format
  if (isCoralColor(color)) {
    return color.hex
  }
  // Handle legacy color format
  if (isColorValue(color) && 'value' in color && typeof color.value === 'string') {
    return color.value
  }
  // Handle string colors
  if (typeof color === 'string') {
    return color
  }
  return 'transparent'
}

// Helper to convert style values to CSS strings
const styleValueToCSS = (value: unknown): string => {
  if (isDimension(value)) {
    return dimensionToCSS(value)
  }
  if (isColorValue(value)) {
    return colorToCSS(value)
  }
  if (typeof value === 'number') {
    return `${value}px`
  }
  if (typeof value === 'string') {
    return value
  }
  return String(value)
}

// Convert styles object to React style object
const convertStylesToReactStyle = (styles?: CoralStyleType): React.CSSProperties => {
  if (!styles) return {}

  const reactStyle: Record<string, string> = {}

  Object.entries(styles).forEach(([key, value]) => {
    // Skip nested objects (media queries, pseudo-selectors)
    if (typeof value === 'object' && !isDimension(value) && !isColorValue(value)) {
      return
    }

    reactStyle[key] = styleValueToCSS(value)
  })

  return reactStyle
}

// Extended node type with ID (from playground's element tree)
type NodeWithId = CoralNode & { id?: string }

// Recursively render node as React elements
const renderNode = (
  node: CoralNode,
  onElementClick: ((id: string) => void) | undefined,
  selectedElementId: string | null | undefined,
): React.ReactElement => {
  const nodeWithId = node as NodeWithId
  const nodeId = nodeWithId.id
  const isSelected = nodeId === selectedElementId

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onElementClick && nodeId) {
      onElementClick(nodeId)
    }
  }

  const style = convertStylesToReactStyle(node.styles)
  const className = isSelected ? 'coral-selected' : undefined

  const Element = node.elementType as keyof JSX.IntrinsicElements

  const children = node.children
    ? (node.children as CoralNode[]).map((child, index) => {
        const childWithId = child as NodeWithId
        const childId = childWithId.id || `${nodeId}-${index}`
        return <div key={childId}>{renderNode(child, onElementClick, selectedElementId)}</div>
      })
    : null

  return (
    <Element
      style={style}
      className={className}
      onClick={handleClick}
      {...(node.elementAttributes as Record<string, string | number | boolean>)}
      data-element-id={nodeId}
    >
      {node.textContent}
      {children}
    </Element>
  )
}

export const HTMLRenderer = ({ spec, onElementClick, selectedElementId, viewportWidth }: HTMLRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-white dark:bg-neutral-950 border border-input p-4 rounded-xl"
    >
      <style>
        {`
          .coral-selected {
            outline: 2px dashed #3b82f6 !important;
            outline-offset: 2px;
          }
        `}
      </style>
      <div style={{ maxWidth: viewportWidth, margin: '0 auto' }}>
        {spec && spec.name ? renderNode(spec, onElementClick, selectedElementId) : null}
      </div>
    </div>
  )
}
