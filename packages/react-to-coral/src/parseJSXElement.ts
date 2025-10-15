import { findImportSource } from '@/findImportSource'
import { parseJSXAttributeValue } from '@/parseJSXAttributeValue'
import { Result, UIElement } from '@/transformReactComponentToSpec'
import generate from '@babel/generator'
import * as t from '@babel/types'

import type {
  CoralComponentPropertyType,
  CoralMethodType,
  CoralStateType,
  CoralTSTypes,
} from '@reallygoodwork/coral-core'

/**
 * Helper function to get the type and additional info of a prop from component properties
 */
const getPropInfo = (
  propName: string,
  result: Result,
): { type: CoralTSTypes | string; optional?: boolean; defaultValue?: any; description?: string } => {
  if (!result.componentProperties || result.componentProperties.length === 0) {
    return { type: 'any' }
  }

  // Get the first component properties object (there should typically be only one)
  const props = result.componentProperties[0]
  if (!props || typeof props !== 'object') {
    return { type: 'any' }
  }

  const propDef = props[propName]
  if (!propDef || typeof propDef !== 'object') {
    return { type: 'any' }
  }

  // Return the enhanced property information
  return {
    type: propDef.type || 'any',
    optional: propDef.optional,
    defaultValue: propDef.defaultValue,
    description: propDef.description,
  }
}

export const parseJSXElement = (node: t.JSXElement | t.JSXFragment, result: Result): UIElement => {
  // Handle JSX fragments
  if (t.isJSXFragment(node)) {
    return parseJSXFragment(node, result)
  }

  const elementName = getElementName(node.openingElement.name)
  const isComponent = elementName[0] === elementName[0]?.toUpperCase()
  const importSource = isComponent ? findImportSource(elementName, result) : undefined

  const componentProperties: CoralComponentPropertyType = {}
  const children: UIElement[] = []
  let textContent: string | undefined = undefined

  // Parse props (including spread operators)
  node.openingElement.attributes.forEach((attr) => {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
      const propName = attr.name.name
      const value = parseJSXAttributeValue(
        attr.value,
        result as {
          methods: Array<CoralMethodType>
          stateHooks: Array<CoralStateType>
          componentProperties: Array<CoralComponentPropertyType>
        },
      )

      if (value !== null) {
        // Get the enhanced type and property information
        const propInfo = getPropInfo(propName, result)

        // Store comprehensive property information in the Coral ComponentProperty format
        const propertyData: any = {
          type: propInfo.type,
          value: value,
        }

        // Add optional property metadata
        if (propInfo.optional !== undefined) {
          propertyData.optional = propInfo.optional
        }
        if (propInfo.defaultValue !== undefined) {
          propertyData.defaultValue = propInfo.defaultValue
        }
        if (propInfo.description) {
          propertyData.description = propInfo.description
        }

        componentProperties[propName] = propertyData
      }
    } else if (t.isJSXSpreadAttribute(attr)) {
      // Handle spread attributes like {...props}
      const spreadKey = `...${generate(attr.argument).code}`
      const spreadValue = `{...${generate(attr.argument).code}}`
      componentProperties[spreadKey] = {
        type: 'object',
        value: spreadValue,
      }
    }
  })

  // Parse children (including fragments and expressions)
  node.children.forEach((child) => {
    if (t.isJSXElement(child)) {
      children.push(parseJSXElement(child, result))
    } else if (t.isJSXFragment(child)) {
      children.push(parseJSXElement(child, result))
    } else if (t.isJSXText(child)) {
      const text = child.value.trim()
      if (text) {
        textContent = text
      }
    } else if (t.isJSXExpressionContainer(child)) {
      // Handle JSX expressions in children
      if (!t.isJSXEmptyExpression(child.expression)) {
        const expressionCode = generate(child.expression).code
        children.push({
          elementType: 'jsx-expression',
          isComponent: false,
          componentProperties: {
            expression: {
              type: 'any',
              value: expressionCode,
            },
          },
          children: [],
          textContent: expressionCode,
        })
      }
    }
  })

  return { elementType: elementName, isComponent, importSource, componentProperties, children, textContent }
}

const parseJSXFragment = (node: t.JSXFragment, result: Result): UIElement => {
  const children: UIElement[] = []

  // Parse fragment children
  node.children.forEach((child) => {
    if (t.isJSXElement(child)) {
      children.push(parseJSXElement(child, result))
    } else if (t.isJSXFragment(child)) {
      children.push(parseJSXElement(child, result))
    } else if (t.isJSXText(child)) {
      const text = child.value.trim()
      if (text) {
        children.push({
          elementType: 'text',
          isComponent: false,
          componentProperties: {},
          children: [],
          textContent: text,
        })
      }
    } else if (t.isJSXExpressionContainer(child)) {
      // Handle JSX expressions in fragment children
      if (!t.isJSXEmptyExpression(child.expression)) {
        const expressionCode = generate(child.expression).code
        children.push({
          elementType: 'jsx-expression',
          isComponent: false,
          componentProperties: {
            expression: {
              type: 'any',
              value: expressionCode,
            },
          },
          children: [],
          textContent: expressionCode,
        })
      }
    }
  })

  return {
    elementType: 'React.Fragment',
    isComponent: true,
    componentProperties: {},
    children,
  }
}

const getElementName = (name: t.JSXMemberExpression | t.JSXIdentifier | t.JSXNamespacedName): string => {
  if (t.isJSXIdentifier(name)) {
    return name.name
  } else if (t.isJSXMemberExpression(name)) {
    // Handle component.member syntax (e.g., React.Fragment, Material.Button)
    return `${getElementName(name.object)}.${name.property.name}`
  } else if (t.isJSXNamespacedName(name)) {
    // Handle namespace:name syntax (rare but valid JSX)
    return `${name.namespace.name}:${name.name.name}`
  }
  return 'unknown'
}
