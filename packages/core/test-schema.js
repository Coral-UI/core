const { zCoralRootSchema } = require('./dist/structures/coral')

const testData = {
  name: 'Div',
  elementType: 'div',
  styles: {
    backgroundColor: {
      hex: '#ffffff',
      rgb: { r: 255, g: 255, b: 255, a: 1 },
      hsl: { h: 0, s: 0, l: 100, a: 1 },
    },
  },
}

const result = zCoralRootSchema.safeParse(testData)
if (!result.success) {
  console.log('Error:', JSON.stringify(result.error.issues, null, 2))
} else {
  console.log('Success!')
}
