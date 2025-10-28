import { TEXT_CAPABLE_ELEMENTS } from '@/components/Editor/Configuration/constants/elementProperties'
import { ElementTypeCombobox } from '@/components/Editor/Configuration/ElementTypeCombobox'
import { UpdatePropertyFn } from '@/components/Editor/Configuration/types/elementProperties'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ElementTreeNode } from '@/hooks/useElementTree'

import { CoralElementType } from '@reallygoodwork/coral-core'

interface ElementBasicPropertiesProps {
  element: ElementTreeNode
  updateProperty: UpdatePropertyFn
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
}

/**
 * Component for editing basic element properties: name, type, text content, description
 */
export const ElementBasicProperties = ({ element, updateProperty, onUpdateElement }: ElementBasicPropertiesProps) => {
  const handleElementTypeChange = (newElementType: string) => {
    const updates: Partial<ElementTreeNode> = {
      elementType: newElementType as CoralElementType,
    }

    // If switching from a text-capable element to a non-text-capable one, clear textContent
    const wasTextCapable =
      element.elementType && (TEXT_CAPABLE_ELEMENTS as readonly string[]).includes(element.elementType)
    const isTextCapable = (TEXT_CAPABLE_ELEMENTS as readonly string[]).includes(newElementType)

    if (wasTextCapable && !isTextCapable && element.textContent) {
      updates.textContent = ''
    }

    onUpdateElement(element.id, updates)
  }

  const isTextCapable =
    element.elementType === 'text' ||
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'button'].includes(element.elementType)

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="element-name" className="text-xs">
          Name
        </FieldLabel>
        <Input
          id="element-name"
          value={element.name}
          onChange={(e) => updateProperty('name', e.target.value)}
          placeholder="Element name"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="element-type">Element Type</FieldLabel>
        <ElementTypeCombobox value={element.elementType} onChange={handleElementTypeChange} />
      </Field>

      {isTextCapable && (
        <div>
          <Label htmlFor="text-content" className="text-xs font-medium">
            {element.elementType === 'text' ? 'Text Content' : `${element.elementType.toUpperCase()} Content`}
            {element.elementType === 'text' && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            id="text-content"
            value={element.textContent || ''}
            onChange={(e) => updateProperty('textContent', e.target.value)}
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
      )}

      <Field>
        <FieldLabel htmlFor="description" className="text-xs">
          Description
        </FieldLabel>
        <Textarea
          id="description"
          value={element.description || ''}
          onChange={(e) => updateProperty('description', e.target.value)}
          placeholder="Element description"
          rows={2}
        />
      </Field>
    </FieldGroup>
  )
}
