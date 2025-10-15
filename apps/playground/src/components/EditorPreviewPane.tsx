import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MonacoEditor from '@monaco-editor/react'
import { EyeIcon, BracesIcon, CodeIcon, CopyIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { CoralRootNode } from '@reallygoodwork/coral-core'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Badge } from './ui/badge'
import { Pill } from './ui/pill'


const ElementPreviewRenderer = ({ element }: { element: any }) => {
  if (!element) return null

  const getElementStyles = (elementType: string, styles?: any) => {
    // When element has custom styles, use absolutely minimal classes to avoid conflicts
    if (styles && Object.keys(styles).length > 0) {
      return 'border border-dashed border-gray-300 m-1 transition-all' // No padding, background, or other conflicting styles
    }

    // Default generic styles when no custom styles are applied
    const baseStyles = 'border border-dashed border-gray-300 m-1 transition-all'
    switch (elementType) {
      case 'div':
      case 'section':
      case 'header':
      case 'footer':
      case 'main':
      case 'nav':
        return `${baseStyles} p-4 min-h-8 bg-gray-100`
      case 'h1':
        return `${baseStyles} p-2 text-2xl font-bold bg-gray-50`
      case 'h2':
        return `${baseStyles} p-2 text-xl font-semibold bg-gray-50`
      case 'h3':
        return `${baseStyles} p-2 text-lg font-medium bg-gray-50`
      case 'p':
      case 'span':
      case 'text':
        return `${baseStyles} p-2 bg-gray-50`
      case 'button':
        return `${baseStyles} p-2 bg-gray-100 rounded cursor-pointer`
      case 'input':
        return `${baseStyles} p-2 bg-gray-50 border-solid`
      case 'img':
        return `${baseStyles} w-24 h-16 bg-gray-100 flex items-center justify-center text-xs`
      case 'ul':
      case 'ol':
        return `${baseStyles} p-2 bg-gray-50`
      case 'li':
        return `${baseStyles} p-1 ml-4 bg-gray-50`
      default:
        return `${baseStyles} p-1 bg-gray-300`
    }
  }

  const getInlineStyles = (styles?: any) => {
    if (!styles || Object.keys(styles).length === 0) return {}

    const inlineStyles: React.CSSProperties = {}

    // Map coral styles to CSS properties with !important-like priority through inline styles
    if (styles.backgroundColor) inlineStyles.backgroundColor = styles.backgroundColor
    if (styles.color) inlineStyles.color = styles.color
    if (styles.padding) inlineStyles.padding = styles.padding
    if (styles.paddingTop) inlineStyles.paddingTop = styles.paddingTop
    if (styles.paddingRight) inlineStyles.paddingRight = styles.paddingRight
    if (styles.paddingBottom) inlineStyles.paddingBottom = styles.paddingBottom
    if (styles.paddingLeft) inlineStyles.paddingLeft = styles.paddingLeft
    if (styles.margin) inlineStyles.margin = styles.margin
    if (styles.marginTop) inlineStyles.marginTop = styles.marginTop
    if (styles.marginRight) inlineStyles.marginRight = styles.marginRight
    if (styles.marginBottom) inlineStyles.marginBottom = styles.marginBottom
    if (styles.marginLeft) inlineStyles.marginLeft = styles.marginLeft
    if (styles.width) inlineStyles.width = styles.width
    if (styles.height) inlineStyles.height = styles.height
    if (styles.minWidth) inlineStyles.minWidth = styles.minWidth
    if (styles.minHeight) inlineStyles.minHeight = styles.minHeight
    if (styles.maxWidth) inlineStyles.maxWidth = styles.maxWidth
    if (styles.maxHeight) inlineStyles.maxHeight = styles.maxHeight
    if (styles.fontSize) inlineStyles.fontSize = styles.fontSize
    if (styles.fontWeight) inlineStyles.fontWeight = styles.fontWeight
    if (styles.fontFamily) inlineStyles.fontFamily = styles.fontFamily
    if (styles.lineHeight) inlineStyles.lineHeight = styles.lineHeight
    if (styles.textAlign) inlineStyles.textAlign = styles.textAlign
    if (styles.borderRadius) inlineStyles.borderRadius = styles.borderRadius
    if (styles.border) inlineStyles.border = styles.border
    if (styles.borderTop) inlineStyles.borderTop = styles.borderTop
    if (styles.borderRight) inlineStyles.borderRight = styles.borderRight
    if (styles.borderBottom) inlineStyles.borderBottom = styles.borderBottom
    if (styles.borderLeft) inlineStyles.borderLeft = styles.borderLeft
    if (styles.borderWidth) inlineStyles.borderWidth = styles.borderWidth
    if (styles.borderStyle) inlineStyles.borderStyle = styles.borderStyle
    if (styles.borderColor) inlineStyles.borderColor = styles.borderColor
    if (styles.display) inlineStyles.display = styles.display
    if (styles.flexDirection) inlineStyles.flexDirection = styles.flexDirection
    if (styles.alignItems) inlineStyles.alignItems = styles.alignItems
    if (styles.justifyContent) inlineStyles.justifyContent = styles.justifyContent
    if (styles.gap) inlineStyles.gap = styles.gap
    if (styles.position) inlineStyles.position = styles.position
    if (styles.top) inlineStyles.top = styles.top
    if (styles.right) inlineStyles.right = styles.right
    if (styles.bottom) inlineStyles.bottom = styles.bottom
    if (styles.left) inlineStyles.left = styles.left
    if (styles.zIndex) inlineStyles.zIndex = styles.zIndex
    if (styles.opacity) inlineStyles.opacity = styles.opacity
    if (styles.transform) inlineStyles.transform = styles.transform
    if (styles.boxShadow) inlineStyles.boxShadow = styles.boxShadow

    return inlineStyles
  }

  const renderElement = (elem: any, depth = 0): JSX.Element => {
    const className = getElementStyles(elem.elementType, elem.styles)
    const inlineStyles = getInlineStyles(elem.styles)
    const hasChildren = elem.children && elem.children.length > 0
    const hasText = elem.textContent && elem.textContent.trim() !== ''

    // Combine preview positioning with user styles
    const combinedStyles = {
      marginLeft: `${depth * 8}px`,
      ...inlineStyles,
    }

    return (
      <div key={elem.id || `${elem.name}-${depth}`} className={className} style={combinedStyles}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs font-mono">{elem.elementType}</Badge>
          </div>
          {/* {elem.elementAttributes && Object.keys(elem.elementAttributes).length > 0 && (
            <span className="text-xs text-gray-400">{Object.keys(elem.elementAttributes).length} attrs</span>
          )} */}
        </div>

        {hasText && (
          <div
            className={`mb-2 ${
              elem.elementType === 'text' ? 'text-base text-gray-900 font-normal' : 'text-sm text-gray-700 italic'
            }`}
          >
            {elem.elementType === 'text' ? elem.textContent : `"${elem.textContent}"`}
          </div>
        )}


        {hasChildren && (
          <div>{elem.children.map((child: any) => renderElement(child, depth + 1))}</div>
        )}


      </div>
    )
  }

  return renderElement(element)
}

export const EditorPreviewPane = ({ spec }: { spec: CoralRootNode }) => {
  const [specValue, setSpecValue] = useState<string>('')

  useEffect(() => {
    setSpecValue(JSON.stringify(spec, null, 2))
  }, [spec])

  const handleSpecChange = (value: string | undefined) => {
    if (!value) return
    setSpecValue(value)
  }

  const handleCopySpec = () => {
    toast.success('Coral spec copied to clipboard')
    navigator.clipboard.writeText(specValue)
  }

  return (
    <Tabs defaultValue="preview" className="w-full h-full">
      <TabsList>
        <TabsTrigger value="preview">
          {' '}
          <EyeIcon className="size-3 text-muted-foreground" /> Visual Preview
        </TabsTrigger>
        <TabsTrigger value="spec">
          <BracesIcon className="size-3 text-muted-foreground" /> Coral Spec
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon className="size-3 text-muted-foreground" /> Generated Code
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="flex flex-col h-full w-full">
        <div className="h-full w-full overflow-auto p-4 bg-white">
          {spec && spec.name ? (
            <ElementPreviewRenderer element={spec} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-lg mb-2">No elements created yet</div>
                <div className="text-sm">Add elements using the sidebar to see a preview</div>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="spec" className="flex flex-col h-full w-full">
        <div className="h-full w-full relative">
          <MonacoEditor
            value={specValue}
            onChange={handleSpecChange}
            language={'json'}
            theme={'vs-light'}
            options={{
              minimap: {
                enabled: false,
              },
              lineNumbers: 'on',
              fontSize: 11,
              wordWrap: 'on',
              useTabStops: false,
              tabSize: 2,
              contextmenu: false,
              readOnly: true,
            }}
          />
            <Button variant="default" size="icon-lg" onClick={handleCopySpec} className="absolute bottom-4 right-4">
            <CopyIcon />
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="code" className="flex flex-col h-full w-full">
        <div className="p-4 text-center text-gray-500">Generated code output will be available here</div>
      </TabsContent>
    </Tabs>
  )
}
