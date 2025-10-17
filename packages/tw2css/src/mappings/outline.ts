// Outline width scale matches Tailwind CSS defaults
const outlineWidthScale = [0, 1, 2, 4, 8]

const outlineWidthMappings: Record<string, unknown> = {}

// outline (default is 1px solid)
outlineWidthMappings['outline'] = {
  property: 'outlineWidth',
  value: 1,
}

// outline-<number>
outlineWidthScale.forEach((scale) => {
  if (scale !== 1) {
    outlineWidthMappings[`outline-${scale}`] = {
      property: 'outlineWidth',
      value: scale,
    }
  }
})

// Outline style mappings
const outlineStyleMappings: Record<string, unknown> = {
  'outline-none': [
    { property: 'outline', value: '2px solid transparent' },
    { property: 'outlineOffset', value: 2 },
  ],
  'outline-dashed': {
    property: 'outlineStyle',
    value: 'dashed',
  },
  'outline-dotted': {
    property: 'outlineStyle',
    value: 'dotted',
  },
  'outline-double': {
    property: 'outlineStyle',
    value: 'double',
  },
  'outline-solid': {
    property: 'outlineStyle',
    value: 'solid',
  },
}

// Outline offset mappings (common values)
const outlineOffsetScale = [0, 1, 2, 4, 8]
const outlineOffsetMappings: Record<string, unknown> = {}

outlineOffsetScale.forEach((scale) => {
  outlineOffsetMappings[`outline-offset-${scale}`] = {
    property: 'outlineOffset',
    value: scale,
  }
})

// Outline color support (works with color scale like outline-indigo-600)
const outlineColorMappings: Record<string, unknown> = {
  'outline-': ['outlineColor'],
}

export const outline = {
  ...outlineWidthMappings,
  ...outlineStyleMappings,
  ...outlineOffsetMappings,
  ...outlineColorMappings,
}
