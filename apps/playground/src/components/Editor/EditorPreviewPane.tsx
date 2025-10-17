import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResponsiveStyle } from '@/hooks/useElementTree'
import MonacoEditor from '@monaco-editor/react'
import { BracesIcon, CodeIcon, CopyIcon, EyeIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { CoralRootNode } from '@reallygoodwork/coral-core'
import { useTheme } from '@/components/ThemeProvider'
import { IconBracketsAngle, IconEyeSearch, IconSchema } from '@tabler/icons-react'

const generateResponsiveStyles = (elementId: string, responsiveStyles?: ResponsiveStyle[]): string => {
  if (!responsiveStyles || responsiveStyles.length === 0) return ''

  let css = ''
  responsiveStyles.forEach((rs) => {
    const mediaQuery = `@media (${rs.type}: ${rs.value})`
    const selector = `[data-element-id="${elementId}"]`

    if (rs.styles && Object.keys(rs.styles).length > 0) {
      const styleDeclarations = Object.entries(rs.styles)
        .map(([key, value]) => {
          // Convert camelCase to kebab-case
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
          return `  ${cssKey}: ${value};`
        })
        .join('\n')

      css += `
${mediaQuery} {
  ${selector} {
${styleDeclarations}
  }
}
`
    }
  })

  return css
}

const ElementPreviewRenderer = ({
  element,
  onElementClick,
  selectedElementId,
}: {
  element: any
  onElementClick?: (elementId: string) => void
  selectedElementId?: string | null
}) => {
  if (!element) return null

  // Generate all responsive styles for all elements in the tree
  const [responsiveCSS, setResponsiveCSS] = useState('')

  useEffect(() => {
    const collectResponsiveStyles = (elem: any): string => {
      let css = generateResponsiveStyles(elem.id, elem.responsiveStyles)

      if (elem.children && Array.isArray(elem.children)) {
        elem.children.forEach((child: any) => {
          css += collectResponsiveStyles(child)
        })
      }

      return css
    }

    setResponsiveCSS(collectResponsiveStyles(element))
  }, [element])

  const getElementStyles = (elementType: string, styles?: any, isSelected?: boolean) => {
    // When element has custom styles, use absolutely minimal classes to avoid conflicts
    if (styles && Object.keys(styles).length > 0) {
      return `border border-dashed m-1 transition-all cursor-pointer hover:border-blue-400 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
      }` // No padding, background, or other conflicting styles
    }

    // Default generic styles when no custom styles are applied
    const baseStyles = `border border-dashed m-1 transition-all cursor-pointer hover:border-blue-400 ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
    }`
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
    const isSelected = elem.id === selectedElementId
    const className = getElementStyles(elem.elementType, elem.styles, isSelected)
    const inlineStyles = getInlineStyles(elem.styles)
    const hasChildren = elem.children && elem.children.length > 0
    const hasText = elem.textContent && elem.textContent.trim() !== ''

    // Combine preview positioning with user styles
    const combinedStyles = {
      marginLeft: `${depth * 8}px`,
      ...inlineStyles,
    }

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onElementClick) {
        onElementClick(elem.id)
      }
    }

    return (
      <div className="relative" key={elem.id || `${elem.name}-${depth}`}>
        {/* Informational badges - positioned absolutely so they don't affect layout */}
        <div className="absolute -top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
          <Badge variant="default" className="text-xs font-mono shadow-sm">
            {elem.elementType}
          </Badge>
          {elem.responsiveStyles && elem.responsiveStyles.length > 0 && (
            <Badge variant="outline" className="text-xs shadow-sm bg-background">
              {elem.responsiveStyles.length} breakpoint{elem.responsiveStyles.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Actual element preview */}
        <div
          className={className}
          style={combinedStyles}
          data-element-id={elem.id}
          onClick={handleClick}
        >
          {hasText && (
            <div
              className={`mb-2 ${
                elem.elementType === 'text' ? 'text-base text-gray-900 font-normal' : 'text-sm text-gray-700 italic'
              }`}
            >
              {elem.elementType === 'text' ? elem.textContent : `"${elem.textContent}"`}
            </div>
          )}

          {hasChildren && <div>{elem.children.map((child: any) => renderElement(child, depth + 1))}</div>}
        </div>
      </div>
    )
  }

  return (
    <>
      {responsiveCSS && <style>{responsiveCSS}</style>}
      {renderElement(element)}
    </>
  )
}

export const EditorPreviewPane = ({
  spec,
  onElementClick,
  selectedElementId,
}: {
  spec: CoralRootNode
  onElementClick?: (elementId: string) => void
  selectedElementId?: string | null
}) => {
  const { theme } = useTheme()
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
          <IconEyeSearch strokeWidth={1.5} className="size-4 text-muted-foreground" /> Visual Preview
        </TabsTrigger>
        <TabsTrigger value="spec">
          <IconSchema strokeWidth={1.5} className="size-4 text-muted-foreground" /> Coral Spec
        </TabsTrigger>
        <TabsTrigger value="code">
          <IconBracketsAngle strokeWidth={1.5} className="size-4 text-muted-foreground" /> Generated Code
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="flex flex-col h-full w-full">
        <div className="h-full w-full overflow-auto p-4 bg-muted rounded-sm">
          {spec && spec.name ? (
            <ElementPreviewRenderer
              element={spec}
              onElementClick={onElementClick}
              selectedElementId={selectedElementId}
            />
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
            theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
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
