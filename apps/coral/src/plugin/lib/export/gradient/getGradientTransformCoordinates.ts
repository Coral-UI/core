export const getGradientTransformCoordinates = (
  gradientTransform: number[][],
): { centerX: string; centerY: string; radiusX: string; radiusY: string } => {
  const a = gradientTransform[0]![0]!
  const b = gradientTransform[0]![1]!
  const c = gradientTransform[1]![0]!
  const d = gradientTransform[1]![1]!
  const e = gradientTransform[0]![2]!
  const f = gradientTransform[1]![2]!

  const scaleX = Math.sqrt(a ** 2 + b ** 2)
  const scaleY = Math.sqrt(c ** 2 + d ** 2)

  // const rotationAngle = Math.atan2(b, a)

  const centerX = ((e * scaleX * 100) / (1 - scaleX)).toFixed(2)
  const centerY = (((1 - f) * scaleY * 100) / (1 - scaleY)).toFixed(2)

  const radiusX = (scaleX * 100).toFixed(2)
  const radiusY = (scaleY * 100).toFixed(2)

  return { centerX, centerY, radiusX, radiusY }
}
