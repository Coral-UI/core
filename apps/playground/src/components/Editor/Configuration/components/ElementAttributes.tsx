import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { Plus, Trash2 } from 'lucide-react'

interface ElementAttributesProps {
  element: ElementTreeNode
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
 * Component for managing HTML attributes on an element
 * Displays existing attributes and provides UI for adding/editing/removing them
 */
export const ElementAttributes = ({
  element,
  newAttrKey,
  setNewAttrKey,
  newAttrValue,
  setNewAttrValue,
  onAddAttribute,
  onRemoveAttribute,
  onUpdateAttribute,
  onRenameAttribute,
}: ElementAttributesProps) => {
  return (
    <>
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
                  if (newKey !== key) {
                    onRenameAttribute(key, newKey)
                  }
                }}
                className="text-xs h-8"
                placeholder="attribute"
              />
            </Field>
            <span className="text-xs text-muted-foreground">=</span>
            <Input
              value={String(value)}
              onChange={(e) => onUpdateAttribute(key, e.target.value)}
              className="text-xs h-8"
              placeholder="value"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onRemoveAttribute(key)}
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
          onClick={onAddAttribute}
          disabled={!newAttrKey.trim()}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </FieldGroup>
    </>
  )
}
