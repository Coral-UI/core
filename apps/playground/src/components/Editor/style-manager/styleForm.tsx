import type { StyleFormValues } from '@/components/Editor/style-manager/formSchema'
import { CardSection } from '@/components/Editor/style-manager/components/CardSection'
import { ConditionalSection } from '@/components/Editor/style-manager/components/ConditionalSection'
import { DirectionLayoutField } from '@/components/Editor/style-manager/components/DirectionLayout'
import { ExpandableFieldGroup } from '@/components/Editor/style-manager/components/ExpandableFieldGroup'
import { OptionalSection } from '@/components/Editor/style-manager/components/OptionalSection'
import { useAppForm, withForm } from '@/components/Editor/style-manager/formContext'
import { formSchema } from '@/components/Editor/style-manager/formSchema'
import {
  AlignItemsBaseline,
  AlignItemsCenter,
  AlignItemsFlexEnd,
  AlignItemsFlexStart,
  AlignItemsStretch,
  FlexDirectionColumn,
  FlexDirectionColumnReverse,
  FlexDirectionRow,
  FlexDirectionRowReverse,
  FlexWrapNoWrap,
  FlexWrapWrap,
  JustifyContentCenter,
  JustifyContentFlexEnd,
  JustifyContentFlexStart,
  JustifyContentSpaceAround,
  JustifyContentSpaceBetween,
  JustifyContentSpaceEvenly,
} from '@/components/Editor/style-manager/icons'
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconArrowAutofitContentFilled,
  IconArrowBarToDown,
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowBarUp,
  IconArrowsDiagonal,
  IconArrowsDiagonalMinimize,
  IconBackground,
  IconBold,
  IconBorderBottom,
  IconBorderLeft,
  IconBorderRadius,
  IconBorderRight,
  IconBorderSides,
  IconBorderStyle2,
  IconBorderTop,
  IconBoxMargin,
  IconBoxPadding,
  IconEyeClosed,
  IconGrid4x4,
  IconLayout2Filled,
  IconLetterCase,
  IconLetterCaseLower,
  IconLetterCaseUpper,
  IconLetterH,
  IconLetterSpacing,
  IconLetterW,
  IconLineDashed,
  IconLineDotted,
  IconLineHeight,
  IconMinus,
  IconOverline,
  IconPalette,
  IconRuler,
  IconRulerMeasure,
  IconRulerMeasure2,
  IconSpacingHorizontal,
  IconStrikethrough,
  IconTable,
  IconTextSize,
  IconTypeface,
  IconUnderline,
  IconViewportNarrow,
  IconViewportWide,
} from '@tabler/icons-react'
import { useStore } from '@tanstack/react-form'
import { useEffect, useRef } from 'react'

const defaultValues = {
  backgroundColor: undefined,
  backgroundColorFormat: 'hex',
  color: undefined,
  colorFormat: 'hex',
  paddingInlineStart: undefined,
  paddingInlineEndUnit: undefined,
  paddingInlineEnd: undefined,
  paddingBlockStartUnit: undefined,
  paddingBlockStart: undefined,
  paddingBlockEndUnit: undefined,
  paddingBlockEnd: undefined,
  paddingInlineStartUnit: undefined,
  marginInlineStart: undefined,
  marginInlineStartUnit: undefined,
  marginInlineEnd: undefined,
  marginInlineEndUnit: undefined,
  marginBlockStart: undefined,
  marginBlockStartUnit: undefined,
  marginBlockEnd: undefined,
  marginBlockEndUnit: undefined,
  borderEnabled: false,
  borderInlineStartWidth: undefined,
  borderInlineStartWidthUnit: undefined,
  borderInlineEndWidth: undefined,
  borderInlineEndWidthUnit: undefined,
  borderBlockStartWidth: undefined,
  borderBlockStartWidthUnit: undefined,
  borderBlockEndWidth: undefined,
  borderBlockEndWidthUnit: undefined,
  borderInlineStartStyle: undefined,
  borderInlineEndStyle: undefined,
  borderBlockStartStyle: undefined,
  borderBlockEndStyle: undefined,
  borderInlineStartColor: undefined,
  borderInlineEndColor: undefined,
  borderBlockStartColor: undefined,
  borderBlockEndColor: undefined,
  borderTopLeftRadius: undefined,
  borderTopLeftRadiusUnit: undefined,
  borderTopRightRadius: undefined,
  borderTopRightRadiusUnit: undefined,
  borderBottomRightRadius: undefined,
  borderBottomRightRadiusUnit: undefined,
  borderBottomLeftRadius: undefined,
  borderBottomLeftRadiusUnit: undefined,
  display: 'block',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flexSize: undefined,
  flexSizeUnit: undefined,
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 0,
  flexBasisUnit: 'px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: 0,
  gapUnit: 'px',
  overflowEnabled: false,
  overflowX: undefined,
  overflowY: undefined,
  width: undefined,
  widthUnit: undefined,
  height: undefined,
  heightUnit: undefined,
  minWidth: undefined,
  minWidthUnit: undefined,
  maxWidth: undefined,
  maxWidthUnit: undefined,
  minHeight: undefined,
  minHeightUnit: undefined,
  maxHeight: undefined,
  maxHeightUnit: undefined,
  typographyEnabled: false,
  fontSize: 16,
  fontSizeUnit: 'px',
  fontWeight: '400',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Adwaita Sans, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif',
  lineHeight: 1.5,
  lineHeightUnit: 'em',
  letterSpacing: undefined,
  letterSpacingUnit: undefined,
  textAlign: undefined,
  textTransform: undefined,
  textDecoration: undefined,
  textDecorationColor: undefined,
  textDecorationColorFormat: undefined,
  textDecorationStyle: 'solid',
  textDecorationThickness: undefined,
  textDecorationThicknessUnit: undefined,
  textUnderlinePosition: undefined,
  textUnderlineOffset: undefined,
  textUnderlineOffsetUnit: undefined,
}

const StyleFormLayout = withForm({
  defaultValues,
  // props,
  render: function render({ form }) {
    return (
      <div className="max-w-72">
        <form.AppForm>
          <div className="flex flex-col bg-bg-surface">
            <CardSection legend="Color">
              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="backgroundColor"
                children={(field) => {
                  return (
                    <field.ColorInput
                      formatName="backgroundColorFormat"
                      defaultFormat="hex"
                      label="Background Color"
                      leadingIcon={<IconBackground strokeWidth={1.25} />}
                      size="sm"
                    />
                  )
                }}
              />
              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="color"
                children={(field) => {
                  return (
                    <field.ColorInput
                      formatName="colorFormat"
                      defaultFormat="hex"
                      label="Color"
                      leadingIcon={<IconPalette strokeWidth={1.25} />}
                      size="sm"
                    />
                  )
                }}
              />
            </CardSection>

            <CardSection legend="Spacing">
              <DirectionLayoutField
                label="Padding"
                uniformFieldIcon={<IconBoxPadding strokeWidth={1.25} />}
                toggleIcon={<IconBoxPadding strokeWidth={1.25} />}
                // layout="corner"
                hideFieldLabels={true}
                fields={{
                  inlineStart: 'paddingInlineStart',
                  inlineEnd: 'paddingInlineEnd',
                  blockStart: 'paddingBlockStart',
                  blockEnd: 'paddingBlockEnd',
                }}
                unitFields={{
                  inlineStart: 'paddingInlineStartUnit',
                  inlineEnd: 'paddingInlineEndUnit',
                  blockStart: 'paddingBlockStartUnit',
                  blockEnd: 'paddingBlockEndUnit',
                }}
              />

              <DirectionLayoutField
                label="Margin"
                hideFieldLabels={true}
                toggleIcon={<IconBoxMargin strokeWidth={1.25} />}
                uniformFieldIcon={<IconBoxMargin strokeWidth={1.25} />}
                icons={{
                  blockStart: IconArrowBarUp,
                  inlineStart: IconArrowBarToLeft,
                  inlineEnd: IconArrowBarToRight,
                  blockEnd: IconArrowBarToDown,
                }}
                fields={{
                  inlineStart: 'marginInlineStart',
                  inlineEnd: 'marginInlineEnd',
                  blockStart: 'marginBlockStart',
                  blockEnd: 'marginBlockEnd',
                }}
                unitFields={{
                  inlineStart: 'marginInlineStartUnit',
                  inlineEnd: 'marginInlineEndUnit',
                  blockStart: 'marginBlockStartUnit',
                  blockEnd: 'marginBlockEndUnit',
                }}
              />
            </CardSection>

            <CardSection legend="Dimensions">
              <ExpandableFieldGroup
                mainFieldName="width"
                options={[
                  {
                    fieldName: 'minWidth',
                    unitFieldName: 'minWidthUnit',
                    label: 'Add Min Width',
                    icon: <IconRulerMeasure strokeWidth={1.25} />,
                  },
                  {
                    fieldName: 'maxWidth',
                    unitFieldName: 'maxWidthUnit',
                    label: 'Add Max Width',
                    icon: <IconRulerMeasure strokeWidth={1.25} />,
                  },
                ]}
                fields={{
                  minWidth: (
                    <form.AppField
                      // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                      name="minWidth"
                      children={(field) => (
                        <field.NumberInputField
                          leadingIcon={<IconRulerMeasure strokeWidth={1.25} />}
                          unitFieldName="minWidthUnit"
                          size="sm"
                          label="Min Width"
                          min={0}
                          step={1}
                          hideControls={true}
                        />
                      )}
                    />
                  ),
                  maxWidth: (
                    <form.AppField
                      // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                      name="maxWidth"
                      children={(field) => (
                        <field.NumberInputField
                          leadingIcon={<IconRulerMeasure strokeWidth={1.25} />}
                          unitFieldName="maxWidthUnit"
                          size="sm"
                          label="Max Width"
                          min={0}
                          step={1}
                          hideControls={true}
                        />
                      )}
                    />
                  ),
                }}
              >
                <form.AppField
                  // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                  name="width"
                  children={(field) => (
                    <field.NumberInputField
                      leadingIcon={<IconLetterW />}
                      size="sm"
                      unitFieldName="widthUnit"
                      label="Width"
                      min={0}
                      step={1}
                      hideControls={true}
                      showAuto={true}
                    />
                  )}
                />
              </ExpandableFieldGroup>
              <ExpandableFieldGroup
                mainFieldName="height"
                options={[
                  {
                    fieldName: 'minHeight',
                    unitFieldName: 'minHeightUnit',
                    label: 'Add Min Height',
                    icon: <IconRulerMeasure2 strokeWidth={1.25} />,
                  },
                  {
                    fieldName: 'maxHeight',
                    unitFieldName: 'maxHeightUnit',
                    label: 'Add Max Height',
                    icon: <IconRulerMeasure2 strokeWidth={1.25} />,
                  },
                ]}
                fields={{
                  minHeight: (
                    <form.AppField
                      // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                      name="minHeight"
                      children={(field) => (
                        <field.NumberInputField
                          leadingIcon={<IconRulerMeasure2 strokeWidth={1.25} />}
                          unitFieldName="minHeightUnit"
                          size="sm"
                          label="Min Height"
                          min={0}
                          step={1}
                          hideControls={true}
                        />
                      )}
                    />
                  ),
                  maxHeight: (
                    <form.AppField
                      // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                      name="maxHeight"
                      children={(field) => (
                        <field.NumberInputField
                          leadingIcon={<IconRulerMeasure2 strokeWidth={1.25} />}
                          unitFieldName="maxHeightUnit"
                          size="sm"
                          label="Max Height"
                          min={0}
                          step={1}
                          hideControls={true}
                        />
                      )}
                    />
                  ),
                }}
              >
                <form.AppField
                  // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                  name="height"
                  children={(field) => (
                    <field.NumberInputField
                      leadingIcon={<IconLetterH />}
                      unitFieldName="heightUnit"
                      size="sm"
                      label="Height"
                      min={0}
                      step={1}
                      hideControls={true}
                      showAuto={true}
                    />
                  )}
                />
              </ExpandableFieldGroup>
            </CardSection>

            <CardSection legend="Layout">
              <form.AppField
                name="display"
                children={(field) => (
                  <field.ToggleField
                    label="Display"
                    options={[
                      {
                        value: 'block',
                        label: 'Block',
                        icon: <IconArrowAutofitContentFilled strokeWidth={1.25} />,
                        tooltip: 'Block',
                      },
                      {
                        value: 'inline',
                        label: 'Inline',
                        icon: <IconViewportNarrow />,
                        tooltip: 'Inline',
                      },
                      {
                        value: 'inline-block',
                        label: 'Inline Block',
                        icon: <IconViewportWide />,
                        tooltip: 'Inline Block',
                      },
                      {
                        value: 'flex',
                        label: 'Flex',
                        icon: <IconLayout2Filled strokeWidth={1.25} />,
                        tooltip: 'Flex',
                      },
                      {
                        value: 'grid',
                        label: 'Grid',
                        icon: <IconGrid4x4 strokeWidth={1.25} />,
                        tooltip: 'Grid',
                      },
                      {
                        value: 'table',
                        label: 'Table',
                        icon: <IconTable strokeWidth={1.25} />,
                        tooltip: 'Table',
                      },
                      {
                        value: 'none',
                        label: 'None',
                        icon: <IconEyeClosed strokeWidth={1.25} />,
                        tooltip: 'None',
                      },
                    ]}
                  />
                )}
              />

              <ConditionalSection watch="display" when="flex" legend="Flex">
                <div className="flex flex-col gap-2">
                  <form.AppField
                    name="flexDirection"
                    children={(field) => (
                      <field.ToggleField
                        label="Flex Direction"
                        options={[
                          {
                            value: 'row',
                            label: 'Row',
                            icon: <FlexDirectionRow strokeWidth={1.25} />,
                            tooltip: 'Row',
                          },
                          {
                            value: 'column',
                            label: 'Column',
                            icon: <FlexDirectionColumn strokeWidth={1.25} />,
                            tooltip: 'Column',
                          },
                          {
                            value: 'row-reverse',
                            label: 'Row Reverse',
                            icon: <FlexDirectionRowReverse strokeWidth={1.25} />,
                            tooltip: 'Row Reverse',
                          },
                          {
                            value: 'column-reverse',
                            label: 'Column Reverse',
                            icon: <FlexDirectionColumnReverse strokeWidth={1.25} />,
                            tooltip: 'Column Reverse',
                          },
                        ]}
                      />
                    )}
                  />
                  <form.AppField
                    name="flexWrap"
                    children={(field) => (
                      <field.ToggleField
                        label="Flex Wrap"
                        options={[
                          {
                            value: 'nowrap',
                            label: 'Nowrap',
                            icon: <FlexWrapNoWrap strokeWidth={1.5} />,
                            tooltip: 'No Wrap',
                          },
                          {
                            value: 'wrap',
                            label: 'Wrap',
                            icon: <FlexWrapWrap strokeWidth={1.5} />,
                            tooltip: 'Wrap',
                          },
                        ]}
                      />
                    )}
                  />
                  <form.AppField
                    name="justifyContent"
                    children={(field) => (
                      <field.ToggleField
                        label="Justify Content"
                        options={[
                          {
                            value: 'flex-start',
                            label: 'Flex Start',
                            icon: <JustifyContentFlexStart strokeWidth={1.25} />,
                            tooltip: 'Flex Start',
                          },
                          {
                            value: 'flex-end',
                            label: 'Flex End',
                            icon: <JustifyContentFlexEnd strokeWidth={1.25} />,
                            tooltip: 'Flex End',
                          },
                          {
                            value: 'center',
                            label: 'Center',
                            icon: <JustifyContentCenter strokeWidth={1.25} />,
                            tooltip: 'Center',
                          },
                          {
                            value: 'space-between',
                            label: 'Space Between',
                            icon: <JustifyContentSpaceBetween strokeWidth={1.25} />,
                            tooltip: 'Space Between',
                          },
                          {
                            value: 'space-around',
                            label: 'Space Around',
                            icon: <JustifyContentSpaceAround strokeWidth={1.25} />,
                            tooltip: 'Space Around',
                          },
                          {
                            value: 'space-evenly',
                            label: 'Space Evenly',
                            icon: <JustifyContentSpaceEvenly strokeWidth={1.25} />,
                            tooltip: 'Space Evenly',
                          },
                        ]}
                      />
                    )}
                  />
                  <form.AppField
                    name="alignItems"
                    children={(field) => (
                      <field.ToggleField
                        label="Align Items"
                        options={[
                          {
                            value: 'flex-start',
                            label: 'Flex Start',
                            icon: <AlignItemsFlexStart strokeWidth={1.25} />,
                            tooltip: 'Flex Start',
                          },
                          {
                            value: 'flex-end',
                            label: 'Flex End',
                            icon: <AlignItemsFlexEnd strokeWidth={1.25} />,
                            tooltip: 'Flex End',
                          },
                          {
                            value: 'center',
                            label: 'Center',
                            icon: <AlignItemsCenter strokeWidth={1.25} />,
                            tooltip: 'Center',
                          },
                          {
                            value: 'baseline',
                            label: 'Baseline',
                            icon: <AlignItemsBaseline strokeWidth={1.25} />,
                            tooltip: 'Baseline',
                          },
                          {
                            value: 'stretch',
                            label: 'Stretch',
                            icon: <AlignItemsStretch strokeWidth={1.25} />,
                            tooltip: 'Stretch',
                          },
                        ]}
                      />
                    )}
                  />
                  <form.AppField
                    name="flexBasis"
                    children={(field) => (
                      <field.NumberInputField
                        leadingIcon={<IconRuler strokeWidth={1.25} />}
                        unitFieldName="flexBasisUnit"
                        size="sm"
                        label="Flex Basis"
                        min={0}
                        step={1}
                        hideControls={true}
                      />
                    )}
                  />
                  <div className="flex gap-3">
                    <form.AppField
                      name="flexGrow"
                      children={(field) => (
                        <field.NumberInputField
                          leadingIcon={<IconArrowsDiagonal strokeWidth={1.25} />}
                          unitFieldName="flexSizeUnit"
                          size="sm"
                          label="Flex Grow"
                          min={0}
                          step={1}
                          hideControls={true}
                        />
                      )}
                    />
                    <form.AppField
                      name="flexShrink"
                      children={(field) => (
                        <field.NumberInputField
                          leadingIcon={<IconArrowsDiagonalMinimize strokeWidth={1.25} />}
                          unitFieldName="flexSizeUnit"
                          size="sm"
                          label="Flex Shrink"
                          min={0}
                          step={1}
                          hideControls={true}
                        />
                      )}
                    />
                  </div>
                  <form.AppField
                    name="gap"
                    children={(field) => (
                      <field.NumberInputField
                        leadingIcon={<IconSpacingHorizontal strokeWidth={1.25} />}
                        unitFieldName="gapUnit"
                        size="sm"
                        label="Gap"
                        min={0}
                        step={1}
                        hideControls={true}
                      />
                    )}
                  />
                </div>
              </ConditionalSection>
            </CardSection>

            <OptionalSection enabledField="typographyEnabled" legend="Typography">
              <form.AppField
                name="fontSize"
                children={(field) => (
                  <field.NumberInputField
                    leadingIcon={<IconTextSize />}
                    unitFieldName="fontSizeUnit"
                    size="sm"
                    label="Font Size"
                    min={0}
                    step={1}
                    // hideControls={true}
                  />
                )}
              />
              <form.AppField
                name="fontFamily"
                children={(field) => (
                  <field.SelectField
                    label="Font Family"
                    leadingIcon={<IconTypeface />}
                    selectOptions={[
                      {
                        value:
                          '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Adwaita Sans, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif',
                        label: 'Sans Serif',
                      },
                      {
                        value:
                          'Iowan Old Style, Apple Garamond, Baskerville, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
                        label: 'Serif',
                      },
                      {
                        value: 'Menlo, Consolas, Monaco, Adwaita Mono, Liberation Mono, Lucida Console, monospace',
                        label: 'Monospace',
                      },
                    ]}
                  />
                )}
              />
              <form.AppField
                name="fontWeight"
                children={(field) => (
                  <field.SelectField
                    label="Font Weight"
                    leadingIcon={<IconBold />}
                    selectOptions={[
                      { value: '100', label: '100 - Thin' },
                      { value: '200', label: '200 - Extra Light' },
                      { value: '300', label: '300 - Light' },
                      { value: '400', label: '400 - Normal' },
                      { value: '500', label: '500 - Medium' },
                      { value: '600', label: '600 - Semi Bold' },
                      { value: '700', label: '700 - Bold' },
                      { value: '800', label: '800 - Extra Bold' },
                      { value: '900', label: '900 - Black' },
                    ]}
                  />
                )}
              />
              <div className="flex gap-2">
                <form.AppField
                  // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                  name="letterSpacing"
                  children={(field) => (
                    <field.NumberInputField
                      leadingIcon={<IconLetterSpacing strokeWidth={1.25} />}
                      unitFieldName="letterSpacingUnit"
                      size="sm"
                      label="Letter Spacing"
                      min={0}
                      step={1}
                      hideControls={true}
                    />
                  )}
                />
                <form.AppField
                  name="lineHeight"
                  children={(field) => (
                    <field.NumberInputField
                      leadingIcon={<IconLineHeight strokeWidth={1.25} />}
                      unitFieldName="lineHeightUnit"
                      size="sm"
                      label="Line Height"
                      min={0}
                      step={1}
                      hideControls={true}
                    />
                  )}
                />
              </div>

              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="textAlign"
                children={(field) => (
                  <field.ToggleField
                    label="Text Align"
                    options={[
                      {
                        value: 'left',
                        label: 'Left',
                        icon: <IconAlignLeft strokeWidth={1.25} />,
                        tooltip: 'Left',
                      },
                      {
                        value: 'center',
                        label: 'Center',
                        icon: <IconAlignCenter strokeWidth={1.25} />,
                        tooltip: 'Center',
                      },
                      {
                        value: 'right',
                        label: 'Right',
                        icon: <IconAlignRight strokeWidth={1.25} />,
                        tooltip: 'Right',
                      },
                      {
                        value: 'justify',
                        label: 'Justify',
                        icon: <IconAlignJustified strokeWidth={1.25} />,
                        tooltip: 'Justify',
                      },
                    ]}
                  />
                )}
              />
              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="textTransform"
                children={(field) => (
                  <field.ToggleField
                    label="Text Transform"
                    options={[
                      { value: 'none', label: 'None' },
                      {
                        value: 'uppercase',
                        label: 'Uppercase',
                        icon: <IconLetterCaseUpper strokeWidth={1.25} />,
                        tooltip: 'Uppercase',
                      },
                      {
                        value: 'lowercase',
                        label: 'Lowercase',
                        icon: <IconLetterCaseLower strokeWidth={1.25} />,
                        tooltip: 'Lowercase',
                      },
                      {
                        value: 'capitalize',
                        label: 'Capitalize',
                        icon: <IconLetterCase strokeWidth={1.25} />,
                        tooltip: 'Capitalize',
                      },
                    ]}
                  />
                )}
              />

              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="textDecoration"
                children={(field) => (
                  <field.ToggleField
                    label="Text Decoration"
                    options={[
                      { value: 'none', label: 'None' },
                      {
                        value: 'underline',
                        label: 'Underline',
                        icon: <IconUnderline strokeWidth={1.25} />,
                        tooltip: 'Underline',
                      },
                      {
                        value: 'overline',
                        label: 'Overline',
                        icon: <IconOverline strokeWidth={1.25} />,
                        tooltip: 'Overline',
                      },
                      {
                        value: 'line-through',
                        label: 'Line Through',
                        icon: <IconStrikethrough strokeWidth={1.25} />,
                        tooltip: 'Line Through',
                      },
                    ]}
                  />
                )}
              />
              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="textDecorationColor"
                children={(field) => (
                  <field.ColorInput
                    label="Text Decoration Color"
                    formatName="textDecorationColorFormat"
                    defaultFormat="hex"
                    size="sm"
                  />
                )}
              />
              <form.AppField
                name="textDecorationStyle"
                children={(field) => (
                  <field.ToggleField
                    label="Text Decoration Style"
                    options={[
                      {
                        value: 'solid',
                        label: 'Solid',
                        icon: <IconMinus strokeWidth={1.25} />,
                        tooltip: 'Solid',
                      },
                      {
                        value: 'dashed',
                        label: 'Dashed',
                        icon: <IconLineDashed strokeWidth={1.25} />,
                        tooltip: 'Dashed',
                      },
                      {
                        value: 'dotted',
                        label: 'Dotted',
                        icon: <IconLineDotted strokeWidth={1.25} />,
                        tooltip: 'Dotted',
                      },
                    ]}
                  />
                )}
              />
              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="textDecorationThickness"
                children={(field) => (
                  <field.NumberInputField
                    leadingIcon={<IconRulerMeasure2 strokeWidth={1.25} />}
                    unitFieldName="textDecorationThicknessUnit"
                    size="sm"
                    label="Text Decoration Thickness"
                    min={0}
                    step={1}
                    hideControls={true}
                  />
                )}
              />
              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="textUnderlineOffset"
                children={(field) => (
                  <field.NumberInputField
                    leadingIcon={<IconRulerMeasure2 strokeWidth={1.25} />}
                    unitFieldName="textUnderlineOffsetUnit"
                    size="sm"
                    label="Text Underline Offset"
                    min={0}
                    step={1}
                    hideControls={true}
                  />
                )}
              />
            </OptionalSection>

            <OptionalSection enabledField="borderEnabled" legend="Border">
              <DirectionLayoutField
                label="Border Radius"
                toggleIcon={<IconBorderRadius strokeWidth={1.25} />}
                uniformFieldIcon={<IconBorderRadius strokeWidth={1.25} />}
                hideFieldLabels={true}
                // hideUnitSelects={true}
                // disableDirectionalIcons={true}
                layout="corner"
                fields={{
                  inlineStart: 'borderTopLeftRadius',
                  inlineEnd: 'borderTopRightRadius',
                  blockEnd: 'borderBottomRightRadius',
                  blockStart: 'borderBottomLeftRadius',
                }}
                unitFields={{
                  inlineStart: 'borderTopLeftRadiusUnit',
                  inlineEnd: 'borderTopRightRadiusUnit',
                  blockEnd: 'borderBottomRightRadiusUnit',
                  blockStart: 'borderBottomLeftRadiusUnit',
                }}
              />
              <DirectionLayoutField
                label="Border Width"
                toggleIcon={<IconBorderSides strokeWidth={1.25} />}
                uniformFieldIcon={<IconBorderSides strokeWidth={1.25} />}
                hideFieldLabels={true}
                icons={{
                  inlineStart: IconBorderLeft,
                  inlineEnd: IconBorderRight,
                  blockStart: IconBorderTop,
                  blockEnd: IconBorderBottom,
                }}
                fields={{
                  inlineStart: 'borderInlineStartWidth',
                  inlineEnd: 'borderInlineEndWidth',
                  blockStart: 'borderBlockStartWidth',
                  blockEnd: 'borderBlockEndWidth',
                }}
                unitFields={{
                  inlineStart: 'borderInlineStartWidthUnit',
                  inlineEnd: 'borderInlineEndWidthUnit',
                  blockStart: 'borderBlockStartWidthUnit',
                  blockEnd: 'borderBlockEndWidthUnit',
                }}
              />
              <DirectionLayoutField
                label="Border Style"
                toggleIcon={<IconBorderStyle2 />}
                uniformFieldIcon={<IconBorderStyle2 />}
                hideFieldLabels={true}
                hideUnitSelects={true}
                disableDirectionalIcons={true}
                fields={{
                  inlineStart: 'borderInlineStartStyle',
                  inlineEnd: 'borderInlineEndStyle',
                  blockStart: 'borderBlockStartStyle',
                  blockEnd: 'borderBlockEndStyle',
                }}
                inputTypes={{
                  inlineStart: {
                    type: 'select',
                    selectOptions: [
                      { value: 'solid', label: 'Solid' },
                      { value: 'dashed', label: 'Dashed' },
                      { value: 'dotted', label: 'Dotted' },
                      { value: 'double', label: 'Double' },
                      { value: 'groove', label: 'Groove' },
                    ],
                  },
                  inlineEnd: {
                    type: 'select',
                    selectOptions: [
                      { value: 'solid', label: 'Solid' },
                      { value: 'dashed', label: 'Dashed' },
                      { value: 'dotted', label: 'Dotted' },
                      { value: 'double', label: 'Double' },
                      { value: 'groove', label: 'Groove' },
                    ],
                  },
                  blockStart: {
                    type: 'select',
                    selectOptions: [
                      { value: 'solid', label: 'Solid' },
                      { value: 'dashed', label: 'Dashed' },
                      { value: 'dotted', label: 'Dotted' },
                      { value: 'double', label: 'Double' },
                      { value: 'groove', label: 'Groove' },
                    ],
                  },
                  blockEnd: {
                    type: 'select',
                    selectOptions: [
                      { value: 'solid', label: 'Solid' },
                      { value: 'dashed', label: 'Dashed' },
                      { value: 'dotted', label: 'Dotted' },
                      { value: 'double', label: 'Double' },
                      { value: 'groove', label: 'Groove' },
                    ],
                  },
                }}
              />
              <DirectionLayoutField
                label="Border Color"
                hideFieldLabels={true}
                hideUnitSelects={true}
                fields={{
                  inlineStart: 'borderInlineStartColor',
                  inlineEnd: 'borderInlineEndColor',
                  blockStart: 'borderBlockStartColor',
                  blockEnd: 'borderBlockEndColor',
                }}
                inputTypes={{
                  inlineStart: { type: 'color' },
                  inlineEnd: { type: 'color' },
                  blockStart: { type: 'color' },
                  blockEnd: { type: 'color' },
                }}
              />
            </OptionalSection>

            <OptionalSection enabledField="overflowEnabled" legend="Overflow">
              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="overflowX"
                children={(field) => (
                  <field.SelectField
                    label="Overflow X"
                    selectOptions={[
                      { value: 'visible', label: 'Visible' },
                      { value: 'hidden', label: 'Hidden' },
                      { value: 'clip', label: 'Clip' },
                      { value: 'scroll', label: 'Scroll' },
                      { value: 'auto', label: 'Auto' },
                      { value: 'inherit', label: 'Inherit' },
                      { value: 'initial', label: 'Initial' },
                      { value: 'revert', label: 'Revert' },
                      { value: 'revert-layer', label: 'Revert Layer' },
                      { value: 'unset', label: 'Unset' },
                    ]}
                  />
                )}
              />
              <form.AppField
                // @ts-expect-error - Dynamic field name, TypeScript can't infer the exact type
                name="overflowY"
                children={(field) => (
                  <field.SelectField
                    label="Overflow Y"
                    selectOptions={[
                      { value: 'visible', label: 'Visible' },
                      { value: 'hidden', label: 'Hidden' },
                      { value: 'clip', label: 'Clip' },
                      { value: 'scroll', label: 'Scroll' },
                      { value: 'auto', label: 'Auto' },
                      { value: 'inherit', label: 'Inherit' },
                      { value: 'initial', label: 'Initial' },
                      { value: 'revert', label: 'Revert' },
                      { value: 'revert-layer', label: 'Revert Layer' },
                      { value: 'unset', label: 'Unset' },
                    ]}
                  />
                )}
              />
            </OptionalSection>
          </div>
        </form.AppForm>
      </div>
    )
  },
})

export type StyleFormProps = {
  /**
   * Callback function that receives the complete form values whenever they change.
   * The values are typed according to the form schema, ensuring type safety.
   *
   * @example
   * ```tsx
   * <StyleForm
   *   onChange={(values) => {
   *     console.log(values.backgroundColor); // Fully typed
   *   }}
   * />
   * ```
   */
  onChange?: (values: StyleFormValues, changedFields?: Record<string, unknown>) => void
  /**
   * Initial values to populate the form with.
   * When provided, these values will override the default values.
   */
  initialValues?: Partial<StyleFormValues>
}

export const StyleForm = ({ onChange, initialValues }: StyleFormProps = {}) => {
  // Track previous initialValues to avoid unnecessary updates
  const previousInitialValuesRef = useRef<string>()
  const isSyncingRef = useRef(false)
  const isFirstRender = useRef(true)
  const previousDisplayRef = useRef<string | undefined>()
  // Track the previous form values to detect which field changed
  const previousFormValuesRef = useRef<StyleFormValues | null>(null)

  const form = useAppForm({
    defaultValues: { ...defaultValues, ...initialValues },
    validators: {
      // @ts-expect-error - Zod schema with optional fields doesn't perfectly match defaultValues type
      // but TanStack Form handles optional fields correctly at runtime
      onChange: formSchema,
    },
  })

  // Sync initialValues when element changes (detected by comparing serialized initialValues)
  // This ensures the form shows the correct values when switching between elements
  useEffect(() => {
    // Skip if initialValues is undefined (no element selected)
    if (!initialValues) {
      previousInitialValuesRef.current = undefined
      // Reset form to defaults when no element is selected
      if (!isFirstRender.current) {
        isSyncingRef.current = true
        // @ts-expect-error - defaultValues type inference doesn't match StyleFormValues exactly due to optional fields,
        // but defaultValues contains all required fields (borderEnabled: false) so this is safe at runtime
        form.reset(defaultValues as unknown as StyleFormValues)
        setTimeout(() => {
          isSyncingRef.current = false
        }, 0)
      }
      return
    }

    const currentInitialValuesString = JSON.stringify(initialValues)

    // Sync when element changes (initialValues content changes)
    // This happens when switching between elements
    if (previousInitialValuesRef.current !== currentInitialValuesString) {
      isSyncingRef.current = true
      previousInitialValuesRef.current = currentInitialValuesString

      // Preserve enabled states from current form if they're true
      // This prevents flickering when a user enables a section but hasn't added values yet
      const currentFormValues = form.state.values
      const preservedEnabledStates = {
        typographyEnabled:
          currentFormValues.typographyEnabled === true
            ? true
            : (initialValues.typographyEnabled ?? defaultValues.typographyEnabled),
        borderEnabled:
          currentFormValues.borderEnabled === true
            ? true
            : (initialValues.borderEnabled ?? defaultValues.borderEnabled),
        overflowEnabled:
          currentFormValues.overflowEnabled === true
            ? true
            : (initialValues.overflowEnabled ?? defaultValues.overflowEnabled),
      }

      // Reset form with new initial values, preserving enabled states
      const mergedValues = {
        ...defaultValues,
        ...initialValues,
        ...preservedEnabledStates,
      } as StyleFormValues
      // @ts-expect-error - form.reset expects borderEnabled to be required, but StyleFormValues has it as optional
      // However, we always provide it from defaultValues, so this is safe at runtime
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
  const displayValue = useStore(form.store, (state) => state.values.display)

  // Initialize previousFormValuesRef on first render if not already set
  useEffect(() => {
    if (previousFormValuesRef.current === null) {
      previousFormValuesRef.current = formValues as StyleFormValues
    }
  }, [formValues])

  // Set default values when conditional sections become visible
  // Note: We initialize flex fields with default values to keep them controlled,
  // but we only show them when display is "flex"
  useEffect(() => {
    // When display changes to "flex", ensure flex values are set (they should already be set from defaults)
    // This is mainly for cases where values might have been cleared
    if (displayValue === 'flex' && previousDisplayRef.current !== 'flex') {
      const currentValues = form.state.values

      // Only set if they're actually undefined (shouldn't happen with our defaults, but safety check)
      if (currentValues.flexDirection === undefined) {
        form.setFieldValue('flexDirection', 'row')
      }
      if (currentValues.flexWrap === undefined) {
        form.setFieldValue('flexWrap', 'nowrap')
      }
      if (currentValues.flexGrow === undefined) {
        form.setFieldValue('flexGrow', 0)
      }
      if (currentValues.flexShrink === undefined) {
        form.setFieldValue('flexShrink', 0)
      }
      if (currentValues.flexBasis === undefined) {
        form.setFieldValue('flexBasis', 0)
      }
      if (currentValues.flexBasisUnit === undefined) {
        form.setFieldValue('flexBasisUnit', 'px')
      }
      if (currentValues.alignItems === undefined) {
        form.setFieldValue('alignItems', 'flex-start')
      }
      if (currentValues.justifyContent === undefined) {
        form.setFieldValue('justifyContent', 'flex-start')
      }
      if (currentValues.gap === undefined) {
        form.setFieldValue('gap', 0)
      }
      if (currentValues.gapUnit === undefined) {
        form.setFieldValue('gapUnit', 'px')
      }
    }

    previousDisplayRef.current = displayValue
  }, [displayValue, form])

  useEffect(() => {
    // Don't call onChange if we're currently syncing initialValues
    if (isSyncingRef.current) {
      return
    }

    // Detect which field(s) changed by comparing with previous values
    const currentValues = formValues as StyleFormValues
    const previousValues = previousFormValuesRef.current

    // If we don't have previous values yet, initialize and skip
    if (!previousValues) {
      previousFormValuesRef.current = { ...currentValues }
      return
    }

    // Find changed fields
    const changedFields: Record<string, unknown> = {}
    Object.keys(currentValues).forEach((key) => {
      const currentValue = currentValues[key as keyof StyleFormValues]
      const previousValue = previousValues[key as keyof StyleFormValues]
      if (JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
        changedFields[key] = currentValue
      }
    })

    // Only call onChange if there are actual changes
    if (Object.keys(changedFields).length > 0 && onChange) {
      onChange(currentValues, changedFields)
      // Update previous values after calling onChange
      previousFormValuesRef.current = { ...currentValues }
    }
  }, [formValues, onChange, form])

  return <StyleFormLayout form={form as Parameters<typeof StyleFormLayout>[0]['form']} />
}
