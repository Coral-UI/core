import { getTypeFromAnnotation } from '@/getTypeFromAnnotation'
import * as t from '@babel/types'

import type { CoralComponentPropertyType, CoralTSTypes } from '@reallygoodwork/coral-core'

export const extractProps = (param: t.Node | null): CoralComponentPropertyType | undefined => {
  if (!param) return undefined

  const props: Record<string, { value: string; type: CoralTSTypes | Array<CoralTSTypes> }> = {}

  if (param.type === 'ObjectPattern') {
    param.properties.forEach((prop) => {
      if (prop.type === 'RestElement') {
        props[`...${(prop.argument as t.Identifier).name}`] = {
          value: `...${(prop.argument as t.Identifier).name}`,
          type: 'any',
        }
      } else {
        const name = (prop.key as t.Identifier).name

        let type = 'any' as CoralTSTypes

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

        props[name] = { value: name, type: type }
      }
    })
  } else if (param.type === 'Identifier') {
    const type =
      param.typeAnnotation && (t.isTSTypeAnnotation(param.typeAnnotation) || t.isTypeAnnotation(param.typeAnnotation))
        ? getTypeFromAnnotation(param.typeAnnotation)
        : 'any'
    props[param.name] = { value: param.name, type: type }
  }

  return Object.keys(props).length > 0 ? props : undefined
}
