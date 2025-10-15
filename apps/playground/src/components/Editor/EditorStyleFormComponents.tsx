import { Input } from '@/components/FormComponents/Input'
import { InputWithOptions } from '@/components/FormComponents/InputWithOptions'
import { Select } from '@/components/FormComponents/Select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { UseFormReturn } from 'react-hook-form'

import { StyleFormComponents, StyleFormSchema } from './EditorStyleFormStructure'

export const EditorStyleFormComponents = ({
  form,
  components,
}: {
  form: UseFormReturn<StyleFormSchema>
  components: typeof StyleFormComponents
}) => {
  const formComponents = components.map((component) => {
    return (
      <Accordion key={component.label} type="multiple" className="w-full" defaultValue={[component.label]}>
        <AccordionItem value={component.label}>
          <AccordionTrigger
            className={cn(
              'text-xs font-mono uppercase tracking-wide tabular-nums px-4 py-2 border-border border bg-card hover:bg-muted rounded-t-sm',
              'data-[state=open]:rounded-b-none',
            )}
          >
            {component.label}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 border p-4 border-border bg-card rounded-b-sm border-t-0">
            {component.components.map((formComponent) => {
              switch (formComponent.type) {
                case 'inputWithOptions':
                  return (
                    <InputWithOptions
                      key={formComponent.name}
                      inputName={formComponent.name}
                      inputLabel={formComponent.label}
                      inputPlaceholder={formComponent.placeholder || ''}
                      selectName={formComponent.selectName}
                      selectLabel={formComponent.label}
                      selectPlaceholder={formComponent.options?.[0]?.value || ''}
                      options={formComponent.options || []}
                      form={form}
                      inputType={formComponent.inputType}
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
                    />
                  )
                default:
                  return null
              }
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  })

  return <div className="flex flex-col gap-4">{formComponents}</div>
}
