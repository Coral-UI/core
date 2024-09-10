import z from 'zod'

declare const zBaseNodeSchema: z.ZodObject<
  {
    elementAttributes: z.ZodOptional<
      z.ZodNullable<
        z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, 'many'>]>>
      >
    >
    elementType: z.ZodEnum<
      [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'a',
        'img',
        'ul',
        'li',
        'ol',
        'nav',
        'div',
        'section',
        'footer',
        'header',
        'button',
        'input',
        'form',
        'textarea',
        'select',
        'option',
        'table',
        'tr',
        'td',
        'th',
        'article',
        'aside',
        'main',
        'figure',
        'figcaption',
        'strong',
        'em',
        'code',
        'pre',
        'blockquote',
        'hr',
        'br',
        'label',
        'fieldset',
        'legend',
        'audio',
        'video',
        'source',
        'canvas',
      ]
    >
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>
    hasBackgroundImage: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>
    isComponent: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>
    name: z.ZodOptional<
      z.ZodNullable<
        z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, string, string>
      >
    >
    styles: z.ZodOptional<
      z.ZodNullable<z.ZodRecord<z.ZodEffects<z.ZodString, string, string>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>
    >
    variants: z.ZodArray<
      z.ZodObject<
        {
          elementType: z.ZodEnum<
            [
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'p',
              'span',
              'a',
              'img',
              'ul',
              'li',
              'ol',
              'nav',
              'div',
              'section',
              'footer',
              'header',
              'button',
              'input',
              'form',
              'textarea',
              'select',
              'option',
              'table',
              'tr',
              'td',
              'th',
              'article',
              'aside',
              'main',
              'figure',
              'figcaption',
              'strong',
              'em',
              'code',
              'pre',
              'blockquote',
              'hr',
              'br',
              'label',
              'fieldset',
              'legend',
              'audio',
              'video',
              'source',
              'canvas',
            ]
          >
          figmaNodeRef: z.ZodOptional<z.ZodNullable<z.ZodString>>
          boundProperties: z.ZodObject<
            {
              propertyName: z.ZodOptional<z.ZodNullable<z.ZodString>>
              type: z.ZodOptional<
                z.ZodNullable<
                  z.ZodUnion<
                    [
                      z.ZodString,
                      z.ZodNumber,
                      z.ZodBoolean,
                      z.ZodArray<z.ZodAny, 'many'>,
                      z.ZodRecord<z.ZodString, z.ZodAny>,
                      z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>,
                    ]
                  >
                >
              >
              value: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>
            },
            'strip',
            z.ZodTypeAny,
            {
              type?:
                | string
                | number
                | boolean
                | any[]
                | Record<string, any>
                | ((...args: unknown[]) => unknown)
                | null
                | undefined
              value?: Record<string, any> | null | undefined
              propertyName?: string | null | undefined
            },
            {
              type?:
                | string
                | number
                | boolean
                | any[]
                | Record<string, any>
                | ((...args: unknown[]) => unknown)
                | null
                | undefined
              value?: Record<string, any> | null | undefined
              propertyName?: string | null | undefined
            }
          >
          styles: z.ZodOptional<
            z.ZodNullable<
              z.ZodRecord<z.ZodEffects<z.ZodString, string, string>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>
            >
          >
          options: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>
        },
        'strip',
        z.ZodTypeAny,
        {
          elementType:
            | 'code'
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
          boundProperties: {
            type?:
              | string
              | number
              | boolean
              | any[]
              | Record<string, any>
              | ((...args: unknown[]) => unknown)
              | null
              | undefined
            value?: Record<string, any> | null | undefined
            propertyName?: string | null | undefined
          }
          options?: Record<string, any> | null | undefined
          styles?: Record<string, string | number> | null | undefined
          figmaNodeRef?: string | null | undefined
        },
        {
          elementType:
            | 'code'
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
          boundProperties: {
            type?:
              | string
              | number
              | boolean
              | any[]
              | Record<string, any>
              | ((...args: unknown[]) => unknown)
              | null
              | undefined
            value?: Record<string, any> | null | undefined
            propertyName?: string | null | undefined
          }
          options?: Record<string, any> | null | undefined
          styles?: Record<string, string | number> | null | undefined
          figmaNodeRef?: string | null | undefined
        }
      >,
      'many'
    >
    tsType: z.ZodOptional<z.ZodNullable<z.ZodString>>
    textContent: z.ZodOptional<z.ZodNullable<z.ZodString>>
  },
  'strip',
  z.ZodTypeAny,
  {
    elementType:
      | 'code'
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
    variants: {
      elementType:
        | 'code'
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
      boundProperties: {
        type?:
          | string
          | number
          | boolean
          | any[]
          | Record<string, any>
          | ((...args: unknown[]) => unknown)
          | null
          | undefined
        value?: Record<string, any> | null | undefined
        propertyName?: string | null | undefined
      }
      options?: Record<string, any> | null | undefined
      styles?: Record<string, string | number> | null | undefined
      figmaNodeRef?: string | null | undefined
    }[]
    elementAttributes?: Record<string, string | number | boolean | string[]> | null | undefined
    description?: string | null | undefined
    hasBackgroundImage?: boolean | null | undefined
    isComponent?: boolean | null | undefined
    name?: string | null | undefined
    styles?: Record<string, string | number> | null | undefined
    tsType?: string | null | undefined
    textContent?: string | null | undefined
  },
  {
    elementType:
      | 'code'
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
    variants: {
      elementType:
        | 'code'
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
      boundProperties: {
        type?:
          | string
          | number
          | boolean
          | any[]
          | Record<string, any>
          | ((...args: unknown[]) => unknown)
          | null
          | undefined
        value?: Record<string, any> | null | undefined
        propertyName?: string | null | undefined
      }
      options?: Record<string, any> | null | undefined
      styles?: Record<string, string | number> | null | undefined
      figmaNodeRef?: string | null | undefined
    }[]
    elementAttributes?: Record<string, string | number | boolean | string[]> | null | undefined
    description?: string | null | undefined
    hasBackgroundImage?: boolean | null | undefined
    isComponent?: boolean | null | undefined
    name?: string | null | undefined
    styles?: Record<string, string | number> | null | undefined
    tsType?: string | null | undefined
    textContent?: string | null | undefined
  }
>
type Node = z.infer<typeof zBaseNodeSchema> & {
  children?: Node[]
}
declare const zUISpecSchema: z.ZodType<Node>
type UISpec = z.infer<typeof zUISpecSchema>

declare function parseUISpec(html: string): UISpec

export { parseUISpec }
