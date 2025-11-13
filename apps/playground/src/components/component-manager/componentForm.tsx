import type { FormValues } from '@/components/component-manager/formSchema'
import { useAppForm } from '@/components/component-manager/formContext'
import { formSchema } from '@/components/component-manager/formSchema'
import { ELEMENT_TYPE_DEFINITIONS } from '@/utils/elementTypes'
import { useStore } from '@tanstack/react-form'
import { useEffect, useRef } from 'react'

export type ComponentFormProps = {
  /**
   * Callback function that receives the complete form values whenever they change.
   * The values are typed according to the form schema, ensuring type safety.
   */
  onChange?: (values: FormValues, changedFields?: Record<string, unknown>) => void
  /**
   * Initial values to populate the form with.
   * When provided, these values will override the default values.
   */
  initialValues?: Partial<FormValues>
}

export const ComponentForm = ({ onChange, initialValues }: ComponentFormProps = {}) => {
  // Track previous initialValues to avoid unnecessary updates
  const previousInitialValuesRef = useRef<string>()
  const isSyncingRef = useRef(false)
  const isFirstRender = useRef(true)
  // Track the previous form values to detect which field changed
  const previousFormValuesRef = useRef<FormValues | null>(null)

  const form = useAppForm({
    defaultValues: {
      name: '',
      description: undefined,
      type: 'div',
      textContent: undefined,
      ...initialValues,
    } as Partial<FormValues>,
    validators: {
      onChange: formSchema,
    },
  })

  // Sync initialValues when element changes (detected by comparing serialized initialValues)
  useEffect(() => {
    if (!initialValues) {
      previousInitialValuesRef.current = undefined
      if (!isFirstRender.current) {
        isSyncingRef.current = true
        form.reset({
          name: '',
          description: undefined,
          type: 'div',
          textContent: undefined,
        } as Partial<FormValues>)
        setTimeout(() => {
          isSyncingRef.current = false
        }, 0)
      }
      return
    }

    const currentInitialValuesString = JSON.stringify(initialValues)

    // Sync when element changes (initialValues content changes)
    if (previousInitialValuesRef.current !== currentInitialValuesString) {
      isSyncingRef.current = true
      previousInitialValuesRef.current = currentInitialValuesString

      // Reset form with new initial values
      const mergedValues = {
        name: '',
        description: undefined,
        type: 'div',
        textContent: undefined,
        ...initialValues,
      } as FormValues
      form.reset(mergedValues)

      // Initialize previousFormValuesRef with current form values
      previousFormValuesRef.current = mergedValues

      setTimeout(() => {
        isSyncingRef.current = false
      }, 0)

      if (isFirstRender.current) {
        isFirstRender.current = false
      }
    }
  }, [initialValues, form])

  // Subscribe to form values and call onChange whenever they change
  const formValues = useStore(form.store, (state) => state.values)

  // Initialize previousFormValuesRef on first render if not already set
  useEffect(() => {
    if (previousFormValuesRef.current === null) {
      previousFormValuesRef.current = formValues as FormValues
    }
  }, [formValues])

  // Detect which fields changed and call onChange
  useEffect(() => {
    if (isSyncingRef.current || !onChange || !previousFormValuesRef.current) {
      return
    }

    const currentValues = formValues as FormValues
    const previousValues = previousFormValuesRef.current

    // Find changed fields
    const changedFields: Record<string, unknown> = {}
    let hasChanges = false

    if (currentValues['name'] !== previousValues['name']) {
      changedFields['name'] = currentValues['name']
      hasChanges = true
    }
    if (currentValues['description'] !== previousValues['description']) {
      changedFields['description'] = currentValues['description']
      hasChanges = true
    }
    if (currentValues['type'] !== previousValues['type']) {
      changedFields['type'] = currentValues['type']
      hasChanges = true
    }
    if (currentValues['textContent'] !== previousValues['textContent']) {
      changedFields['textContent'] = currentValues['textContent']
      hasChanges = true
    }

    if (hasChanges) {
      onChange(currentValues, changedFields)
      previousFormValuesRef.current = currentValues
    }
  }, [formValues, onChange])

  // Convert ELEMENT_TYPE_DEFINITIONS to selectOptions format
  const typeOptions = ELEMENT_TYPE_DEFINITIONS.map((def) => ({
    value: def.type,
    label: def.label,
  }))

  return (
    <div className="max-w-72 px-2 pt-4 pb-4.5 border-b border-input-border">
      <form.AppForm>
        <div className="flex flex-col gap-2.5">
          <form.AppField
            name="name"
            children={(field) => {
              return <field.TextField label="Name" placeholder="Name" />
            }}
          />
          <form.AppField
            name="type"
            children={(field) => {
              return <field.SelectField label="Type" selectOptions={typeOptions} />
            }}
          />
          <form.AppField
            name="textContent"
            children={(field) => {
              return <field.TextAreaField label="Text Content" placeholder="Enter your text content..." />
            }}
          />
          <form.AppField
            name="description"
            children={(field) => {
              return <field.TextAreaField label="Description" placeholder="Description" />
            }}
          />
        </div>
      </form.AppForm>
    </div>
  )
}
