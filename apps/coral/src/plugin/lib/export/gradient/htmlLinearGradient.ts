import { CoralGradientType } from '@reallygoodwork/coral-core'

import { convertRGBToCoralColor } from '../utils/convertRGBToCoralColor'
import { cssGradientAngle } from './cssGradientAngle'
import { gradientAngle2 } from './gradientAngle2'

export const htmlLinearGradient = (fill: GradientPaint): CoralGradientType => {
  // Adjust angle for CSS.
  const figmaAngle = gradientAngle2(fill)
  const angle = cssGradientAngle(figmaAngle).toFixed(0)

  return {
    type: 'linear',
    angle: Number(angle),
    colors: fill.gradientStops.map((stop) => ({
      color: convertRGBToCoralColor(stop.color, stop.color.a * (fill.opacity ?? 1)),
      position: stop.position,
    })),
  }
}
