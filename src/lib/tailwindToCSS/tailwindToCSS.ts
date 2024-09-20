import { mappings } from '@/lib/tailwindToCSS/mappings'
import { convertTailwindScaletoPixels } from '@lib/tailwindToCSS/convertTailwindScaletoPixels'

type Styles = {
  paddingInlineStart?: string
  paddingInlineEnd?: string
  paddingBlockStart?: string
  paddingBlockEnd?: string
  padding?: string
  marginInlineStart?: string
  marginInlineEnd?: string
  marginBlockStart?: string
  marginBlockEnd?: string
  margin?: string
  position?: string
  top?: string
  right?: string
  bottom?: string
  left?: string
  display?: string
  flexDirection?: string
  justifyContent?: string
  alignItems?: string
  flexWrap?: string
  gap?: string
  width?: string
  height?: string
  backgroundColor?: string
  color?: string
  fontSize?: string
  fontWeight?: string
  border?: string
  borderRadius?: string
  cursor?: string
  zIndex?: string
  overflow?: string
  boxShadow?: string
  transform?: string
  transition?: string
  opacity?: string
}

type StylesWithModifiers = Styles & {
  [key: string]: Styles
}

const createStyleObject = (styles: StylesWithModifiers, className: string) => {
  if (Object.prototype.hasOwnProperty.call(mappings, className)) {
    if (Array.isArray(mappings[className])) {
      return {
        ...styles,
        ...Object.fromEntries(
          mappings[className].map((item) => {
            if (typeof item === 'object' && 'property' in item && 'value' in item) {
              return [item.property, item.value]
            }
            return []
          }),
        ),
      }
    } else {
      const mapping = mappings[className]
      return mapping && typeof mapping === 'object' && 'property' in mapping && 'value' in mapping
        ? { ...styles, [mapping.property]: mapping.value }
        : styles
    }
  } else {
    const splitName = className.split('-')
    const property = splitName[0]
    const subProperty = splitName[1]
    const rest = splitName.slice(2).join('-')
    if (Array.isArray(mappings[`${property}-`]) || Array.isArray(mappings[`${property}-${subProperty}-`])) {
      const mappingKey = Array.isArray(mappings[`${property}-${subProperty}-`])
        ? `${property}-${subProperty}-`
        : `${property}-`
      const classes = {
        ...(mappings[mappingKey] as string[])?.reduce(
          (acc, name) => ({
            ...acc,
            [name]: convertTailwindScaletoPixels(rest),
          }),
          {},
        ),
      }

      return { ...styles, ...classes }
    }

    return styles
  }
}

export const tailwindToCSS = (tailwind: string) => {
  const classes = tailwind.split(' ')
  let styles: StylesWithModifiers = {}

  classes.forEach((className) => {
    // Check for Tailwind modifiers
    const parts = className.split(':')
    if (parts.length > 1) {
      const propertyClass = parts.pop() || ''
      const modifiers = parts

      let currentLevel = styles
      modifiers.forEach((modifier, index) => {
        if (!currentLevel[modifier]) {
          currentLevel[modifier] = {}
        }
        if (index === modifiers.length - 1) {
          currentLevel[modifier] = {
            ...currentLevel[modifier],
            ...createStyleObject({}, propertyClass),
          }
        } else {
          currentLevel = currentLevel[modifier] as StylesWithModifiers
        }
      })
    } else {
      styles = { ...styles, ...createStyleObject({}, className) }
    }
  })

  return styles
}
