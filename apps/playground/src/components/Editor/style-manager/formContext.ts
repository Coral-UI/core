import { ColorInputField } from '@/components/Editor/style-manager/components/ColorInputField'
import { DirectionLayoutField } from '@/components/Editor/style-manager/components/DirectionLayout'
import { NumberInputField } from '@/components/Editor/style-manager/components/NumberInputField'
import { SelectField } from '@/components/Editor/style-manager/components/SelectField'
import { ToggleField } from '@/components/Editor/style-manager/components/ToggleField'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    ColorInput: ColorInputField,
    DirectionLayoutField,
    ToggleField,
    NumberInputField,
    SelectField,
  },
  formComponents: {},
})
