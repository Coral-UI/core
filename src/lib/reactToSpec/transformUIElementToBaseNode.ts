import { BaseNode } from '@/config/UISpec'
import { UIElement } from '@/lib/reactToSpec/transformReactComponentToSpec'
import { tailwindToCSS } from '@/lib/tailwindToCSS/tailwindToCSS'

export const transformUIElementToBaseNode = (element: UIElement): BaseNode => {
  const { className, styles, ...otherProps } = element.props as {
    className?: string
    styles?: unknown
    [key: string]: unknown
  }

  return {
    elementType: element.elementType,
    props: otherProps as Record<string, string | { type: string; name: string }>,
    isComponent: element.isComponent,
    importSource: element.importSource,
    name: element.elementType,
    methods: [],
    stateHooks: [],
    componentName: element.elementType,
    styles: {
      ...(styles ? styles : {}),
      ...tailwindToCSS(className || ''),
    },
    children: element.children.map(transformUIElementToBaseNode),
  }
}
