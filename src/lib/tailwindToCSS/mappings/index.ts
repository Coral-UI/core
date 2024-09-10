import { alignContent } from './alignContent'
import { alignItems } from './alignItems'
import { alignSelf } from './alignSelf'
import { backgrounds } from './backgrounds'
import { borderRadius } from './borderRadius'
import { borderStyle } from './borderStyle'
import { borderWidth } from './borderWidth'
import { content } from './content'
import { display } from './display'
import { flex } from './flex'
import { flexBasis } from './flexBasis'
import { flexDirection } from './flexDirection'
import { flexGrow } from './flexGrow'
import { flexShrink } from './flexShrink'
import { flexWrap } from './flexWrap'
import { fontFamily } from './fontFamily'
import { fontSize } from './fontSize'
import { fontSmoothing } from './fontSmoothing'
import { fontStyle } from './fontStyle'
import { fontVariantNumeric } from './fontVariantNumeric'
import { fontWeight } from './fontWeight'
import { gap } from './gap'
import { gridAutoColumns } from './gridAutoColumns'
import { gridAutoFlow } from './gridAutoFlow'
import { gridAutoRows } from './gridAutoRows'
import { gridColumnStartEnd } from './gridColumnStartEnd'
import { gridRowStartEnd } from './gridRowStartEnd'
import { gridTemplateColumns } from './gridTemplateColumns'
import { gridTemplateRows } from './gridTemplateRows'
import { hyphens } from './hyphens'
import { justifyContent } from './justifyContent'
import { justifyItems } from './justifyItems'
import { justifySelf } from './justifySelf'
import { letterSpacing } from './letterSpacing'
import { lineClamp } from './lineClamp'
import { lineHeight } from './lineHeight'
import { listStyleImage } from './listStyleImage'
import { listStylePosition } from './listStylePosition'
import { listStyleType } from './listStyleType'
import { margin } from './margin'
import { objectFit } from './objectFit'
import { order } from './order'
import { overflow } from './overflow'
import { padding } from './padding'
import { placeContent } from './placeContent'
import { placeItems } from './placeItems'
import { placeSelf } from './placeSelf'
import { position } from './position'
import { maxHeight, maxWidth, minHeight, minWidth, size, width } from './sizing'
import { spaceBetween } from './spaceBetween'
import { textAlign } from './textAlign'
import { textDecoration } from './textDecoration'
import { textDecorationStyle } from './textDecorationStyle'
import { textDecorationThickness } from './textDecorationThickness'
import { textIndent } from './textIndent'
import { textOverflow } from './textOverflow'
import { textTransform } from './textTransform'
import { textUnderlineOffset } from './textUnderlineOffset'
import { textWrap } from './textWrap'
import { verticalAlign } from './verticalAlign'
import { whitespace } from './whitespace'
import { wordBreak } from './wordBreak'
import { zIndex } from './zIndex'

interface Mapping {
  [key: string]:
    | { property: string; value: string | number }
    | { property: string; value: string | number }[]
    | string[]
}

export const mappings: Mapping = {
  ...alignContent,
  ...alignItems,
  ...alignSelf,
  ...backgrounds,
  ...borderRadius,
  ...borderStyle,
  ...borderWidth,
  ...content,
  ...display,
  ...flex,
  ...flexBasis,
  ...flexDirection,
  ...flexGrow,
  ...flexShrink,
  ...flexWrap,
  ...fontFamily,
  ...fontSize,
  ...fontSmoothing,
  ...fontStyle,
  ...fontVariantNumeric,
  ...fontWeight,
  ...gap,
  ...gridAutoColumns,
  ...gridAutoFlow,
  ...gridAutoRows,
  ...gridColumnStartEnd,
  ...gridRowStartEnd,
  ...gridTemplateColumns,
  ...gridTemplateRows,
  ...hyphens,
  ...justifyContent,
  ...justifyItems,
  ...justifySelf,
  ...letterSpacing,
  ...lineClamp,
  ...lineHeight,
  ...listStyleImage,
  ...listStylePosition,
  ...listStyleType,
  ...margin,
  ...objectFit,
  ...order,
  ...overflow,
  ...padding,
  ...placeContent,
  ...placeItems,
  ...placeSelf,
  ...position,
  ...spaceBetween,
  ...textAlign,
  ...textDecoration,
  ...textDecorationStyle,
  ...textDecorationThickness,
  ...textIndent,
  ...textOverflow,
  ...textTransform,
  ...textUnderlineOffset,
  ...textWrap,
  ...verticalAlign,
  ...whitespace,
  ...wordBreak,
  ...zIndex,
  ...width,
  ...maxWidth,
  ...minWidth,
  ...minHeight,
  ...maxHeight,
  ...size,
}
