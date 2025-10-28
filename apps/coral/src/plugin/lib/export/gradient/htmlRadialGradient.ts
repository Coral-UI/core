import { convertRGBToCoralColor } from '../utils/convertRGBToCoralColor'
import { getGradientTransformCoordinates } from './getGradientTransformCoordinates'

export const htmlRadialGradient = (fill: GradientPaint): string => {
  const mappedFill = fill.gradientStops
    .map((stop) => {
      const color = convertRGBToCoralColor(stop.color, stop.color.a * (fill.opacity ?? 1))
      const position = `${(stop.position * 100).toFixed(0)}%`
      return `${color} ${position}`
    })
    .join(', ')

  const { centerX, centerY, radiusX, radiusY } = getGradientTransformCoordinates(fill.gradientTransform)

  return `radial-gradient(${radiusX}% ${radiusY}% at ${centerX}% ${centerY}%, ${mappedFill})`
}
