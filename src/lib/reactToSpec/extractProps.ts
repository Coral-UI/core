import { Props } from '@/config/Props'
import { getTypeFromAnnotation } from '@/lib/reactToSpec/getTypeFromAnnotation'
import * as t from '@babel/types'

export const extractProps = (param: t.Node | null): Props | undefined => {
  if (!param) return undefined

  const props: Record<string, { name: string; type: string }> = {}

  if (param.type === 'ObjectPattern') {
    param.properties.forEach((prop) => {
      if (prop.type === 'RestElement') {
        props[`...${(prop.argument as t.Identifier).name}`] = {
          name: `...${(prop.argument as t.Identifier).name}`,
          type: 'any',
        }
      } else {
        const name = (prop.key as t.Identifier).name

        let type = 'any'

        // Handle inline prop types
        if (param.typeAnnotation && t.isTSTypeAnnotation(param.typeAnnotation)) {
          const typeAnnotation = param.typeAnnotation.typeAnnotation
          if (t.isTSTypeLiteral(typeAnnotation)) {
            const memberType = typeAnnotation.members.find(
              (member): member is t.TSPropertySignature =>
                t.isTSPropertySignature(member) && t.isIdentifier(member.key) && member.key.name === name,
            )
            if (memberType && memberType.typeAnnotation) {
              type = getTypeFromAnnotation(memberType.typeAnnotation)
            }
          }
        }

        props[name] = { name, type }
      }
    })
  } else if (param.type === 'Identifier') {
    const type =
      param.typeAnnotation && (t.isTSTypeAnnotation(param.typeAnnotation) || t.isTypeAnnotation(param.typeAnnotation))
        ? getTypeFromAnnotation(param.typeAnnotation)
        : 'any'
    props[param.name] = { name: param.name, type }
  }

  return Object.keys(props).length > 0 ? props : undefined
}
