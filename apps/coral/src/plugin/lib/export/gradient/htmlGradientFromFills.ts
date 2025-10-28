import { CoralGradientType } from '@reallygoodwork/coral-core'

import { htmlAngularGradient } from './htmlAngularGradient'
import { htmlLinearGradient } from './htmlLinearGradient'
import { htmlRadialGradient } from './htmlRadialGradient'
import { retrieveTopFill } from './retrieveTopFill'

export const htmlGradientFromFills = (fills: ReadonlyArray<Paint> | PluginAPI['mixed']): CoralGradientType | string => {
  const fill = retrieveTopFill(fills)
  if (fill?.type === 'GRADIENT_LINEAR') {
    return htmlLinearGradient(fill)
  } else if (fill?.type === 'GRADIENT_ANGULAR') {
    return htmlAngularGradient(fill)
  } else if (fill?.type === 'GRADIENT_RADIAL') {
    return htmlRadialGradient(fill)
  }
  return ''
}
