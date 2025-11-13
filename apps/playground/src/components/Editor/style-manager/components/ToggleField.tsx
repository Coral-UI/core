// import { IconRestore } from "@tabler/icons-react";
import { ToggleGroup } from '@/components/Editor/style-manager/components/ToggleGroup'
import { useFieldContext } from '@/components/Editor/style-manager/formContext'

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
      <legend className="label-sm ml-1.5 h-6 flex items-center">{label}</legend>
      <div className="w-full bg-interactive-bg-primary rounded-input" role="group">
        <ToggleGroup
          className="w-full"
          value={field.state.value ? [field.state.value] : []}
          onValueChange={(value) => {
            // BaseUI ToggleGroup returns an array even in single mode
            // Extract the first (and only) value as a string
            const stringValue = Array.isArray(value) && value.length > 0 ? value[0] : ''
            field.handleChange(stringValue)
          }}
          items={items}
        />
        {/* <InputGroupAddon align="inline-end">
          {hasChanged && (
            <InputGroupButton
              aria-label="Reset"
              variant="secondary"
              size="icon-xs"
              title="Reset"
              onClick={() => {
                // Get the default value from the form's defaultValues
                const defaultValue = form.options.defaultValues?.[field.name as keyof typeof form.options.defaultValues];
                if (defaultValue !== undefined) {
                  // Use resetField to properly reset the field value and metadata
                  // @ts-expect-error - field.name is a dynamic string key, but TypeScript can't infer the field type
                  form.resetField(field.name);
                  // Then set it to the default value to ensure it matches
                  // @ts-expect-error - field.name is a dynamic string key, but TypeScript can't infer the field type
                  form.setFieldValue(field.name, defaultValue);
                }
              }}
            >
              <IconRestore />
            </InputGroupButton>
          )}
        </InputGroupAddon> */}
      </div>
      {isInvalid && field.state.meta.errors && (
        <div className="text-sm text-destructive-fg mt-1 ml-1.5">
          {field.state.meta.errors.map((error, index) => {
            // Handle both string errors and Zod error objects
            const errorMessage = typeof error === 'string' ? error : error?.message || String(error)
            return <div key={index}>{errorMessage}</div>
          })}
        </div>
      )}
    </fieldset>
  )
}
