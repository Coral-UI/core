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

console.log(
  transformHTMLToSpec(`<div class="bg-green-50 px-6 py-24 sm:focus:py-32 lg:px-8">
  <div class="mx-auto max-w-2xl text-center">
    <p class="text-base font-semibold leading-7 text-indigo-600">Get the help you need</p>
    <h2 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Support center</h2>
    <p class="mt-6 text-lg leading-8 text-gray-600">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
  </div>
</div>`),
)
