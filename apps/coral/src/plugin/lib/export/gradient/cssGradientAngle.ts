export const cssGradientAngle = (angle: number): number => {
  // Convert Figma angle to CSS angle.
  const cssAngle = angle // Subtract 235 to make it start from the correct angle.
  // Normalize angle: if negative, add 360 to make it positive.
  return cssAngle < 0 ? cssAngle + 360 : cssAngle
}
