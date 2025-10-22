import { z } from 'zod'
import { FormComponent, GroupedComponent } from './types'

export const zPositionSchema = z.object({
  position: z.enum(['static', 'relative', 'absolute', 'fixed', 'sticky']),
  top: z.number().optional(),
  topUnit: z.enum(['px', 'em', 'rem', 'vw', 'vh', '%']).optional(),
  right: z.number().optional(),
  rightUnit: z.enum(['px', 'em', 'rem', 'vw', 'vh', '%']).optional(),
  bottom: z.number().optional(),
  bottomUnit: z.enum(['px', 'em', 'rem', 'vw', 'vh', '%']).optional(),
  left: z.number().optional(),
  leftUnit: z.enum(['px', 'em', 'rem', 'vw', 'vh', '%']).optional(),
})

export type PositionSchema = z.infer<typeof zPositionSchema>

export const PositionComponents: (FormComponent | GroupedComponent)[] = [
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
    label: '',
    name: 'positionGroup',
    groups: [
      {
        label: 'Top',
        name: 'top',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: '0',
        defaultValue: '',
        selectName: 'topUnit',
        selectLabel: 'Unit',
        options: [
          { label: 'px', value: 'px' },
          { label: 'em', value: 'em' },
          { label: 'rem', value: 'rem' },
          { label: '%', value: '%' },
          { label: 'vw', value: 'vw' },
          { label: 'vh', value: 'vh' },
        ],
      },
      {
        label: 'Right',
        name: 'right',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: '0',
        defaultValue: '',
        selectName: 'rightUnit',
        selectLabel: 'Unit',
        options: [
          { label: 'px', value: 'px' },
          { label: 'em', value: 'em' },
          { label: 'rem', value: 'rem' },
          { label: '%', value: '%' },
          { label: 'vw', value: 'vw' },
          { label: 'vh', value: 'vh' },
        ],
      },
      {
        label: 'Bottom',
        name: 'bottom',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: '0',
        defaultValue: '',
        selectName: 'bottomUnit',
        selectLabel: 'Unit',
        options: [
          { label: 'px', value: 'px' },
          { label: 'em', value: 'em' },
          { label: 'rem', value: 'rem' },
          { label: '%', value: '%' },
          { label: 'vw', value: 'vw' },
          { label: 'vh', value: 'vh' },
        ],
      },
      {
        label: 'Left',
        name: 'left',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: '0',
        defaultValue: '',
        selectName: 'leftUnit',
        selectLabel: 'Unit',
        options: [
          { label: 'px', value: 'px' },
          { label: 'em', value: 'em' },
          { label: 'rem', value: 'rem' },
          { label: '%', value: '%' },
          { label: 'vw', value: 'vw' },
          { label: 'vh', value: 'vh' },
        ],
      },
    ],
  },
]
