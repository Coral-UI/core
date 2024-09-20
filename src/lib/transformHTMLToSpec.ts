import { BaseNode } from '@/config/UISpec'
import { parseHTMLNodeToSpec } from '@utils/parseHTMLNodeToSpec'
import { HTMLElement, parse } from 'node-html-parser'

export const transformHTMLToSpec = (html: string): BaseNode => {
  const root = parse(html)

  if (!root) {
    throw new Error('Invalid HTML')
  } else if (root.childNodes.length === 0) {
    throw new Error('Empty HTML')
  }

  const firstChild = root.firstChild?.rawTagName
  if (!firstChild) {
    throw new Error('Invalid HTML')
  }

  return parseHTMLNodeToSpec(root.firstChild as HTMLElement)
}
