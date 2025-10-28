import { useEffect, useRef, useState } from 'react'

import type { CoralNode, CoralRootNode, CoralStyleType, Dimension } from '@reallygoodwork/coral-core'

interface HTMLRendererProps {
  spec: CoralRootNode
  onElementClick: ((elementId: string) => void) | undefined
  selectedElementId: string | null | undefined
  viewportWidth: number
}

// Helper to check if value is a dimension object
const isDimension = (value: unknown): value is { value: number; unit: string } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value &&
    typeof (value as any).value === 'number' &&
    typeof (value as any).unit === 'string'
  )
}

// Helper to convert dimension to CSS string
const dimensionToCSS = (dimension: Dimension | number): string => {
  if (typeof dimension === 'number') {
    return `${dimension}px`
  }
  return `${dimension.value}${dimension.unit}`
}

// Helper to convert color object to CSS string
const colorToCSS = (color: any): string => {
  if (typeof color === 'object' && color !== null && 'type' in color && color.type === 'color' && color.value) {
    return color.value
  }
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
  if (typeof value === 'object' && value !== null && 'type' in value && (value as any).type === 'color') {
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

  const reactStyle: any = {}

  Object.entries(styles).forEach(([key, value]) => {
    // Skip nested objects (media queries, pseudo-selectors)
    if (typeof value === 'object' && !isDimension(value) && !(value as any)?.type) {
      return
    }

    reactStyle[key] = styleValueToCSS(value)
  })

  return reactStyle
}

// Recursively render node as React elements
const renderNode = (
  node: CoralNode,
  onElementClick: ((id: string) => void) | undefined,
  selectedElementId: string | null | undefined,
): React.ReactElement => {
  const nodeId = (node as any).id
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
        const childId = (child as any).id || `${nodeId}-${index}`
        return <div key={childId}>{renderNode(child, onElementClick, selectedElementId)}</div>
      })
    : null

  return (
    <Element
      style={style}
      className={className}
      onClick={handleClick}
      {...(node.elementAttributes as any)}
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
