import { convertRGBToCoralColor } from '../utils/convertRGBToCoralColor'
import { gradientAngle2 } from './gradientAngle2'

export const htmlAngularGradient = (fill: GradientPaint): string => {
  const angle = gradientAngle2(fill).toFixed(0)
  const centerX = (fill.gradientTransform[0][2] * 100).toFixed(2)
  const centerY = (fill.gradientTransform[1][2] * 100).toFixed(2)

  const mappedFill = fill.gradientStops
    .map((stop) => {
      const color = convertRGBToCoralColor(stop.color, stop.color.a * (fill.opacity ?? 1))
      const position = `${(stop.position * 360).toFixed(0)}deg`
      return `${color} ${position}`
    })
    .join(', ')

  return `conic-gradient(from ${angle}deg at ${centerX}% ${centerY}%, ${mappedFill})`
}
