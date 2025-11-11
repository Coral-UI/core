import { ColorInput } from '@/components/style-manager/components/ColorInput'
import { DirectionLayoutField } from '@/components/style-manager/components/DirectionLayout'
import { NumberInputField } from '@/components/style-manager/components/NumberInputField'
import { SelectField } from '@/components/style-manager/components/SelectField'
import { ToggleField } from '@/components/style-manager/components/ToggleField'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    ColorInput,
    DirectionLayoutField,
    ToggleField,
    NumberInputField,
    SelectField,
  },
  formComponents: {},
})
