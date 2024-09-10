const borderScale = [0, 1, 2, 4, 8]

const borderClassnames = ['border-s', 'border-e', 'border-t', 'border-b', 'border-x', 'border-y', 'border']

const borderWidthMappings: Record<string, unknown> = {}

borderClassnames.forEach((classname) => {
  borderWidthMappings[classname] = {
    property: 'border-width',
    value: 1,
  }
  borderScale.forEach((scale) => {
    if (scale !== 1) {
      borderWidthMappings[`${classname}-${scale}`] = {
        property: 'border-width',
        value: scale,
      }
    }
  })
})

export const borderWidth = borderWidthMappings
