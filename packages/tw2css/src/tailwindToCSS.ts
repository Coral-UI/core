import { convertTailwindScaletoPixels } from '@/convertTailwindScaletoPixels'
import { mappings } from '@/mappings'

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

const screenReaderOnly = {
  'sr-only': {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
}

const notScreenReaderOnly = {
  'not-sr-only': {
    position: 'static',
    width: 'auto',
    height: 'auto',
    padding: 0,
    margin: 0,
    overflow: 'visible',
    clip: 'auto',
    whiteSpace: 'normal',
  },
}

type StylesWithModifiers = Styles & {
  [key: string]: Styles
}

const createStyleObject = (styles: StylesWithModifiers, className: string) => {
  if (className === 'sr-only') {
    return { ...styles, ...screenReaderOnly }
  } else if (className === 'not-sr-only') {
    return { ...styles, ...notScreenReaderOnly }
  }

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
      if (property === 'bg') {
        return {
          ...styles,
          backgroundColor: convertTailwindScaletoPixels(`${subProperty}-${rest}`),
        }
      } else {
        const classes = {
          ...(mappings[mappingKey] as string[])?.reduce(
            (acc, name) => ({
              ...acc,
              [name]: convertTailwindScaletoPixels(rest.length > 0 ? rest : subProperty),
            }),
            {},
          ),
        }

        return { ...styles, ...classes }
      }
    } else {
      if (property === 'text') {
        // Check for line-height via slash syntax
        const [fontSize, lineHeight] = subProperty?.split('/') || []
        if (lineHeight) {
          const fontSizeValue = mappings[`text-${fontSize}`] as { property: string; value: string | number }[]
          const lineHeightValue = mappings[`leading-${lineHeight}`] as {
            property: string
            value: string | number
          }
          return {
            ...styles,
            ...fontSizeValue
              ?.map((item) => ({ [item.property]: item.value }))
              .reduce((acc, item) => ({ ...acc, ...item }), {}),
            lineHeight: lineHeightValue?.value,
          }
        } else if (convertTailwindScaletoPixels(`${subProperty}-${rest}`) || convertTailwindScaletoPixels(rest)) {
          return {
            ...styles,
            color: convertTailwindScaletoPixels(`${subProperty}-${rest}`) || convertTailwindScaletoPixels(rest),
          }
        }
      }
    }

    return styles
  }
}

const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
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
        if (modifier in breakpoints) {
          modifier = `${breakpoints[modifier as keyof typeof breakpoints]}`
        } else {
          modifier = `:${modifier}`
        }

        if (!currentLevel[modifier]) {
          currentLevel[`${modifier}`] = {}
        }
        if (index === modifiers.length - 1) {
          currentLevel[`${modifier}`] = {
            ...currentLevel[`${modifier}`],
            ...createStyleObject({}, propertyClass),
          }
        } else {
          currentLevel = currentLevel[`${modifier}`] as StylesWithModifiers
        }
      })
    } else {
      styles = { ...styles, ...createStyleObject({}, className) }
    }
  })

  return styles
}
