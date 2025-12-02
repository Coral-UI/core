import { DEFAULT_CSS_RESET } from '@/components/Editor/CssResetDialog'
import { useElementTreeQuery } from '@/hooks/useElementTreeQuery'
import { forwardRef, useEffect, useMemo, useState } from 'react'

import type { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'
import { coralToHTML } from '@reallygoodwork/coral-to-html'

import { generateBaseCSS, generateResponsiveCSS } from './utils/generateResponsiveCSS'

interface IframeRendererProps {
  spec: CoralRootNode
  selectedElementId: string | null | undefined
  viewportWidth: number
  cssReset?: string
  onLoad?: () => void
}

/**
 * Build a mapping from spec nodes to element IDs by traversing both tree structures in parallel
 */
function buildIdMapping(
  specNode: CoralRootNode,
  elementTreeNode: { id: string; children?: Array<{ id: string; children?: unknown[] }> },
  mapping: Map<CoralRootNode, string> = new Map(),
): Map<CoralRootNode, string> {
  // Map the current node
  mapping.set(specNode, elementTreeNode.id)

  // Process children recursively
  if (specNode.children && specNode.children.length > 0 && elementTreeNode.children) {
    for (let i = 0; i < specNode.children.length && i < elementTreeNode.children.length; i++) {
      const childSpec = specNode.children[i] as CoralRootNode
      const childElement = elementTreeNode.children[i]
      if (childElement) {
        buildIdMapping(childSpec, childElement, mapping)
      }
    }
  }

  return mapping
}

/**
 * Build ID mapping for the root spec and element tree
 */
function buildRootIdMapping(
  spec: CoralRootNode,
  elementTree: Array<{ id: string; children?: Array<{ id: string; children?: unknown[] }> }>,
): Map<CoralRootNode, string> {
  const mapping = new Map<CoralRootNode, string>()

  if (elementTree.length === 0) {
    return mapping
  }

  // Handle case where spec is a single root element
  if (elementTree.length === 1) {
    buildIdMapping(spec, elementTree[0]!, mapping)
  } else {
    // Handle case where spec has multiple root children
    // The spec itself doesn't have an ID, but its children do
    if (spec.children) {
      for (let i = 0; i < spec.children.length && i < elementTree.length; i++) {
        const childSpec = spec.children[i] as CoralRootNode
        const childElement = elementTree[i]
        if (childElement) {
          buildIdMapping(childSpec, childElement, mapping)
        }
      }
    }
  }

  return mapping
}

/**
 * Recursively add data-element-id attributes and class names to nodes for identification in the iframe
 * Removes inline styles since we're using CSS classes instead
 * Uses the element tree to get the correct IDs
 */
function addElementIds(
  node: CoralNode,
  idMapping: Map<CoralRootNode, string>,
  parentId?: string,
  index?: number,
): CoralNode {
  const nodeId = idMapping.get(node as CoralRootNode) || (parentId ? `${parentId}-${index}` : undefined)

  // Build class name from element ID
  const className = nodeId ? `coral-element-${nodeId}` : undefined

  // Combine existing class with new class name
  const existingClass = node.elementAttributes?.['class'] || node.elementAttributes?.className
  const classValue = className ? (existingClass ? `${existingClass} ${className}` : className) : existingClass

  const updatedNode: CoralNode = {
    ...node,
    // Remove inline styles - we'll use CSS classes instead
    styles: undefined,
    // Preserve element attributes and add data-element-id and class
    elementAttributes: {
      ...(node.elementAttributes || {}),
      ...(nodeId ? { 'data-element-id': nodeId } : {}),
      ...(classValue ? { class: classValue } : {}),
    },
    // Recursively process children
    children: node.children
      ? (node.children as CoralNode[]).map((child, idx) => addElementIds(child, idMapping, nodeId, idx))
      : null,
  }

  return updatedNode
}

export const IframeRenderer = forwardRef<HTMLIFrameElement, IframeRendererProps>(
  ({ spec, viewportWidth, cssReset, onLoad }, ref) => {
    const [htmlContent, setHtmlContent] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const { getElementTree, elements } = useElementTreeQuery()

    // Build ID mapping from element tree
    const idMapping = useMemo(() => {
      if (!spec || !spec.name) {
        return new Map<CoralRootNode, string>()
      }
      const elementTree = getElementTree()
      return buildRootIdMapping(spec, elementTree)
    }, [spec, getElementTree])

    // Generate base CSS and responsive CSS from element tree
    const baseCSS = useMemo(() => {
      const elementTree = getElementTree()
      return generateBaseCSS(elementTree)
    }, [elements, getElementTree])

    const responsiveCSS = useMemo(() => {
      const elementTree = getElementTree()
      return generateResponsiveCSS(elementTree)
    }, [elements, getElementTree])

    // Generate HTML with element IDs when spec changes
    useEffect(() => {
      if (!spec || !spec.name) {
        setHtmlContent('')
        setIsLoading(false)
        return
      }

      const generateHTML = async () => {
        try {
          setIsLoading(true)
          // Add data-element-id attributes to all nodes using the ID mapping
          const specWithIds = addElementIds(spec, idMapping)
          const html = await coralToHTML(specWithIds)
          setHtmlContent(html)
        } catch (error) {
          console.error('Failed to generate HTML:', error)
          setHtmlContent('')
        } finally {
          setIsLoading(false)
        }
      }

      generateHTML()
    }, [spec, idMapping])

    // Note: Selection styling is now handled by InteractionLayer overlays
    // No need to add styles to iframe content

    // Handle iframe load event
    const handleIframeLoad = () => {
      if (onLoad) {
        onLoad()
      }
    }

    // Create full HTML document with styles
    const fullHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${cssReset || DEFAULT_CSS_RESET ? `/* CSS Reset */\n${cssReset || DEFAULT_CSS_RESET}\n\n` : ''}
          body {
            background-color: transparent;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .coral-container {
            max-width: ${viewportWidth}px;
            margin: 0 auto;
            padding: 1rem;
          }
          ${baseCSS ? `/* Base Styles */\n${baseCSS}\n\n` : ''}
          ${responsiveCSS ? `/* Responsive Styles */\n${responsiveCSS}` : ''}
        </style>
      </head>
      <body>
        <div class="coral-container">
          ${htmlContent}
        </div>
      </body>
    </html>
  `

    if (isLoading) {
      return null
    }

    return (
      <iframe
        ref={ref}
        srcDoc={fullHTML}
        className="w-full h-full border-0"
        style={{ pointerEvents: 'none', position: 'relative', zIndex: 1 }}
        onLoad={handleIframeLoad}
        sandbox="allow-same-origin"
        title="Coral UI Preview"
      />
    )
  },
)

IframeRenderer.displayName = 'IframeRenderer'
