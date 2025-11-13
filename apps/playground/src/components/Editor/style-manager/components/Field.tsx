import { Field as BaseField } from '@base-ui-components/react/field'

export const FieldError = ({ errors }: { errors: string[] }) => {
  return (
    <BaseField.Error className="text-sm text-destructive" match="valueMissing">
      {errors.map((error) => (
        <div key={error}>{error}</div>
      ))}
    </BaseField.Error>
  )
}

export const FieldLabel = ({ label }: { label: string }) => {
  return <BaseField.Label className="label-sm ml-1.5 h-6 flex items-center">{label}</BaseField.Label>
}

export const FieldGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-7">{children}</div>
}
