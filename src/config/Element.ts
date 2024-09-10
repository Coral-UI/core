import z from 'zod'

export type Element =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'a'
  | 'img'
  | 'ul'
  | 'li'
  | 'ol'
  | 'nav'
  | 'div'
  | 'section'
  | 'footer'
  | 'header'
  | 'button'
  | 'input'
  | 'form'
  | 'textarea'
  | 'select'
  | 'option'
  | 'table'
  | 'tr'
  | 'td'
  | 'th'
  | 'article'
  | 'aside'
  | 'main'
  | 'figure'
  | 'figcaption'
  | 'strong'
  | 'em'
  | 'code'
  | 'pre'
  | 'blockquote'
  | 'hr'
  | 'br'
  | 'label'
  | 'fieldset'
  | 'legend'
  | 'audio'
  | 'video'
  | 'source'
  | 'canvas'

export const zElementSchema = z.union([
  z.literal('h1'),
  z.literal('h2'),
  z.literal('h3'),
  z.literal('h4'),
  z.literal('h5'),
  z.literal('h6'),
  z.literal('p'),
  z.literal('span'),
  z.literal('a'),
  z.literal('img'),
  z.literal('ul'),
  z.literal('li'),
  z.literal('ol'),
  z.literal('nav'),
  z.literal('div'),
  z.literal('section'),
  z.literal('footer'),
  z.literal('header'),
  z.literal('button'),
  z.literal('input'),
  z.literal('form'),
  z.literal('textarea'),
  z.literal('select'),
  z.literal('option'),
  z.literal('table'),
  z.literal('tr'),
  z.literal('td'),
  z.literal('th'),
  z.literal('article'),
  z.literal('aside'),
  z.literal('main'),
  z.literal('figure'),
  z.literal('figcaption'),
  z.literal('strong'),
  z.literal('em'),
  z.literal('code'),
  z.literal('pre'),
  z.literal('blockquote'),
  z.literal('hr'),
  z.literal('br'),
  z.literal('label'),
  z.literal('fieldset'),
  z.literal('legend'),
  z.literal('audio'),
  z.literal('video'),
  z.literal('source'),
  z.literal('canvas'),
])

export type TypescriptElementTypes = HTMLElementTagNameMap[Element]
