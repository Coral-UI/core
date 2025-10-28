import { StyleFormSchema } from '@/components/Editor/Configuration/EditorStyleFormStructure'
import { Color } from '@/components/FormComponents/Color'
import { Input } from '@/components/FormComponents/Input'
import { InputWithOptions } from '@/components/FormComponents/InputWithOptions'
import { Select } from '@/components/FormComponents/Select'
import { Toggle } from '@/components/FormComponents/Toggle'
import { FieldGroup, FieldLegend } from '@/components/ui/field'
import { ChevronRight } from 'lucide-react'
import { FieldPath, UseFormReturn } from 'react-hook-form'

import type { FormComponent, GroupedComponent, StyleSection } from '../types'

export const EditorStyleFormComponents = ({
  form,
  components,
  isFieldSet,
  getInheritedFrom,
  onClearField,
}: {
  form: UseFormReturn<StyleFormSchema>
  components: StyleSection[]
  isFieldSet?: (fieldName: string) => boolean
  getInheritedFrom?: (fieldName: string) => string | undefined
  onClearField?: (fieldName: string) => void
}) => {
  const shouldShowComponent = (formComponent: FormComponent): boolean => {
    if (formComponent.showWhen) {
      const fieldValue = form.watch(formComponent.showWhen.field as FieldPath<StyleFormSchema>)
      // Type guard to ensure fieldValue is a string before checking includes
      return typeof fieldValue === 'string' && formComponent.showWhen.values.includes(fieldValue)
    }
    return true
  }

  const renderFormComponent = (formComponent: FormComponent) => {
    if (!shouldShowComponent(formComponent)) {
      return null
    }

    switch (formComponent.type) {
      case 'color':
        return (
          <Color
            form={form}
            key={formComponent.name}
            name={formComponent.name as FieldPath<StyleFormSchema>}
            label={formComponent.label}
            placeholder={formComponent.placeholder || ''}
            hideLabel={formComponent.hideLabel ?? false}
            isSet={isFieldSet?.(formComponent.name) ?? false}
            inheritedFrom={getInheritedFrom?.(formComponent.name)}
            onClear={onClearField ? () => onClearField(formComponent.name) : undefined}
          />
        )
      case 'inputWithOptions':
        return (
          <InputWithOptions
            key={formComponent.name}
            inputName={formComponent.name as FieldPath<StyleFormSchema>}
            inputLabel={formComponent.label}
            inputPlaceholder={formComponent.placeholder || ''}
            selectName={formComponent.selectName as FieldPath<StyleFormSchema>}
            selectLabel={formComponent.selectLabel}
            selectPlaceholder={formComponent.options?.[0]?.value || ''}
            options={formComponent.options.map((opt) => ({ label: String(opt.label), value: opt.value }))}
            form={form}
            inputType={formComponent.inputType}
            icon={formComponent.icon}
            iconClassName={formComponent.iconClassName ?? undefined}
            hideLabel={formComponent.hideLabel ?? false}
            isSet={isFieldSet?.(formComponent.name) ?? false}
            inheritedFrom={getInheritedFrom?.(formComponent.name)}
            onClear={onClearField ? () => onClearField(formComponent.name) : undefined}
          />
        )
      case 'input':
        return (
          <Input
            key={formComponent.name}
            name={formComponent.name as FieldPath<StyleFormSchema>}
            label={formComponent.label}
            placeholder={formComponent.placeholder || ''}
            form={form}
            type={formComponent.inputType as 'number' | 'text' | 'email' | 'password' | 'url' | 'search' | 'color'}
            icon={formComponent.icon}
            iconClassName={formComponent.iconClassName ?? undefined}
            hideLabel={formComponent.hideLabel ?? false}
            isSet={isFieldSet?.(formComponent.name) ?? false}
            inheritedFrom={getInheritedFrom?.(formComponent.name)}
            onClear={onClearField ? () => onClearField(formComponent.name) : undefined}
          />
        )
      case 'select':
        return (
          <Select
            key={formComponent.name}
            name={formComponent.name as FieldPath<StyleFormSchema>}
            label={formComponent.label}
            placeholder={formComponent.placeholder || ''}
            options={formComponent.options.map((opt) => ({ label: String(opt.label), value: opt.value }))}
            form={form}
            icon={formComponent.icon}
            iconClassName={formComponent.iconClassName ?? undefined}
            hideLabel={formComponent.hideLabel ?? false}
            isSet={isFieldSet?.(formComponent.name) ?? false}
            inheritedFrom={getInheritedFrom?.(formComponent.name)}
            onClear={onClearField ? () => onClearField(formComponent.name) : undefined}
          />
        )
      case 'toggle':
        return (
          <Toggle
            key={formComponent.name}
            name={formComponent.name as FieldPath<StyleFormSchema>}
            label={formComponent.label}
            options={formComponent.options}
            form={form}
            hideLabel={formComponent.hideLabel ?? false}
          />
        )
      default:
        return null
    }
  }

  const renderComponentOrGroup = (item: FormComponent | GroupedComponent) => {
    // Check if it's a GroupedComponent (has 'groups' property)
    if ('groups' in item) {
      const groupedItem = item as GroupedComponent
      return (
        <FieldGroup key={groupedItem.name}>
          {groupedItem.label && <FieldLegend variant="label">{groupedItem.label}</FieldLegend>}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
            {groupedItem.groups.map((group) => {
              return (
                <div key={group.name} className="col-span-1">
                  {renderFormComponent(group)}
                </div>
              )
            })}
          </div>
        </FieldGroup>
      )
    }
    // Otherwise it's a FormComponent
    const formItem = item as FormComponent
    return <div key={formItem.name}>{renderFormComponent(formItem)}</div>
  }

  const formComponents = components.map((component) => {
    return (
      <div key={component.label} className="w-full border-b border-border">
        <div className="group flex w-full items-center gap-2 text-xs font-medium tracking-tight py-3  transition-colors justify-between">
          {component.label}
          <ChevronRight className="size-4 transition-transform group-data-[state=open]:rotate-90" />
        </div>
        <div className="pb-4">
          <FieldGroup>{component.components?.map((item) => renderComponentOrGroup(item))}</FieldGroup>
        </div>
      </div>
    )
  })

  return <div className="flex flex-col h-full overflow-hidden">{formComponents}</div>
}
