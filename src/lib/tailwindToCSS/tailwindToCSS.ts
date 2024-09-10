import { convertTailwindScaletoPixels } from '@lib/tailwindToCSS/convertTailwindScaletoPixels'

import { mappings } from './mappings'

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
    const rest = splitName.slice(1).join('-')
    if (Array.isArray(mappings[`${property}-`])) {
      const classes = {
        ...(mappings[`${property}-`] as string[])?.reduce(
          (acc, name) => ({
            ...acc,
            [name]: convertTailwindScaletoPixels(rest),
          }),
          {},
        ),
      }

      const el = {
        ...styles,
        ...classes,
      }

      return el
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
      const modifierClassName = parts[0] ?? ''
      const otherModifiers = parts.slice(1)

      if (otherModifiers.length > 0) {
        otherModifiers.forEach((modifier) => {
          styles[modifierClassName] = {
            ...styles[modifierClassName],
            [`${modifier}`]: createStyleObject(styles, modifier),
          }
        })
      } else {
        if (Object.prototype.hasOwnProperty.call(styles, modifierClassName)) {
          styles[modifierClassName] = { ...createStyleObject(styles, propertyClass || '') }
        } else {
          styles = {
            ...styles,
            [`${modifierClassName}`]: { ...createStyleObject(styles[modifierClassName] || {}, propertyClass || '') },
          }
        }
      }
    } else {
      styles = { ...createStyleObject(styles, className) }
    }
  })

  return styles
}
