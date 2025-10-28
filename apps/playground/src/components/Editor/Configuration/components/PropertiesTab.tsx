import { ElementAttributes } from '@/components/Editor/Configuration/components/ElementAttributes'
import { ElementBasicProperties } from '@/components/Editor/Configuration/components/ElementBasicProperties'
import { UpdatePropertyFn } from '@/components/Editor/Configuration/types/elementProperties'
import { FieldLegend, FieldSet } from '@/components/ui/field'
import { ElementTreeNode } from '@/hooks/useElementTree'

interface PropertiesTabProps {
  element: ElementTreeNode
  updateProperty: UpdatePropertyFn
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
  // Attribute management props
  newAttrKey: string
  setNewAttrKey: (value: string) => void
  newAttrValue: string
  setNewAttrValue: (value: string) => void
  onAddAttribute: () => void
  onRemoveAttribute: (key: string) => void
  onUpdateAttribute: (key: string, value: string) => void
  onRenameAttribute: (oldKey: string, newKey: string) => void
}

/**
 * Tab panel for element properties (non-style properties)
 * Contains basic properties and HTML attributes sections
 */
export const PropertiesTab = ({
  element,
  updateProperty,
  onUpdateElement,
  newAttrKey,
  setNewAttrKey,
  newAttrValue,
  setNewAttrValue,
  onAddAttribute,
  onRemoveAttribute,
  onUpdateAttribute,
  onRenameAttribute,
}: PropertiesTabProps) => {
  return (
    <>
      <div className="border-b border-border py-4">
        <FieldSet>
          <FieldLegend variant="label">Element Properties</FieldLegend>
          <ElementBasicProperties element={element} updateProperty={updateProperty} onUpdateElement={onUpdateElement} />
        </FieldSet>
      </div>

      <div className="border-b border-border py-4">
        <FieldSet>
          <FieldLegend variant="label">HTML Attributes</FieldLegend>
          <ElementAttributes
            element={element}
            newAttrKey={newAttrKey}
            setNewAttrKey={setNewAttrKey}
            newAttrValue={newAttrValue}
            setNewAttrValue={setNewAttrValue}
            onAddAttribute={onAddAttribute}
            onRemoveAttribute={onRemoveAttribute}
            onUpdateAttribute={onUpdateAttribute}
            onRenameAttribute={onRenameAttribute}
          />
        </FieldSet>
      </div>
    </>
  )
}
