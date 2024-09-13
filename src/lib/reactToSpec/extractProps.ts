const extractProps = (param: any) => {
  if (!param) return

  if (param.type === 'ObjectPattern') {
    // Destructured props: function Component({ prop1, prop2 })
    return param.properties.map((prop) => (prop.type === 'RestElement' ? `...${prop.argument.name}` : prop.key.name))
  } else if (param.type === 'Identifier') {
    // Single props object: function Component(props)
    return param.name
  }
}
