export const loadFont = (fontFamily: string, fontStyle: string) => {
  return figma.loadFontAsync({
    family: fontFamily,
    style: fontStyle,
  })
}
