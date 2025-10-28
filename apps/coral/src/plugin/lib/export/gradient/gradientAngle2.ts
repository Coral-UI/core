export const gradientAngle2 = (fill: GradientPaint): number => {
  const x1 = fill.gradientTransform[0][2]
  const y1 = fill.gradientTransform[1][2]
  const x2 = fill.gradientTransform[0][0] + x1
  const y2 = fill.gradientTransform[1][0] + y1
  const dx = x2 - x1
  const dy = y1 - y2
  const radians = Math.atan2(dy, dx)
  const unadjustedAngle = (radians * 180) / Math.PI
  const adjustedAngle = unadjustedAngle + 90
  return adjustedAngle
}
