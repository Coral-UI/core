import { SelectField } from '@/components/component-manager/components/SelectField'
import { TextAreaField } from '@/components/component-manager/components/TextAreaField'
import { TextField } from '@/components/component-manager/components/TextField'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextAreaField,
    SelectField,
  },
  formComponents: {},
})
