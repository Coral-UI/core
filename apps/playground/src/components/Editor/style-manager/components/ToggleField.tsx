// import { IconRestore } from "@tabler/icons-react";
import { useFieldContext } from '@/components/Editor/style-manager/formContext'
import { Field, FieldControl } from '@/components/primitives/Field/Field'
import { ToggleGroup } from '@/components/primitives/ToggleGroup/toggle-group'

export const ToggleField = ({
  label,
  options,
}: {
  label: string
  options: { value: string; label: string; icon?: React.ReactNode; tooltip?: React.ReactNode }[]
}) => {
  const field = useFieldContext<string>()
  // const form = useFormContext();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  // Use isDefaultValue instead of isDirty for non-persistent dirty state
  // isDirty is persistent (once changed, stays dirty), but isDefaultValue changes when value matches default
  // const hasChanged = !field.state.meta.isDefaultValue;

  // Convert options format to items format expected by base/ToggleGroup
  const items = options.map((option) => ({
    ariaLabel: option.label,
    value: option.value,
    icon: option.icon ?? option.label,
    tooltip: option.tooltip,
  }))

  return (
    <fieldset data-invalid={isInvalid}>
      <Field label={label} error={isInvalid ? field.state.meta.errors : undefined}>
        <div className="" role="group">
          <FieldControl render={<input type="hidden" value={field.state.value} />} />
          <ToggleGroup
            className="w-full"
            value={field.state.value ? [field.state.value] : []}
            onValueChange={(value: string[] | string) => {
              // BaseUI ToggleGroup returns an array even in single mode
              // Extract the first (and only) value as a string
              const stringValue = Array.isArray(value) && value.length > 0 ? value[0] : ''
              field.handleChange(stringValue as string)
            }}
            items={items}
          />
        </div>
      </Field>
    </fieldset>
  )
}
