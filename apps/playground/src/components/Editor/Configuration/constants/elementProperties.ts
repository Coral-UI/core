/**
 * Elements that support text content property
 */
export const TEXT_CAPABLE_ELEMENTS = [
  'text',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'button',
  'a',
  'label',
] as const

/**
 * Maps dimension properties to their corresponding unit field names
 * Used for clearing both the value and unit when a dimension field is cleared
 */
export const DIMENSION_PROPERTIES: Record<string, string> = {
  fontSize: 'fontSizeUnit',
  lineHeight: 'lineHeightUnit',
  letterSpacing: 'letterSpacingUnit',
  width: 'widthUnit',
  height: 'heightUnit',
  marginInlineStart: 'marginInlineStartUnit',
  marginInlineEnd: 'marginInlineEndUnit',
  marginBlockStart: 'marginBlockStartUnit',
  marginBlockEnd: 'marginBlockEndUnit',
  paddingInlineStart: 'paddingInlineStartUnit',
  paddingInlineEnd: 'paddingInlineEndUnit',
  paddingBlockStart: 'paddingBlockStartUnit',
  paddingBlockEnd: 'paddingBlockEndUnit',
  gapX: 'gapXUnit',
  gapY: 'gapYUnit',
  top: 'topUnit',
  right: 'rightUnit',
  bottom: 'bottomUnit',
  left: 'leftUnit',
  borderTopLeftRadius: 'borderTopLeftRadiusUnit',
  borderTopRightRadius: 'borderTopRightRadiusUnit',
  borderBottomLeftRadius: 'borderBottomLeftRadiusUnit',
  borderBottomRightRadius: 'borderBottomRightRadiusUnit',
} as const
