import { alignContent } from '@/mappings/alignContent'
import { alignItems } from '@/mappings/alignItems'
import { alignSelf } from '@/mappings/alignSelf'
import { backgrounds } from '@/mappings/backgrounds'
import { borderRadius } from '@/mappings/borderRadius'
import { borderStyle } from '@/mappings/borderStyle'
import { borderWidth } from '@/mappings/borderWidth'
import { content } from '@/mappings/content'
import { display } from '@/mappings/display'
import { flex } from '@/mappings/flex'
import { flexBasis } from '@/mappings/flexBasis'
import { flexDirection } from '@/mappings/flexDirection'
import { flexGrow } from '@/mappings/flexGrow'
import { flexShrink } from '@/mappings/flexShrink'
import { flexWrap } from '@/mappings/flexWrap'
import { fontFamily } from '@/mappings/fontFamily'
import { fontSize } from '@/mappings/fontSize'
import { fontSmoothing } from '@/mappings/fontSmoothing'
import { fontStyle } from '@/mappings/fontStyle'
import { fontVariantNumeric } from '@/mappings/fontVariantNumeric'
import { fontWeight } from '@/mappings/fontWeight'
import { gap } from '@/mappings/gap'
import { gridAutoColumns } from '@/mappings/gridAutoColumns'
import { gridAutoFlow } from '@/mappings/gridAutoFlow'
import { gridAutoRows } from '@/mappings/gridAutoRows'
import { gridColumnStartEnd } from '@/mappings/gridColumnStartEnd'
import { gridRowStartEnd } from '@/mappings/gridRowStartEnd'
import { gridTemplateColumns } from '@/mappings/gridTemplateColumns'
import { gridTemplateRows } from '@/mappings/gridTemplateRows'
import { hyphens } from '@/mappings/hyphens'
import { isolate } from '@/mappings/isolate'
import { justifyContent } from '@/mappings/justifyContent'
import { justifyItems } from '@/mappings/justifyItems'
import { justifySelf } from '@/mappings/justifySelf'
import { letterSpacing } from '@/mappings/letterSpacing'
import { lineClamp } from '@/mappings/lineClamp'
import { lineHeight } from '@/mappings/lineHeight'
import { listStyleImage } from '@/mappings/listStyleImage'
import { listStylePosition } from '@/mappings/listStylePosition'
import { listStyleType } from '@/mappings/listStyleType'
import { margin } from '@/mappings/margin'
import { objectFit } from '@/mappings/objectFit'
import { objectPosition } from '@/mappings/objectPosition'
import { opacity } from '@/mappings/opacity'
import { order } from '@/mappings/order'
import { outline } from '@/mappings/outline'
import { overflow } from '@/mappings/overflow'
import { padding } from '@/mappings/padding'
import { placeContent } from '@/mappings/placeContent'
import { placeItems } from '@/mappings/placeItems'
import { placeSelf } from '@/mappings/placeSelf'
import { position } from '@/mappings/position'
import { height, maxHeight, maxWidth, minHeight, minWidth, size, width } from '@/mappings/sizing'
import { spaceBetween } from '@/mappings/spaceBetween'
import { textAlign } from '@/mappings/textAlign'
import { textDecoration } from '@/mappings/textDecoration'
import { textDecorationStyle } from '@/mappings/textDecorationStyle'
import { textDecorationThickness } from '@/mappings/textDecorationThickness'
import { textIndent } from '@/mappings/textIndent'
import { textOverflow } from '@/mappings/textOverflow'
import { textTransform } from '@/mappings/textTransform'
import { textUnderlineOffset } from '@/mappings/textUnderlineOffset'
import { textWrap } from '@/mappings/textWrap'
import { verticalAlign } from '@/mappings/verticalAlign'
import { whitespace } from '@/mappings/whitespace'
import { wordBreak } from '@/mappings/wordBreak'
import { zIndex } from '@/mappings/zIndex'

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
  ...isolate,
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
  ...outline,
  ...overflow,
  ...objectPosition,
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
  ...opacity,
}
