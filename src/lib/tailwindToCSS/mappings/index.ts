import { alignContent } from '@/lib/tailwindToCSS/mappings/alignContent'
import { alignItems } from '@/lib/tailwindToCSS/mappings/alignItems'
import { alignSelf } from '@/lib/tailwindToCSS/mappings/alignSelf'
import { backgrounds } from '@/lib/tailwindToCSS/mappings/backgrounds'
import { borderRadius } from '@/lib/tailwindToCSS/mappings/borderRadius'
import { borderStyle } from '@/lib/tailwindToCSS/mappings/borderStyle'
import { borderWidth } from '@/lib/tailwindToCSS/mappings/borderWidth'
import { content } from '@/lib/tailwindToCSS/mappings/content'
import { display } from '@/lib/tailwindToCSS/mappings/display'
import { flex } from '@/lib/tailwindToCSS/mappings/flex'
import { flexBasis } from '@/lib/tailwindToCSS/mappings/flexBasis'
import { flexDirection } from '@/lib/tailwindToCSS/mappings/flexDirection'
import { flexGrow } from '@/lib/tailwindToCSS/mappings/flexGrow'
import { flexShrink } from '@/lib/tailwindToCSS/mappings/flexShrink'
import { flexWrap } from '@/lib/tailwindToCSS/mappings/flexWrap'
import { fontFamily } from '@/lib/tailwindToCSS/mappings/fontFamily'
import { fontSize } from '@/lib/tailwindToCSS/mappings/fontSize'
import { fontSmoothing } from '@/lib/tailwindToCSS/mappings/fontSmoothing'
import { fontStyle } from '@/lib/tailwindToCSS/mappings/fontStyle'
import { fontVariantNumeric } from '@/lib/tailwindToCSS/mappings/fontVariantNumeric'
import { fontWeight } from '@/lib/tailwindToCSS/mappings/fontWeight'
import { gap } from '@/lib/tailwindToCSS/mappings/gap'
import { gridAutoColumns } from '@/lib/tailwindToCSS/mappings/gridAutoColumns'
import { gridAutoFlow } from '@/lib/tailwindToCSS/mappings/gridAutoFlow'
import { gridAutoRows } from '@/lib/tailwindToCSS/mappings/gridAutoRows'
import { gridColumnStartEnd } from '@/lib/tailwindToCSS/mappings/gridColumnStartEnd'
import { gridRowStartEnd } from '@/lib/tailwindToCSS/mappings/gridRowStartEnd'
import { gridTemplateColumns } from '@/lib/tailwindToCSS/mappings/gridTemplateColumns'
import { gridTemplateRows } from '@/lib/tailwindToCSS/mappings/gridTemplateRows'
import { hyphens } from '@/lib/tailwindToCSS/mappings/hyphens'
import { justifyContent } from '@/lib/tailwindToCSS/mappings/justifyContent'
import { justifyItems } from '@/lib/tailwindToCSS/mappings/justifyItems'
import { justifySelf } from '@/lib/tailwindToCSS/mappings/justifySelf'
import { letterSpacing } from '@/lib/tailwindToCSS/mappings/letterSpacing'
import { lineClamp } from '@/lib/tailwindToCSS/mappings/lineClamp'
import { lineHeight } from '@/lib/tailwindToCSS/mappings/lineHeight'
import { listStyleImage } from '@/lib/tailwindToCSS/mappings/listStyleImage'
import { listStylePosition } from '@/lib/tailwindToCSS/mappings/listStylePosition'
import { listStyleType } from '@/lib/tailwindToCSS/mappings/listStyleType'
import { margin } from '@/lib/tailwindToCSS/mappings/margin'
import { objectFit } from '@/lib/tailwindToCSS/mappings/objectFit'
import { order } from '@/lib/tailwindToCSS/mappings/order'
import { overflow } from '@/lib/tailwindToCSS/mappings/overflow'
import { padding } from '@/lib/tailwindToCSS/mappings/padding'
import { placeContent } from '@/lib/tailwindToCSS/mappings/placeContent'
import { placeItems } from '@/lib/tailwindToCSS/mappings/placeItems'
import { placeSelf } from '@/lib/tailwindToCSS/mappings/placeSelf'
import { position } from '@/lib/tailwindToCSS/mappings/position'
import { height, maxHeight, maxWidth, minHeight, minWidth, size, width } from '@/lib/tailwindToCSS/mappings/sizing'
import { spaceBetween } from '@/lib/tailwindToCSS/mappings/spaceBetween'
import { textAlign } from '@/lib/tailwindToCSS/mappings/textAlign'
import { textDecoration } from '@/lib/tailwindToCSS/mappings/textDecoration'
import { textDecorationStyle } from '@/lib/tailwindToCSS/mappings/textDecorationStyle'
import { textDecorationThickness } from '@/lib/tailwindToCSS/mappings/textDecorationThickness'
import { textIndent } from '@/lib/tailwindToCSS/mappings/textIndent'
import { textOverflow } from '@/lib/tailwindToCSS/mappings/textOverflow'
import { textTransform } from '@/lib/tailwindToCSS/mappings/textTransform'
import { textUnderlineOffset } from '@/lib/tailwindToCSS/mappings/textUnderlineOffset'
import { textWrap } from '@/lib/tailwindToCSS/mappings/textWrap'
import { verticalAlign } from '@/lib/tailwindToCSS/mappings/verticalAlign'
import { whitespace } from '@/lib/tailwindToCSS/mappings/whitespace'
import { wordBreak } from '@/lib/tailwindToCSS/mappings/wordBreak'
import { zIndex } from '@/lib/tailwindToCSS/mappings/zIndex'

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
  ...height,
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
