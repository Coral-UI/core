import type { CanvasElement } from '@/utils/coralToCanvas'
import { calculateLayout, getKonvaConfig } from '@/utils/coralToCanvas'
import Konva from 'konva'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Group, Layer, Rect, Stage, Text } from 'react-konva'
import { useWindowSize } from 'usehooks-ts'

import type { CoralRootNode } from '@reallygoodwork/coral-core'

interface CanvasRendererProps {
  spec: CoralRootNode
  onElementClick: ((elementId: string) => void) | undefined
  selectedElementId: string | null | undefined
  viewportWidth: number
}

const CanvasElement = ({
  element,
  isSelected,
  onClick,
  onDragEnd,
}: {
  element: CanvasElement
  isSelected: boolean
  onClick: ((id: string) => void) | undefined
  onDragEnd: ((id: string, x: number, y: number) => void) | undefined
}) => {
  const config = useMemo(() => getKonvaConfig(element), [element])
  const hasText = element.textContent && element.textContent.trim() !== ''
  const [isDragging, setIsDragging] = useState(false)

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    if (onClick) {
      onClick(element.id)
    }
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setIsDragging(false)
    if (onDragEnd) {
      const node = e.target
      onDragEnd(element.id, node.x(), node.y())
    }
  }

  return (
    <Group draggable={isSelected} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* Background rectangle (always render if there's a background color or border) */}
      <Rect
        x={config.x}
        y={config.y}
        width={config.width}
        height={config.height}
        fill={config.backgroundColor}
        stroke={config.borderWidth > 0 ? config.borderColor : undefined}
        strokeWidth={config.borderWidth}
        cornerRadius={config.borderRadius}
        opacity={isDragging ? 0.5 : config.opacity}
        onClick={handleClick}
        onTap={handleClick}
      />

      {/* Text content (if exists) - positioned inside padding */}
      {hasText && (
        <Text
          x={config.x + config.paddingLeft}
          y={config.y + config.paddingTop}
          width={config.width - config.paddingLeft - config.paddingRight}
          height={config.height - config.paddingTop - config.paddingBottom}
          text={config.text}
          fill={config.color}
          fontSize={config.fontSize}
          fontFamily={config.fontFamily}
          fontStyle={config.fontStyle}
          letterSpacing={config.letterSpacing}
          align={config.align}
          verticalAlign={config.verticalAlign}
          opacity={isDragging ? 0.5 : config.opacity}
          onClick={handleClick}
          onTap={handleClick}
          listening={false}
        />
      )}

      {/* Selection indicator with resize handles */}
      {isSelected && (
        <>
          <Rect
            x={element.x - 2}
            y={element.y - 2}
            width={element.width + 4}
            height={element.height + 4}
            stroke="#3b82f6"
            strokeWidth={2}
            listening={false}
            dash={[5, 5]}
          />
        </>
      )}

      {/* Render children */}
      {element.children &&
        element.children.map((child) => (
          <CanvasElement key={child.id} element={child} isSelected={false} onClick={onClick} onDragEnd={onDragEnd} />
        ))}
    </Group>
  )
}

export const CanvasRenderer = ({ spec, onElementClick, selectedElementId, viewportWidth }: CanvasRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: viewportWidth, height: 800 })
  const { width: windowWidth } = useWindowSize()

  // Update dimensions when container or viewport changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetHeight } = containerRef.current
        setDimensions({
          width: viewportWidth,
          height: Math.max(offsetHeight, 800),
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [viewportWidth])

  // Memoize layout calculation to prevent unnecessary recalculations
  const layout = useMemo(() => {
    if (spec && spec.name) {
      return calculateLayout(spec, 16, 16, viewportWidth - 32)
    }
    return null
  }, [spec, viewportWidth])

  const handleElementClick = (elementId: string) => {
    if (onElementClick) {
      onElementClick(elementId)
    }
  }

  const handleDragEnd = (elementId: string, x: number, y: number) => {
    // For now, just log the new position
    // In the future, this could update the element's position in the spec
    console.log(`Element ${elementId} moved to (${x}, ${y})`)
  }

  const stageWidth = dimensions.width > windowWidth - 640 ? windowWidth - 640 : dimensions.width

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden bg-white dark:bg-zinc-950"
      style={{ minHeight: '100vh' }}
    >
      <Stage width={stageWidth} height={dimensions.height}>
        <Layer>
          {/* Background */}
          <Rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="white" listening={false} />

          {/* Render elements */}
          {layout && (
            <CanvasElement
              element={layout}
              isSelected={layout.id === selectedElementId}
              onClick={handleElementClick}
              onDragEnd={handleDragEnd}
            />
          )}

          {/* Empty state */}
          {!layout && (
            <Text
              x={dimensions.width / 2 - 150}
              y={dimensions.height / 2 - 20}
              width={300}
              text="No elements created yet\nAdd elements using the sidebar"
              fontSize={16}
              fill="#9ca3af"
              align="center"
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}
