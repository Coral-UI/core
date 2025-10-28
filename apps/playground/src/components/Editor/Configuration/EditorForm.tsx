import { EditorStyleFormComponents } from '@/components/Editor/Configuration/EditorStyleFormComponents'
import {
  StyleFormComponents,
  StyleFormDefaultValues,
  StyleFormSchema,
  zStyleFormSchema,
} from '@/components/Editor/Configuration/EditorStyleFormStructure'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const EditorForm = () => {
  const form = useForm<StyleFormSchema>({
    defaultValues: StyleFormDefaultValues,
  })

  function onSubmit(values: z.infer<typeof zStyleFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <header>
            <h2 className="text-lg font-semibold">Component Styles</h2>
          </header>
          <EditorStyleFormComponents form={form} components={StyleFormComponents} />
        </form>
      </Form>
    </>
  )
}
