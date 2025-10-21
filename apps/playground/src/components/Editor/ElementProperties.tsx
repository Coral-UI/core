import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ElementTreeNode, ResponsiveStyle } from '@/hooks/useElementTree'
import { Icon123 } from '@tabler/icons-react'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { CoralElementType } from '@reallygoodwork/coral-core'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Breakpoint, BreakpointManager } from './BreakpointManager'
import { EmptyEditorForm } from './EditorFormEmpty'
import { EditorStyleFormComponents } from './EditorStyleFormComponents'
import { StyleFormComponents, StyleFormDefaultValues, StyleFormSchema } from './EditorStyleFormStructure'

const ELEMENT_TYPES: CoralElementType[] = [
  'div',
  'section',
  'header',
  'footer',
  'main',
  'nav',
  'article',
  'aside',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'text',
  'button',
  'input',
  'a',
  'img',
  'ul',
  'ol',
  'li',
  'form',
  'textarea',
  'select',
  'option',
  'table',
  'tr',
  'td',
  'th',
  'thead',
  'tbody',
  'tfoot',
  'caption',
  'time',
  'figure',
  'figcaption',
  'strong',
  'em',
  'code',
  'pre',
  'blockquote',
  'hr',
  'br',
  'label',
  'fieldset',
  'legend',
  'audio',
  'video',
  'source',
  'canvas',
  'svg',
  'circle',
  'rect',
  'path',
  'ellipse',
  'polygon',
  'line',
  'polyline',
  'g',
  'dl',
  'dt',
  'dd',
]

interface ElementPropertiesProps {
  element: ElementTreeNode | null
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
}

export const ElementProperties = ({ element, onUpdateElement }: ElementPropertiesProps) => {
  const [newAttrKey, setNewAttrKey] = useState('')
  const [newAttrValue, setNewAttrValue] = useState('')
  const [activeBreakpointId, setActiveBreakpointId] = useState<string | null>(null)

  const styleForm = useForm<StyleFormSchema>({
    defaultValues: StyleFormDefaultValues,
  })

  // Update form when element or active breakpoint changes
  useEffect(() => {
    const formValues = { ...StyleFormDefaultValues }

    // Load styles from the active breakpoint or base styles
    const stylesToLoad = activeBreakpointId
      ? element?.responsiveStyles?.find((rs) => rs.id === activeBreakpointId)?.styles
      : element?.styles

    if (stylesToLoad) {
      Object.keys(stylesToLoad).forEach((key) => {
        if (key in formValues) {
          ;(formValues as any)[key] = (stylesToLoad as any)[key]
        }
      })
    }

    styleForm.reset(formValues)
  }, [element, activeBreakpointId, styleForm])

  // Auto-apply styles on form change
  useEffect(() => {
    const subscription = styleForm.watch((values) => {
      if (!element) return

      // Only include values that differ from defaults
      const coralStyles: Record<string, unknown> = {}

      Object.entries(values).forEach(([key, value]) => {
        const defaultValue = StyleFormDefaultValues[key as keyof StyleFormSchema]

        // Only add to coral styles if the value differs from default
        const isDefault =
          value === defaultValue ||
          (value === '' && (defaultValue === '' || defaultValue === null || defaultValue === undefined)) ||
          (value === null && defaultValue === null) ||
          (value === undefined && defaultValue === undefined)

        if (!isDefault && value !== '' && value !== null && value !== undefined) {
          coralStyles[key] = value
        }
      })

      // Update either the breakpoint styles or base styles
      if (activeBreakpointId) {
        const updatedResponsiveStyles = (element.responsiveStyles || []).map((rs) =>
          rs.id === activeBreakpointId
            ? { ...rs, styles: Object.keys(coralStyles).length > 0 ? coralStyles : undefined }
            : rs,
        )
        handleUpdateProperty('responsiveStyles', updatedResponsiveStyles)
      } else {
        handleUpdateProperty('styles', Object.keys(coralStyles).length > 0 ? coralStyles : undefined)
      }
    })

    return () => subscription.unsubscribe()
  }, [element, activeBreakpointId, styleForm])

  if (!element) {
    return <EmptyEditorForm />
  }

  const handleUpdateProperty = (property: keyof ElementTreeNode, value: unknown) => {
    onUpdateElement(element.id, { [property]: value })
  }

  // Elements that support text content
  const TEXT_CAPABLE_ELEMENTS = ['text', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'button', 'a', 'label']

  const handleElementTypeChange = (newElementType: string) => {
    const updates: Partial<ElementTreeNode> = {
      elementType: newElementType as CoralElementType,
    }

    // If switching from a text-capable element to a non-text-capable one, clear textContent
    const wasTextCapable = element.elementType && TEXT_CAPABLE_ELEMENTS.includes(element.elementType)
    const isTextCapable = TEXT_CAPABLE_ELEMENTS.includes(newElementType)

    if (wasTextCapable && !isTextCapable && element.textContent) {
      updates.textContent = undefined
    }

    onUpdateElement(element.id, updates)
  }

  const handleAddAttribute = () => {
    if (!newAttrKey.trim()) return

    const currentAttributes = element.elementAttributes || {}
    const updatedAttributes = {
      ...currentAttributes,
      [newAttrKey]: newAttrValue,
    }

    handleUpdateProperty('elementAttributes', updatedAttributes)
    setNewAttrKey('')
    setNewAttrValue('')
  }

  const handleRemoveAttribute = (key: string) => {
    const currentAttributes = element.elementAttributes || {}
    const { [key]: removed, ...remaining } = currentAttributes
    handleUpdateProperty('elementAttributes', remaining)
  }

  const handleUpdateAttribute = (key: string, value: string) => {
    const currentAttributes = element.elementAttributes || {}
    const updatedAttributes = {
      ...currentAttributes,
      [key]: value,
    }
    handleUpdateProperty('elementAttributes', updatedAttributes)
  }

  const handleAddBreakpoint = (breakpoint: Omit<Breakpoint, 'id'>) => {
    const newBreakpoint: ResponsiveStyle = {
      type: breakpoint.type,
      value: breakpoint.value,
      label: breakpoint.label,
      styles: {},
    }

    const updatedResponsiveStyles = [...(element.responsiveStyles || []), newBreakpoint]
    handleUpdateProperty('responsiveStyles', updatedResponsiveStyles)

    // Auto-select the newly created breakpoint
    setActiveBreakpointId(newBreakpoint.id)
  }

  const handleRemoveBreakpoint = (breakpointId: string) => {
    const updatedResponsiveStyles = (element.responsiveStyles || []).filter((rs) => rs.id !== breakpointId)
    handleUpdateProperty('responsiveStyles', updatedResponsiveStyles.length > 0 ? updatedResponsiveStyles : undefined)

    // Clear selection if the active breakpoint was removed
    if (activeBreakpointId === breakpointId) {
      setActiveBreakpointId(null)
    }
  }

  const handleSelectBreakpoint = (breakpointId: string | null) => {
    setActiveBreakpointId(breakpointId)
  }

  // Convert ResponsiveStyle to Breakpoint format for the UI
  const breakpoints: Breakpoint[] = (element.responsiveStyles || []).map((rs) => ({
    id: rs.id,
    type: rs.type,
    value: rs.value,
    label: rs.label ?? undefined,
  }))

  return (
    <Tabs defaultValue="styles" className="flex flex-col h-full">
      <div className="w-full border-b border-border px-4 py-2 shrink-0">
        <TabsList>
          <TabsTrigger value="styles">
            <Icon123 /> Styles
          </TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="styles" className="flex-1 m-0 overflow-y-auto">
        <div className="p-4 flex flex-col">
          <BreakpointManager
            breakpoints={breakpoints}
            onAddBreakpoint={handleAddBreakpoint}
            onRemoveBreakpoint={handleRemoveBreakpoint}
            activeBreakpointId={activeBreakpointId}
            onSelectBreakpoint={handleSelectBreakpoint}
          />




          <Form {...styleForm}>
            <EditorStyleFormComponents form={styleForm} components={StyleFormComponents} />
          </Form>
        </div>
      </TabsContent>

      <TabsContent value="properties" className="flex-1 m-0 overflow-y-auto">
        <div className="border-b border-border py-4">
          <FieldSet>
            <FieldLegend variant="label">Element Properties</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="element-name" className="text-xs">
                  Name
                </FieldLabel>
                <Input
                  id="element-name"
                  value={element.name}
                  onChange={(e) => handleUpdateProperty('name', e.target.value)}
                  placeholder="Element name"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="element-type">Element Type</FieldLabel>
                <Select value={element.elementType} onValueChange={handleElementTypeChange}>
                  <SelectTrigger id="element-type">
                    <SelectValue placeholder="Select element type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ELEMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {element.elementType === 'text' ||
              ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'button'].includes(element.elementType) ? (
                <div>
                  <Label htmlFor="text-content" className="text-xs font-medium">
                    {element.elementType === 'text' ? 'Text Content' : `${element.elementType.toUpperCase()} Content`}
                    {element.elementType === 'text' && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Textarea
                    id="text-content"
                    value={element.textContent || ''}
                    onChange={(e) => handleUpdateProperty('textContent', e.target.value)}
                    className="mt-1"
                    placeholder={
                      element.elementType === 'text'
                        ? 'Enter the text content to display...'
                        : `Enter ${element.elementType} content...`
                    }
                    rows={element.elementType === 'text' ? 4 : 3}
                  />
                  {element.elementType === 'text' && !element.textContent?.trim() && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Text elements require content to display properly
                    </p>
                  )}
                </div>
              ) : null}

              <Field>
                <FieldLabel htmlFor="description" className="text-xs">
                  Description
                </FieldLabel>
                <Textarea
                  id="description"
                  value={element.description || ''}
                  onChange={(e) => handleUpdateProperty('description', e.target.value)}
                  placeholder="Element description"
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>

        <div className="border-b border-border py-4">
          <FieldSet>
            <FieldLegend variant="label">HTML Attributes</FieldLegend>
            <FieldGroup>
              {Object.entries(element.elementAttributes || {}).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Field orientation="horizontal">
                    <FieldLabel htmlFor={key} className="text-xs">
                      {key}
                    </FieldLabel>
                    <Input
                      id={key}
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value
                        const currentAttributes = element.elementAttributes || {}
                        const { [key]: oldValue, ...remaining } = currentAttributes
                        const updatedAttributes = {
                          ...remaining,
                          [newKey]: value,
                        }
                        handleUpdateProperty('elementAttributes', updatedAttributes)
                      }}
                      className="text-xs h-8"
                      placeholder="attribute"
                    />
                  </Field>
                  <span className="text-xs text-muted-foreground">=</span>
                  <Input
                    value={String(value)}
                    onChange={(e) => handleUpdateAttribute(key, e.target.value)}
                    className="text-xs h-8"
                    placeholder="value"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveAttribute(key)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </FieldGroup>

            <FieldGroup className="flex flex-row items-center gap-2">
              <Field>
                <FieldLabel htmlFor="new-attr-key" className="text-xs">
                  Attribute Name
                </FieldLabel>
                <Input
                  id="new-attr-key"
                  value={newAttrKey}
                  onChange={(e) => setNewAttrKey(e.target.value)}
                  className="text-xs h-8"
                  placeholder="attribute name"
                />
              </Field>
              <span className="text-xs text-muted-foreground">=</span>
              <Field>
                <FieldLabel htmlFor="new-attr-value" className="text-xs">
                  Attribute Value
                </FieldLabel>
                <Input
                  id="new-attr-value"
                  value={newAttrValue}
                  onChange={(e) => setNewAttrValue(e.target.value)}
                  className="text-xs h-8"
                  placeholder="value"
                />
              </Field>
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleAddAttribute}
                disabled={!newAttrKey.trim()}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </FieldGroup>
          </FieldSet>
        </div>
      </TabsContent>
    </Tabs>
  )
}
