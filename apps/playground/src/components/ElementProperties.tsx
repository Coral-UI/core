import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { CoralElementType } from '@reallygoodwork/coral-core'

import { EditorStyleFormComponents } from './Editor/EditorStyleFormComponents'
import { StyleFormComponents, StyleFormDefaultValues, StyleFormSchema } from './Editor/EditorStyleFormStructure'

import { Combobox } from './ui/combobox'

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

  const styleForm = useForm<StyleFormSchema>({
    defaultValues: StyleFormDefaultValues,
  })

  // Update form when element changes
  useEffect(() => {
    if (element?.styles) {
      // Convert coral styles to form values
      const formValues = { ...StyleFormDefaultValues }

      // Map coral styles to form structure - this will need to be customized based on your style structure
      if (element.styles) {
        // Example mapping - adjust based on your actual style structure
        Object.keys(element.styles).forEach((key) => {
          if (key in formValues) {
            ;(formValues as any)[key] = (element.styles as any)[key]
          }
        })
      }

      styleForm.reset(formValues)
    } else {
      styleForm.reset(StyleFormDefaultValues)
    }
  }, [element, styleForm])

  if (!element) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Select an element to edit its properties</div>
  }

  const handleUpdateProperty = (property: keyof ElementTreeNode, value: unknown) => {
    onUpdateElement(element.id, { [property]: value })
  }

  const handleStyleSubmit = (values: StyleFormSchema) => {
    console.log('Style form submitted with values:', values)

    // Only include values that differ from defaults
    const coralStyles: Record<string, unknown> = {}

    Object.entries(values).forEach(([key, value]) => {
      const defaultValue = StyleFormDefaultValues[key as keyof StyleFormSchema]

      // Only add to coral styles if the value differs from default
      // Handle various comparison cases (empty strings, null, undefined, etc.)
      const isDefault =
        value === defaultValue ||
        (value === '' && (defaultValue === '' || defaultValue === null || defaultValue === undefined)) ||
        (value === null && defaultValue === null) ||
        (value === undefined && defaultValue === undefined)

      if (!isDefault && value !== '' && value !== null && value !== undefined) {
        coralStyles[key] = value
      }
    })

    console.log('Converted to coral styles (changed values only):', coralStyles)
    console.log('Updating element:', element?.id)

    handleUpdateProperty('styles', Object.keys(coralStyles).length > 0 ? coralStyles : undefined)
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

  return (
    <div className="p-4 space-y-6 h-full overflow-auto">
      <div>
        <h3 className="text-sm font-medium mb-4">Element Properties</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="element-name" className="text-xs">
              Name
            </Label>
            <Input
              id="element-name"
              value={element.name}
              onChange={(e) => handleUpdateProperty('name', e.target.value)}
              className="mt-1"
              placeholder="Element name"
            />
          </div>

          <div>
            <Label htmlFor="element-type" className="text-xs">
              Element Type
            </Label>
            <Combobox
              options={ELEMENT_TYPES.map((type) => ({ value: type, label: type }))}
              value={element.elementType}
              onChange={(value) => handleUpdateProperty('elementType', value)}
              label="Element Type"
              placeholder="Select element type"
              noneFoundLabel="No element types found"
            />
          </div>

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
                <p className="text-xs text-muted-foreground mt-1">Text elements require content to display properly</p>
              )}
            </div>
          ) : null}

          <div>
            <Label htmlFor="description" className="text-xs">
              Description
            </Label>
            <Textarea
              id="description"
              value={element.description || ''}
              onChange={(e) => handleUpdateProperty('description', e.target.value)}
              className="mt-1"
              placeholder="Element description"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div>
        <Collapsible>
          <CollapsibleTrigger className="group flex items-center gap-2">
            <p className="text-sm font-semibold">HTML Attributes</p>
            <ChevronRight className="size-4 group-data-[state=open]:rotate-90" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <FieldSet>
              <FieldGroup>
                <div className="space-y-2">
                  {Object.entries(element.elementAttributes || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Field>
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
                </div>
              </FieldGroup>

              <FieldGroup>
                <div className="flex items-center gap-2">
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
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleAddAttribute}
                    disabled={!newAttrKey.trim()}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-4">Element Styles</h3>
        <Form {...styleForm}>
          <form onSubmit={styleForm.handleSubmit(handleStyleSubmit)} className="space-y-4">
            <EditorStyleFormComponents form={styleForm} components={StyleFormComponents} />
            <Button type="submit" size="sm" className="w-full">
              Apply Styles
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-medium">Element Info</Label>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>
            ID: <code className="bg-muted px-1 rounded">{element.id}</code>
          </div>
          <div>
            Type:{' '}
            <Badge variant="outline" className="text-xs">
              {element.type}
            </Badge>
          </div>
          {element.parentId && (
            <div>
              Parent: <code className="bg-muted px-1 rounded">{element.parentId}</code>
            </div>
          )}
          <div>Children: {element.children?.length || 0}</div>
          {element.styles && (
            <div>
              <span className="text-green-600">✓ Styled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
