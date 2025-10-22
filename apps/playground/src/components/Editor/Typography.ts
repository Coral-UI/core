import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconPalette,
  IconTextSize,
  IconTypography,
} from '@tabler/icons-react'
import { z } from 'zod'

import { FormComponent, GroupedComponent } from './types'

export const zTypographySchema = z.object({
  fontFamily: z.string(),
  color: z.string(),
  fontSize: z.number(),
  fontSizeUnit: z.string(),
  fontWeight: z.string(),
  lineHeight: z.number(),
  lineHeightUnit: z.string(),
})

export const TypographyGroup: (FormComponent | GroupedComponent)[] = [
  {
    label: 'Font Family',
    name: 'fontFamily',
    type: 'select',
    defaultValue: 'sans-serif',
    icon: IconTypography,
    options: [
      { label: 'Sans Serif', value: 'sans-serif' },
      { label: 'Serif', value: 'serif' },
      { label: 'Monospace', value: 'monospace' },
    ],
  },
  {
    label: 'Color',
    name: 'color',
    type: 'color',
    inputType: 'color',
    icon: IconPalette,
    placeholder: '#000000',
    defaultValue: '#000000',
  },
  {
    name: 'fontSizeGroup',
    label: '',
    groups: [
      {
        label: 'Font Size',
        name: 'fontSize',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: '16',
        defaultValue: 16,
        selectName: 'fontSizeUnit',
        selectLabel: 'Unit',
        icon: IconTextSize,
        options: [
          { label: 'px', value: 'px' },
          { label: 'em', value: 'em' },
          { label: 'rem', value: 'rem' },
          { label: 'vw', value: 'vw' },
          { label: 'vh', value: 'vh' },
        ],
      },
      {
        label: 'Font Weight',
        name: 'fontWeight',
        type: 'select',
        defaultValue: 'normal',
        icon: IconTypography,
        options: [
          { label: '100', value: 'thin' },
          { label: '200', value: 'extra-light' },
          { label: '300', value: 'light' },
          { label: '400', value: 'normal' },
          { label: '500', value: 'medium' },
          { label: '600', value: 'semi-bold' },
          { label: '700', value: 'bold' },
          { label: '800', value: 'extra-bold' },
          { label: '900', value: 'black' },
        ],
      },
    ],
  },

  {
    name: 'lineHeightGroup',
    label: '',
    groups: [
      {
        label: 'Line Height',
        name: 'lineHeight',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: '1.5',
        defaultValue: 1.5,
        selectName: 'lineHeightUnit',
        selectLabel: 'Unit',
        icon: IconTypography,
        options: [
          { label: 'em', value: 'em' },
          { label: 'px', value: 'px' },
          { label: 'rem', value: 'rem' },
          { label: 'vw', value: 'vw' },
          { label: 'vh', value: 'vh' },
        ],
      },
      {
        label: 'Letter Spacing',
        name: 'letterSpacing',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: '0',
        defaultValue: 0,
        selectName: 'letterSpacingUnit',
        selectLabel: 'Unit',
        icon: IconTypography,
        options: [
          { label: 'px', value: 'px' },
          { label: 'em', value: 'em' },
          { label: 'rem', value: 'rem' },
          { label: 'vw', value: 'vw' },
          { label: 'vh', value: 'vh' },
        ],
      },
    ],
  },

  {
    label: 'Text Align',
    name: 'textAlign',
    type: 'toggle',
    defaultValue: 'left',
    icon: IconTypography,
    options: [
      { label: 'Left', value: 'left', icon: IconAlignLeft },
      { label: 'Center', value: 'center', icon: IconAlignCenter },
      { label: 'Right', value: 'right', icon: IconAlignRight },
      { label: 'Justify', value: 'justify', icon: IconAlignJustified },
    ],
  },
]
