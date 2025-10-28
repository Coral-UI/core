import { Breakpoint, BreakpointManager } from '@/components/Editor/BreakpointManager/BreakpointManager'
import { EditorStyleFormComponents } from '@/components/Editor/Configuration/EditorStyleFormComponents'
import { StyleFormComponents, StyleFormSchema } from '@/components/Editor/Configuration/EditorStyleFormStructure'
import { FieldStateHelpers } from '@/components/Editor/Configuration/types/elementProperties'
import { Form } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'

interface StylesTabProps {
  styleForm: UseFormReturn<StyleFormSchema>
  breakpoints: Breakpoint[]
  activeBreakpointId: string | null
  onAddBreakpoint: (breakpoint: Omit<Breakpoint, 'id'>) => void
  onRemoveBreakpoint: (breakpointId: string) => void
  onSelectBreakpoint: (breakpointId: string | null) => void
  fieldStateHelpers: FieldStateHelpers
}

/**
 * Tab panel for element styles
 * Contains breakpoint manager and style form
 */
export const StylesTab = ({
  styleForm,
  breakpoints,
  activeBreakpointId,
  onAddBreakpoint,
  onRemoveBreakpoint,
  onSelectBreakpoint,
  fieldStateHelpers,
}: StylesTabProps) => {
  return (
    <div className="p-4 flex flex-col">
      <BreakpointManager
        breakpoints={breakpoints}
        onAddBreakpoint={onAddBreakpoint}
        onRemoveBreakpoint={onRemoveBreakpoint}
        activeBreakpointId={activeBreakpointId}
        onSelectBreakpoint={onSelectBreakpoint}
      />

      <Form {...styleForm}>
        <EditorStyleFormComponents
          form={styleForm}
          components={StyleFormComponents}
          isFieldSet={fieldStateHelpers.isFieldSet}
          getInheritedFrom={fieldStateHelpers.getInheritedFrom}
          onClearField={fieldStateHelpers.onClearField}
        />
      </Form>
    </div>
  )
}
