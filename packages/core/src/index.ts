export { parseUISpec } from '@utils/parseUISpec'
export { transformHTMLToSpec } from '@lib/transformHTMLToSpec'
export {
  parseMediaQuery,
  extractMediaQueriesFromCSS,
  mediaQueriesToResponsiveStyles,
  extractResponsiveStylesFromObject,
} from '@utils/parseMediaQuery'
export { dimensionToCSS, normalizeDimension } from '@structures/dimension'

export type { CoralNode, CoralRootNode } from '@structures/coral'
export type { CoralColorType } from '@structures/color'
export type { CoralComponentPropertyType } from '@structures/componentProperty'
export type { CoralDependencyType } from '@structures/dependency'
export type { CoralDesignTokenType } from '@structures/designToken'
export type { Dimension, DimensionUnit } from '@structures/dimension'
export type { CoralGradientType } from '@structures/gradient'
export type { CoralImportType } from '@structures/import'
export type { CoralMethodType } from '@structures/method'
export type { CoralStateType } from '@structures/state'
export type { CoralStyleType } from '@structures/styles'
export type {
  BreakpointType,
  SimpleBreakpoint,
  RangeBreakpoint,
  Breakpoint,
  ResponsiveStyle,
  CoralResponsiveStyles,
} from '@structures/responsiveStyles'
export type { CoralVariantType } from '@structures/variant'
export type { CoralTSTypes } from '@structures/TStypes'
export type { CoralElementType } from '@structures/utilities'

export { pascalCaseString } from '@utils/pascalCaseString'
