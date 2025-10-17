import { IconAlignBoxLeftTop, IconDirectionArrows, IconDirections, IconLayout, IconRulerMeasure, IconRulerMeasure2, IconSpacingHorizontal, IconTextWrap } from '@tabler/icons-react'
import { LayoutDashboardIcon, Maximize2Icon, Minimize2Icon, RulerDimensionLineIcon, SignpostIcon } from 'lucide-react'
import { z } from 'zod'

export const zLayoutSchema = z.object({
  width: z.number().optional(),
  widthUnit: z.enum(['px', 'em', 'rem', 'vw', 'vh']).optional(),
  height: z.number().optional(),
  heightUnit: z.enum(['px', 'em', 'rem', 'vw', 'vh']).optional(),
  display: z.enum(['block', 'inline', 'inline-block', 'flex', 'grid', 'none']).optional(),
  flexDirection: z.enum(['row', 'row-reverse', 'column', 'column-reverse']).optional(),
  flexWrap: z.enum(['nowrap', 'wrap', 'wrap-reverse']).optional(),
  flexJustify: z.enum(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']).optional(),
  flexAlign: z.enum(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']).optional(),
  flexGrow: z.number().optional(),
  flexShrink: z.number().optional(),
})

export type LayoutSchema = z.infer<typeof zLayoutSchema>

export const LayoutGroups = [
  {
    legend: 'Dimensions',
    components: [
      {
        label: 'Width',
        name: 'width',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: 'auto',
        defaultValue: '',
        selectName: 'widthUnit',
        selectLabel: 'Unit',
        icon: IconRulerMeasure,
        options: [
          { label: 'px', value: 'px' },
          { label: 'em', value: 'em' },
          { label: 'rem', value: 'rem' },
          { label: 'vw', value: 'vw' },
          { label: 'vh', value: 'vh' },
        ],
      },
      {
        label: 'Height',
        name: 'height',
        type: 'inputWithOptions',
        inputType: 'number',
        placeholder: 'auto',
        defaultValue: '',
        selectName: 'heightUnit',
        selectLabel: 'Unit',
        icon: IconRulerMeasure2,
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
    legend: 'Display',
    components: [
      {
        label: 'Display',
        name: 'display',
        type: 'select',
        defaultValue: 'block',
        icon: IconLayout,
        options: [
          { label: 'Block', value: 'block' },
          { label: 'Inline', value: 'inline' },
          { label: 'Inline Block', value: 'inline-block' },
          { label: 'Flex', value: 'flex' },
          { label: 'Inline Flex', value: 'inline-flex' },
          { label: 'Grid', value: 'grid' },
          { label: 'None', value: 'none' },
        ],
      },
    ],
  },
  {
    legend: 'Flex Properties',
    components: [
      {
        label: 'Direction',
        name: 'flexDirection',
        type: 'select',
        defaultValue: 'row',
        showWhen: {
          field: 'display',
          values: ['flex', 'inline-flex'],
        },
        icon: IconDirections,
        options: [
          { label: 'Row', value: 'row' },
          { label: 'Row Reverse', value: 'row-reverse' },
          { label: 'Column', value: 'column' },
          { label: 'Column Reverse', value: 'column-reverse' },
        ],
      },
      {
        label: 'Wrap',
        name: 'flexWrap',
        type: 'select',
        defaultValue: 'nowrap',
        icon: IconTextWrap,
        showWhen: {
          field: 'display',
          values: ['flex', 'inline-flex'],
        },
        options: [
          { label: 'Nowrap', value: 'nowrap' },
          { label: 'Wrap', value: 'wrap' },
          { label: 'Wrap Reverse', value: 'wrap-reverse' },
        ],
      },
      {
        label: 'Justify Content',
        name: 'flexJustify',
        type: 'select',
        defaultValue: 'flex-start',
        icon: IconSpacingHorizontal,
        showWhen: {
          field: 'display',
          values: ['flex', 'inline-flex'],
        },
        options: [
          { label: 'Flex Start', value: 'flex-start' },
          { label: 'Flex End', value: 'flex-end' },
          { label: 'Center', value: 'center' },
          { label: 'Space Between', value: 'space-between' },
          { label: 'Space Around', value: 'space-around' },
          { label: 'Space Evenly', value: 'space-evenly' },
        ],
      },
      {
        label: 'Align Items',
        name: 'flexAlign',
        type: 'select',
        defaultValue: 'flex-start',
        icon: IconAlignBoxLeftTop,
        showWhen: {
          field: 'display',
          values: ['flex', 'inline-flex'],
        },
        options: [
          { label: 'Flex Start', value: 'flex-start' },
          { label: 'Flex End', value: 'flex-end' },
          { label: 'Center', value: 'center' },
          { label: 'Stretch', value: 'stretch' },
          { label: 'Baseline', value: 'baseline' },
        ],
      },
      {
        label: 'Grow',
        name: 'flexGrow',
        type: 'input',
        inputType: 'number',
        placeholder: '0',
        defaultValue: 0,
        icon: Maximize2Icon,
        iconClassName: 'rotate-45',
        showWhen: {
          field: 'display',
          values: ['flex', 'inline-flex'],
        },
      },
      {
        label: 'Shrink',
        name: 'flexShrink',
        type: 'input',
        inputType: 'number',
        placeholder: '1',
        defaultValue: 1,
        icon: Minimize2Icon,
        iconClassName: 'rotate-45',
        showWhen: {
          field: 'display',
          values: ['flex', 'inline-flex'],
        },
      },
    ],
  },
]

// For backwards compatibility, flatten groups into components
export const LayoutComponents = LayoutGroups.flatMap((group) => group.components)
