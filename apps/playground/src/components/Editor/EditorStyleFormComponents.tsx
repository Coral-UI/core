import { Input } from '@/components/FormComponents/Input'
import { InputWithOptions } from '@/components/FormComponents/InputWithOptions'
import { Select } from '@/components/FormComponents/Select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { ChevronRight } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { StyleFormComponents, StyleFormSchema } from './EditorStyleFormStructure'

export const EditorStyleFormComponents = ({
  form,
  components,
}: {
  form: UseFormReturn<StyleFormSchema>
  components: typeof StyleFormComponents
}) => {
  const shouldShowComponent = (formComponent: any) => {
    if (formComponent.showWhen) {
      const fieldValue = form.watch(formComponent.showWhen.field)
      return formComponent.showWhen.values.includes(fieldValue)
    }
    return true
  }

  const renderFormComponent = (formComponent: any) => {
    if (!shouldShowComponent(formComponent)) {
      return null
    }

    switch (formComponent.type) {
      case 'inputWithOptions':
        return (
          <InputWithOptions
            key={formComponent.name}
            inputName={formComponent.name}
            inputLabel={formComponent.label}
            inputPlaceholder={formComponent.placeholder || ''}
            selectName={formComponent.selectName}
            selectLabel={formComponent.selectLabel}
            selectPlaceholder={formComponent.options?.[0]?.value || ''}
            options={formComponent.options || []}
            form={form}
            inputType={formComponent.inputType}
            icon={formComponent.icon}
            iconClassName={formComponent.iconClassName}
            hideLabel={true}
          />
        )
      case 'input':
        return (
          <Input
            key={formComponent.name}
            name={formComponent.name}
            label={formComponent.label}
            placeholder={formComponent.placeholder || ''}
            form={form}
            type={
              formComponent.inputType as 'number' | 'text' | 'email' | 'password' | 'url' | 'search' | 'color'
            }
            icon={formComponent.icon}
            iconClassName={formComponent.iconClassName}
            hideLabel={true}
          />
        )
      case 'select':
        return (
          <Select
            key={formComponent.name}
            name={formComponent.name}
            label={formComponent.label}
            placeholder={formComponent.placeholder || ''}
            options={formComponent.options || []}
            form={form}
            icon={formComponent.icon}
            iconClassName={formComponent.iconClassName}
            hideLabel={true}
          />
        )
      default:
        return null
    }
  }

  const formComponents = components.map((component) => {
    return (
      <Collapsible key={component.label} className="w-full border-b border-border">
        <CollapsibleTrigger className="group flex w-full items-center gap-2 text-xs py-2  transition-colors justify-between">
          {component.label}
          <ChevronRight className="size-4 transition-transform group-data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4">
          {component.groups ? (
            <div className="flex flex-col gap-6">
              {component.groups.map((group, idx) => {
                // Check if any component in the group should be visible
                const hasVisibleComponents = group.components.some((c) => shouldShowComponent(c))

                if (!hasVisibleComponents) {
                  return null
                }

                return (
                  <FieldSet key={idx}>
                    {group.legend && <FieldLegend variant="label">{group.legend}</FieldLegend>}
                    <FieldGroup className="gap-4">
                      {group.components.map((formComponent) => renderFormComponent(formComponent))}
                    </FieldGroup>
                  </FieldSet>
                )
              })}
            </div>
          ) : (
            <FieldGroup className="gap-4">
              {component.components?.map((formComponent) => renderFormComponent(formComponent))}
            </FieldGroup>
          )}
        </CollapsibleContent>
      </Collapsible>
    )
  })

  return <div className="flex flex-col gap-2">{formComponents}</div>
}
