import { forwardRef, useEffect, useState } from 'react'

import type { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'
import { coralToHTML } from '@reallygoodwork/coral-to-html'

interface IframeRendererProps {
  spec: CoralRootNode
  selectedElementId: string | null | undefined
  viewportWidth: number
  onLoad?: () => void
}

// Extended node type with ID (from playground's element tree)
type NodeWithId = CoralNode & { id?: string }

/**
 * Recursively add data-element-id attributes to nodes for identification in the iframe
 * Preserves all existing properties including styles
 */
function addElementIds(node: CoralNode, parentId?: string, index?: number): CoralNode {
  const nodeWithId = node as NodeWithId
  const nodeId = nodeWithId.id || (parentId ? `${parentId}-${index}` : undefined)

  const updatedNode: CoralNode = {
    ...node,
    // Preserve styles
    styles: node.styles || {},
    // Preserve element attributes and add data-element-id
    elementAttributes: {
      ...(node.elementAttributes || {}),
      ...(nodeId ? { 'data-element-id': nodeId } : {}),
    },
    // Recursively process children
    children: node.children
      ? (node.children as CoralNode[]).map((child, idx) => addElementIds(child, nodeId, idx))
      : null,
  }

  return updatedNode
}

export const IframeRenderer = forwardRef<HTMLIFrameElement, IframeRendererProps>(
  ({ spec, viewportWidth, onLoad }, ref) => {
    const [htmlContent, setHtmlContent] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)

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
          // Add data-element-id attributes to all nodes
          const specWithIds = addElementIds(spec)
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
    }, [spec])

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
          * {
            box-sizing: border-box;
          }
          body {
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
