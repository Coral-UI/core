import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconBorderSides } from '@tabler/icons-react'
import React from 'react'

import type { FieldMapping, InputTypeMapping } from './direction-layout'
import { DirectionLayout } from './direction-layout'

const meta = {
  title: 'Primitives/DirectionLayout',
  component: DirectionLayout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['cardinal', 'corner'],
    },
    isUniform: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof DirectionLayout>

export default meta
type Story = StoryObj<typeof meta>

// Common field mappings
const paddingFields: FieldMapping = {
  blockStart: 'paddingTop',
  inlineStart: 'paddingLeft',
  inlineEnd: 'paddingRight',
  blockEnd: 'paddingBottom',
}

const paddingUnitFields: FieldMapping = {
  blockStart: 'paddingTopUnit',
  inlineStart: 'paddingLeftUnit',
  inlineEnd: 'paddingRightUnit',
  blockEnd: 'paddingBottomUnit',
}

const borderRadiusFields: FieldMapping = {
  blockStart: 'borderTopLeft',
  inlineStart: 'borderTopRight',
  inlineEnd: 'borderBottomLeft',
  blockEnd: 'borderBottomRight',
}

const borderRadiusUnitFields: FieldMapping = {
  blockStart: 'borderTopLeftUnit',
  inlineStart: 'borderTopRightUnit',
  inlineEnd: 'borderBottomLeftUnit',
  blockEnd: 'borderBottomRightUnit',
}

// Default number input types
const numberInputTypes: InputTypeMapping = {
  blockStart: { type: 'number' },
  inlineStart: { type: 'number' },
  inlineEnd: { type: 'number' },
  blockEnd: { type: 'number' },
}

export const CardinalLayout: Story = {
  render: () => {
    const [values, setValues] = React.useState({
      blockStart: 16,
      inlineStart: 16,
      inlineEnd: 16,
      blockEnd: 16,
    })
    const [units, setUnits] = React.useState({
      blockStart: 'px',
      inlineStart: 'px',
      inlineEnd: 'px',
      blockEnd: 'px',
    })

    return (
      <div className="w-96">
        <DirectionLayout
          label="Padding"
          layout="cardinal"
          fields={paddingFields}
          unitFields={paddingUnitFields}
          inputTypes={numberInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          blockStartUnit={units.blockStart}
          inlineStartUnit={units.inlineStart}
          inlineEndUnit={units.inlineEnd}
          blockEndUnit={units.blockEnd}
          isUniform={false}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as number })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as number })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as number })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as number })),
          }}
          onUnitChange={{
            blockStart: (unit) => setUnits((u) => ({ ...u, blockStart: unit })),
            inlineStart: (unit) => setUnits((u) => ({ ...u, inlineStart: unit })),
            inlineEnd: (unit) => setUnits((u) => ({ ...u, inlineEnd: unit })),
            blockEnd: (unit) => setUnits((u) => ({ ...u, blockEnd: unit })),
          }}
        />
      </div>
    )
  },
}

export const CornerLayout: Story = {
  render: () => {
    const [values, setValues] = React.useState({
      blockStart: 8,
      inlineStart: 8,
      inlineEnd: 8,
      blockEnd: 8,
    })
    const [units, setUnits] = React.useState({
      blockStart: 'px',
      inlineStart: 'px',
      inlineEnd: 'px',
      blockEnd: 'px',
    })

    return (
      <div className="w-96">
        <DirectionLayout
          label="Border Radius"
          layout="corner"
          fields={borderRadiusFields}
          unitFields={borderRadiusUnitFields}
          inputTypes={numberInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          blockStartUnit={units.blockStart}
          inlineStartUnit={units.inlineStart}
          inlineEndUnit={units.inlineEnd}
          blockEndUnit={units.blockEnd}
          isUniform={false}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as number })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as number })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as number })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as number })),
          }}
          onUnitChange={{
            blockStart: (unit) => setUnits((u) => ({ ...u, blockStart: unit })),
            inlineStart: (unit) => setUnits((u) => ({ ...u, inlineStart: unit })),
            inlineEnd: (unit) => setUnits((u) => ({ ...u, inlineEnd: unit })),
            blockEnd: (unit) => setUnits((u) => ({ ...u, blockEnd: unit })),
          }}
        />
      </div>
    )
  },
}

export const UniformMode: Story = {
  render: () => {
    const [isUniform, setIsUniform] = React.useState(true)
    const [uniformValue, setUniformValue] = React.useState(16)
    const [uniformUnit, setUniformUnit] = React.useState('px')
    const [values, setValues] = React.useState({
      blockStart: 16,
      inlineStart: 16,
      inlineEnd: 16,
      blockEnd: 16,
    })
    const [units, setUnits] = React.useState({
      blockStart: 'px',
      inlineStart: 'px',
      inlineEnd: 'px',
      blockEnd: 'px',
    })

    const handleUniformChange = (val: string | number) => {
      const numVal = val as number
      setUniformValue(numVal)
      setValues({
        blockStart: numVal,
        inlineStart: numVal,
        inlineEnd: numVal,
        blockEnd: numVal,
      })
    }

    const handleUniformUnitChange = (unit: string) => {
      setUniformUnit(unit)
      setUnits({
        blockStart: unit,
        inlineStart: unit,
        inlineEnd: unit,
        blockEnd: unit,
      })
    }

    return (
      <div className="w-96">
        <DirectionLayout
          label="Padding"
          layout="cardinal"
          fields={paddingFields}
          unitFields={paddingUnitFields}
          inputTypes={numberInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          blockStartUnit={units.blockStart}
          inlineStartUnit={units.inlineStart}
          inlineEndUnit={units.inlineEnd}
          blockEndUnit={units.blockEnd}
          isUniform={isUniform}
          uniformValue={uniformValue}
          uniformUnit={uniformUnit}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as number })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as number })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as number })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as number })),
          }}
          onUniformChange={handleUniformChange}
          onUnitChange={{
            blockStart: (unit) => setUnits((u) => ({ ...u, blockStart: unit })),
            inlineStart: (unit) => setUnits((u) => ({ ...u, inlineStart: unit })),
            inlineEnd: (unit) => setUnits((u) => ({ ...u, inlineEnd: unit })),
            blockEnd: (unit) => setUnits((u) => ({ ...u, blockEnd: unit })),
          }}
          onUniformUnitChange={handleUniformUnitChange}
          onToggleChange={setIsUniform}
        />
      </div>
    )
  },
}

export const WithSelectInputs: Story = {
  render: () => {
    const [values, setValues] = React.useState({
      blockStart: 'solid',
      inlineStart: 'solid',
      inlineEnd: 'solid',
      blockEnd: 'solid',
    })

    const selectInputTypes: InputTypeMapping = {
      blockStart: {
        type: 'select',
        selectOptions: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ],
      },
      inlineStart: {
        type: 'select',
        selectOptions: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ],
      },
      inlineEnd: {
        type: 'select',
        selectOptions: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ],
      },
      blockEnd: {
        type: 'select',
        selectOptions: [
          { value: 'none', label: 'None' },
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ],
      },
    }

    const borderStyleFields: FieldMapping = {
      blockStart: 'borderTopStyle',
      inlineStart: 'borderLeftStyle',
      inlineEnd: 'borderRightStyle',
      blockEnd: 'borderBottomStyle',
    }

    return (
      <div className="w-96">
        <DirectionLayout
          label="Border Style"
          layout="cardinal"
          fields={borderStyleFields}
          inputTypes={selectInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          isUniform={false}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as string })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as string })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as string })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as string })),
          }}
        />
      </div>
    )
  },
}

export const WithColorInputs: Story = {
  render: () => {
    const [values, setValues] = React.useState({
      blockStart: '#3b82f6',
      inlineStart: '#3b82f6',
      inlineEnd: '#3b82f6',
      blockEnd: '#3b82f6',
    })
    const [formats, setFormats] = React.useState({
      blockStart: 'hex' as 'hex' | 'rgb' | 'hsl' | 'hsb',
      inlineStart: 'hex' as 'hex' | 'rgb' | 'hsl' | 'hsb',
      inlineEnd: 'hex' as 'hex' | 'rgb' | 'hsl' | 'hsb',
      blockEnd: 'hex' as 'hex' | 'rgb' | 'hsl' | 'hsb',
    })

    const colorInputTypes: InputTypeMapping = {
      blockStart: {
        type: 'color',
        defaultColorFormat: 'hex',
        colorFormatName: 'borderTopColorFormat',
      },
      inlineStart: {
        type: 'color',
        defaultColorFormat: 'hex',
        colorFormatName: 'borderLeftColorFormat',
      },
      inlineEnd: {
        type: 'color',
        defaultColorFormat: 'hex',
        colorFormatName: 'borderRightColorFormat',
      },
      blockEnd: {
        type: 'color',
        defaultColorFormat: 'hex',
        colorFormatName: 'borderBottomColorFormat',
      },
    }

    const borderColorFields: FieldMapping = {
      blockStart: 'borderTopColor',
      inlineStart: 'borderLeftColor',
      inlineEnd: 'borderRightColor',
      blockEnd: 'borderBottomColor',
    }

    return (
      <div className="w-96">
        <DirectionLayout
          label="Border Color"
          layout="cardinal"
          fields={borderColorFields}
          inputTypes={colorInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          isUniform={false}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as string })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as string })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as string })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as string })),
          }}
          onFormatChange={{
            blockStart: (format) => setFormats((f) => ({ ...f, blockStart: format })),
            inlineStart: (format) => setFormats((f) => ({ ...f, inlineStart: format })),
            inlineEnd: (format) => setFormats((f) => ({ ...f, inlineEnd: format })),
            blockEnd: (format) => setFormats((f) => ({ ...f, blockEnd: format })),
          }}
        />
      </div>
    )
  },
}

export const WithoutUnitSelects: Story = {
  render: () => {
    const [values, setValues] = React.useState({
      blockStart: 1,
      inlineStart: 1,
      inlineEnd: 1,
      blockEnd: 1,
    })

    return (
      <div className="w-96">
        <DirectionLayout
          label="Border Width"
          layout="cardinal"
          fields={{
            blockStart: 'borderTopWidth',
            inlineStart: 'borderLeftWidth',
            inlineEnd: 'borderRightWidth',
            blockEnd: 'borderBottomWidth',
          }}
          inputTypes={numberInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          isUniform={false}
          hideUnitSelects={true}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as number })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as number })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as number })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as number })),
          }}
        />
      </div>
    )
  },
}

export const WithoutLabels: Story = {
  render: () => {
    const [values, setValues] = React.useState({
      blockStart: 8,
      inlineStart: 8,
      inlineEnd: 8,
      blockEnd: 8,
    })
    const [units, setUnits] = React.useState({
      blockStart: 'px',
      inlineStart: 'px',
      inlineEnd: 'px',
      blockEnd: 'px',
    })

    return (
      <div className="w-96">
        <DirectionLayout
          label="Spacing"
          layout="cardinal"
          fields={paddingFields}
          unitFields={paddingUnitFields}
          inputTypes={numberInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          blockStartUnit={units.blockStart}
          inlineStartUnit={units.inlineStart}
          inlineEndUnit={units.inlineEnd}
          blockEndUnit={units.blockEnd}
          isUniform={false}
          hideFieldLabels={true}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as number })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as number })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as number })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as number })),
          }}
          onUnitChange={{
            blockStart: (unit) => setUnits((u) => ({ ...u, blockStart: unit })),
            inlineStart: (unit) => setUnits((u) => ({ ...u, inlineStart: unit })),
            inlineEnd: (unit) => setUnits((u) => ({ ...u, inlineEnd: unit })),
            blockEnd: (unit) => setUnits((u) => ({ ...u, blockEnd: unit })),
          }}
        />
      </div>
    )
  },
}

export const WithoutDirectionalIcons: Story = {
  render: () => {
    const [values, setValues] = React.useState({
      blockStart: 12,
      inlineStart: 12,
      inlineEnd: 12,
      blockEnd: 12,
    })
    const [units, setUnits] = React.useState({
      blockStart: 'px',
      inlineStart: 'px',
      inlineEnd: 'px',
      blockEnd: 'px',
    })

    return (
      <div className="w-96">
        <DirectionLayout
          label="Margin"
          layout="cardinal"
          fields={{
            blockStart: 'marginTop',
            inlineStart: 'marginLeft',
            inlineEnd: 'marginRight',
            blockEnd: 'marginBottom',
          }}
          unitFields={{
            blockStart: 'marginTopUnit',
            inlineStart: 'marginLeftUnit',
            inlineEnd: 'marginRightUnit',
            blockEnd: 'marginBottomUnit',
          }}
          inputTypes={numberInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          blockStartUnit={units.blockStart}
          inlineStartUnit={units.inlineStart}
          inlineEndUnit={units.inlineEnd}
          blockEndUnit={units.blockEnd}
          isUniform={false}
          disableDirectionalIcons={true}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as number })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as number })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as number })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as number })),
          }}
          onUnitChange={{
            blockStart: (unit) => setUnits((u) => ({ ...u, blockStart: unit })),
            inlineStart: (unit) => setUnits((u) => ({ ...u, inlineStart: unit })),
            inlineEnd: (unit) => setUnits((u) => ({ ...u, inlineEnd: unit })),
            blockEnd: (unit) => setUnits((u) => ({ ...u, blockEnd: unit })),
          }}
        />
      </div>
    )
  },
}

export const CustomUniformIcon: Story = {
  render: () => {
    const [isUniform, setIsUniform] = React.useState(true)
    const [uniformValue, setUniformValue] = React.useState(20)
    const [uniformUnit, setUniformUnit] = React.useState('px')
    const [values, setValues] = React.useState({
      blockStart: 20,
      inlineStart: 20,
      inlineEnd: 20,
      blockEnd: 20,
    })
    const [units, setUnits] = React.useState({
      blockStart: 'px',
      inlineStart: 'px',
      inlineEnd: 'px',
      blockEnd: 'px',
    })

    const handleUniformChange = (val: string | number) => {
      const numVal = val as number
      setUniformValue(numVal)
      setValues({
        blockStart: numVal,
        inlineStart: numVal,
        inlineEnd: numVal,
        blockEnd: numVal,
      })
    }

    const handleUniformUnitChange = (unit: string) => {
      setUniformUnit(unit)
      setUnits({
        blockStart: unit,
        inlineStart: unit,
        inlineEnd: unit,
        blockEnd: unit,
      })
    }

    return (
      <div className="w-96">
        <DirectionLayout
          label="Padding"
          layout="cardinal"
          fields={paddingFields}
          unitFields={paddingUnitFields}
          inputTypes={numberInputTypes}
          blockStartValue={values.blockStart}
          inlineStartValue={values.inlineStart}
          inlineEndValue={values.inlineEnd}
          blockEndValue={values.blockEnd}
          blockStartUnit={units.blockStart}
          inlineStartUnit={units.inlineStart}
          inlineEndUnit={units.inlineEnd}
          blockEndUnit={units.blockEnd}
          isUniform={isUniform}
          uniformValue={uniformValue}
          uniformUnit={uniformUnit}
          uniformFieldIcon={<IconBorderSides className="size-4" />}
          onChange={{
            blockStart: (val) => setValues((v) => ({ ...v, blockStart: val as number })),
            inlineStart: (val) => setValues((v) => ({ ...v, inlineStart: val as number })),
            inlineEnd: (val) => setValues((v) => ({ ...v, inlineEnd: val as number })),
            blockEnd: (val) => setValues((v) => ({ ...v, blockEnd: val as number })),
          }}
          onUniformChange={handleUniformChange}
          onUnitChange={{
            blockStart: (unit) => setUnits((u) => ({ ...u, blockStart: unit })),
            inlineStart: (unit) => setUnits((u) => ({ ...u, inlineStart: unit })),
            inlineEnd: (unit) => setUnits((u) => ({ ...u, inlineEnd: unit })),
            blockEnd: (unit) => setUnits((u) => ({ ...u, blockEnd: unit })),
          }}
          onUniformUnitChange={handleUniformUnitChange}
          onToggleChange={setIsUniform}
        />
      </div>
    )
  },
}
