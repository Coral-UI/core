const borderScale = [0, 1, 2, 4, 8]

const borderClassnames = ['border-s', 'border-e', 'border-t', 'border-b', 'border-x', 'border-y', 'border']

const borderWidthMappings: Record<string, unknown> = {}

borderClassnames.forEach((classname) => {
  borderWidthMappings[classname] = {
    property: 'borderWidth',
    value: 1,
  }
  borderScale.forEach((scale) => {
    if (scale !== 1) {
      borderWidthMappings[`${classname}-${scale}`] = {
        property: 'borderWidth',
        value: scale,
      }
    }
  })
})

export const borderWidth = borderWidthMappings
