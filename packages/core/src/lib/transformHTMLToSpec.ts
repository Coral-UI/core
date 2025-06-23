import { CoralRootNode } from '@/structures/coral'
import { parseHTMLNodeToSpec } from '@utils/parseHTMLNodeToSpec'
import { HTMLElement, parse } from 'node-html-parser'

export const transformHTMLToSpec = (html: string): CoralRootNode => {
  // Strip leading/trailing whitespace and normalize internal whitespace
  const normalizedHtml = html
    .trim()
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/\s+/g, ' ') // Normalize whitespace
  const root = parse(normalizedHtml)

  if (!root) {
    throw new Error('Invalid HTML')
  } else if (root.childNodes.length === 0) {
    throw new Error('Empty HTML')
  }

  // Find the first element child (skip text nodes, comments, etc.)
  const firstElementChild = root.childNodes.find(
    (child) => child instanceof HTMLElement
  ) as HTMLElement

  if (!firstElementChild) {
    throw new Error('Invalid HTML')
  }

  return parseHTMLNodeToSpec(firstElementChild)
}
