import { z } from 'zod'

export const zPositionSchema = z.object({
  position: z.enum(['static', 'relative', 'absolute', 'fixed', 'sticky']),
  top: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
  left: z.number().optional(),
})

export type PositionSchema = z.infer<typeof zPositionSchema>

export const PositionComponents = [
  {
    label: 'Position',
    name: 'position',
    type: 'select',
    defaultValue: 'static',
    options: [
      { label: 'Static', value: 'static' },
      { label: 'Relative', value: 'relative' },
      { label: 'Absolute', value: 'absolute' },
      { label: 'Fixed', value: 'fixed' },
      { label: 'Sticky', value: 'sticky' },
    ],
  },
  {
    label: 'Top',
    name: 'top',
    type: 'input',
    inputType: 'number',
    placeholder: '0',
    defaultValue: 0,
  },
  {
    label: 'Right',
    name: 'right',
    type: 'input',
    inputType: 'number',
    placeholder: '0',
    defaultValue: 0,
  },
  {
    label: 'Bottom',
    name: 'bottom',
    type: 'input',
    inputType: 'number',
    placeholder: '0',
    defaultValue: 0,
  },
  {
    label: 'Left',
    name: 'left',
    type: 'input',
    inputType: 'number',
    placeholder: '0',
    defaultValue: 0,
  },
]
