import { PropertiesTab } from '@/components/Editor/Configuration/components/PropertiesTab'
import { StylesTab } from '@/components/Editor/Configuration/components/StylesTab'
import { EmptyEditorForm } from '@/components/Editor/Configuration/EditorFormEmpty'
import { StyleFormDefaultValues, StyleFormSchema } from '@/components/Editor/Configuration/EditorStyleFormStructure'
import { useBreakpointManager } from '@/components/Editor/Configuration/hooks/useBreakpointManager'
import { useElementAttributes } from '@/components/Editor/Configuration/hooks/useElementAttributes'
import { useStyleFormSync } from '@/components/Editor/Configuration/hooks/useStyleFormSync'
import { ElementPropertiesProps } from '@/components/Editor/Configuration/types/elementProperties'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ElementTreeNode } from '@/hooks/useElementTree'
import { IconIcons, IconSettings } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'

/**
 * Main component for editing element properties and styles
 * Provides tabbed interface for:
 * - Styles: Breakpoint management and style editing
 * - Properties: Basic properties and HTML attributes
 */
export const ElementProperties = ({ element, onUpdateElement }: ElementPropertiesProps) => {
  const styleForm = useForm<StyleFormSchema>({
    defaultValues: StyleFormDefaultValues,
  })

  // Shared update handler
  const handleUpdateProperty = (property: keyof ElementTreeNode, value: unknown) => {
    if (!element) return
    onUpdateElement(element.id, { [property]: value })
  }

  // Breakpoint management
  const { activeBreakpointId, breakpoints, handleAddBreakpoint, handleRemoveBreakpoint, handleSelectBreakpoint } =
    useBreakpointManager(element, handleUpdateProperty)

  // Style form synchronization
  const fieldStateHelpers = useStyleFormSync(element, activeBreakpointId, styleForm, handleUpdateProperty)

  // Element attributes management
  const {
    newAttrKey,
    setNewAttrKey,
    newAttrValue,
    setNewAttrValue,
    handleAddAttribute,
    handleRemoveAttribute,
    handleUpdateAttribute,
    handleRenameAttribute,
  } = useElementAttributes(element, handleUpdateProperty)

  if (!element) {
    return <EmptyEditorForm />
  }

  return (
    <Tabs defaultValue="styles" className="flex flex-col h-full">
      <div className="w-full border-b border-border shrink-0 p-2">
        <TabsList className="w-full">
          <TabsTrigger value="styles">
            <IconIcons /> Styles
          </TabsTrigger>
          <TabsTrigger value="properties">
            <IconSettings /> Properties
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="styles" className="flex-1 m-0 overflow-auto">
        <StylesTab
          styleForm={styleForm}
          breakpoints={breakpoints}
          activeBreakpointId={activeBreakpointId}
          onAddBreakpoint={handleAddBreakpoint}
          onRemoveBreakpoint={handleRemoveBreakpoint}
          onSelectBreakpoint={handleSelectBreakpoint}
          fieldStateHelpers={fieldStateHelpers}
        />
      </TabsContent>

      <TabsContent value="properties" className="flex-1 m-0 overflow-auto">
        <PropertiesTab
          element={element}
          updateProperty={handleUpdateProperty}
          onUpdateElement={onUpdateElement}
          newAttrKey={newAttrKey}
          setNewAttrKey={setNewAttrKey}
          newAttrValue={newAttrValue}
          setNewAttrValue={setNewAttrValue}
          onAddAttribute={handleAddAttribute}
          onRemoveAttribute={handleRemoveAttribute}
          onUpdateAttribute={handleUpdateAttribute}
          onRenameAttribute={handleRenameAttribute}
        />
      </TabsContent>
    </Tabs>
  )
}
