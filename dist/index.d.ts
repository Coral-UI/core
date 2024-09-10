import z from 'zod'

declare const zBaseNodeSchema: z.ZodObject<
  {
    elementAttributes: z.ZodOptional<
      z.ZodNullable<
        z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, 'many'>]>>
      >
    >
    elementType: z.ZodUnion<
      [
        z.ZodLiteral<'h1'>,
        z.ZodLiteral<'h2'>,
        z.ZodLiteral<'h3'>,
        z.ZodLiteral<'h4'>,
        z.ZodLiteral<'h5'>,
        z.ZodLiteral<'h6'>,
        z.ZodLiteral<'p'>,
        z.ZodLiteral<'span'>,
        z.ZodLiteral<'a'>,
        z.ZodLiteral<'img'>,
        z.ZodLiteral<'ul'>,
        z.ZodLiteral<'li'>,
        z.ZodLiteral<'ol'>,
        z.ZodLiteral<'nav'>,
        z.ZodLiteral<'div'>,
        z.ZodLiteral<'section'>,
        z.ZodLiteral<'footer'>,
        z.ZodLiteral<'header'>,
        z.ZodLiteral<'button'>,
        z.ZodLiteral<'input'>,
        z.ZodLiteral<'form'>,
        z.ZodLiteral<'textarea'>,
        z.ZodLiteral<'select'>,
        z.ZodLiteral<'option'>,
        z.ZodLiteral<'table'>,
        z.ZodLiteral<'tr'>,
        z.ZodLiteral<'td'>,
        z.ZodLiteral<'th'>,
        z.ZodLiteral<'article'>,
        z.ZodLiteral<'aside'>,
        z.ZodLiteral<'main'>,
        z.ZodLiteral<'figure'>,
        z.ZodLiteral<'figcaption'>,
        z.ZodLiteral<'strong'>,
        z.ZodLiteral<'em'>,
        z.ZodLiteral<'code'>,
        z.ZodLiteral<'pre'>,
        z.ZodLiteral<'blockquote'>,
        z.ZodLiteral<'hr'>,
        z.ZodLiteral<'br'>,
        z.ZodLiteral<'label'>,
        z.ZodLiteral<'fieldset'>,
        z.ZodLiteral<'legend'>,
        z.ZodLiteral<'audio'>,
        z.ZodLiteral<'video'>,
        z.ZodLiteral<'source'>,
        z.ZodLiteral<'canvas'>,
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
      z.ZodNullable<
        z.ZodRecord<
          z.ZodEffects<z.ZodString, string, string>,
          z.ZodUnion<
            [
              z.ZodString,
              z.ZodNumber,
              z.ZodOptional<
                z.ZodNullable<
                  z.ZodRecord<z.ZodEffects<z.ZodString, string, string>, z.ZodUnion<[z.ZodString, z.ZodNumber]>>
                >
              >,
            ]
          >
        >
      >
    >
    variants: z.ZodOptional<
      z.ZodNullable<
        z.ZodArray<
          z.ZodObject<
            {
              elementType: z.ZodUnion<
                [
                  z.ZodLiteral<'h1'>,
                  z.ZodLiteral<'h2'>,
                  z.ZodLiteral<'h3'>,
                  z.ZodLiteral<'h4'>,
                  z.ZodLiteral<'h5'>,
                  z.ZodLiteral<'h6'>,
                  z.ZodLiteral<'p'>,
                  z.ZodLiteral<'span'>,
                  z.ZodLiteral<'a'>,
                  z.ZodLiteral<'img'>,
                  z.ZodLiteral<'ul'>,
                  z.ZodLiteral<'li'>,
                  z.ZodLiteral<'ol'>,
                  z.ZodLiteral<'nav'>,
                  z.ZodLiteral<'div'>,
                  z.ZodLiteral<'section'>,
                  z.ZodLiteral<'footer'>,
                  z.ZodLiteral<'header'>,
                  z.ZodLiteral<'button'>,
                  z.ZodLiteral<'input'>,
                  z.ZodLiteral<'form'>,
                  z.ZodLiteral<'textarea'>,
                  z.ZodLiteral<'select'>,
                  z.ZodLiteral<'option'>,
                  z.ZodLiteral<'table'>,
                  z.ZodLiteral<'tr'>,
                  z.ZodLiteral<'td'>,
                  z.ZodLiteral<'th'>,
                  z.ZodLiteral<'article'>,
                  z.ZodLiteral<'aside'>,
                  z.ZodLiteral<'main'>,
                  z.ZodLiteral<'figure'>,
                  z.ZodLiteral<'figcaption'>,
                  z.ZodLiteral<'strong'>,
                  z.ZodLiteral<'em'>,
                  z.ZodLiteral<'code'>,
                  z.ZodLiteral<'pre'>,
                  z.ZodLiteral<'blockquote'>,
                  z.ZodLiteral<'hr'>,
                  z.ZodLiteral<'br'>,
                  z.ZodLiteral<'label'>,
                  z.ZodLiteral<'fieldset'>,
                  z.ZodLiteral<'legend'>,
                  z.ZodLiteral<'audio'>,
                  z.ZodLiteral<'video'>,
                  z.ZodLiteral<'source'>,
                  z.ZodLiteral<'canvas'>,
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
                  value?: Record<string, any> | null | undefined
                  type?:
                    | string
                    | number
                    | boolean
                    | any[]
                    | Record<string, any>
                    | ((...args: unknown[]) => unknown)
                    | null
                    | undefined
                  propertyName?: string | null | undefined
                },
                {
                  value?: Record<string, any> | null | undefined
                  type?:
                    | string
                    | number
                    | boolean
                    | any[]
                    | Record<string, any>
                    | ((...args: unknown[]) => unknown)
                    | null
                    | undefined
                  propertyName?: string | null | undefined
                }
              >
              styles: z.ZodOptional<
                z.ZodNullable<
                  z.ZodRecord<
                    z.ZodEffects<z.ZodString, string, string>,
                    z.ZodUnion<
                      [
                        z.ZodString,
                        z.ZodNumber,
                        z.ZodOptional<
                          z.ZodNullable<
                            z.ZodRecord<
                              z.ZodEffects<z.ZodString, string, string>,
                              z.ZodUnion<[z.ZodString, z.ZodNumber]>
                            >
                          >
                        >,
                      ]
                    >
                  >
                >
              >
              options: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>
            },
            'strip',
            z.ZodTypeAny,
            {
              elementType:
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
              boundProperties: {
                value?: Record<string, any> | null | undefined
                type?:
                  | string
                  | number
                  | boolean
                  | any[]
                  | Record<string, any>
                  | ((...args: unknown[]) => unknown)
                  | null
                  | undefined
                propertyName?: string | null | undefined
              }
              options?: Record<string, any> | null | undefined
              figmaNodeRef?: string | null | undefined
              styles?:
                | Record<string, string | number | Record<string, string | number> | null | undefined>
                | null
                | undefined
            },
            {
              elementType:
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
              boundProperties: {
                value?: Record<string, any> | null | undefined
                type?:
                  | string
                  | number
                  | boolean
                  | any[]
                  | Record<string, any>
                  | ((...args: unknown[]) => unknown)
                  | null
                  | undefined
                propertyName?: string | null | undefined
              }
              options?: Record<string, any> | null | undefined
              figmaNodeRef?: string | null | undefined
              styles?:
                | Record<string, string | number | Record<string, string | number> | null | undefined>
                | null
                | undefined
            }
          >,
          'many'
        >
      >
    >
    tsType: z.ZodOptional<z.ZodNullable<z.ZodString>>
    textContent: z.ZodOptional<z.ZodNullable<z.ZodString>>
  },
  'strip',
  z.ZodTypeAny,
  {
    elementType:
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
    styles?: Record<string, string | number | Record<string, string | number> | null | undefined> | null | undefined
    elementAttributes?: Record<string, string | number | boolean | string[]> | null | undefined
    description?: string | null | undefined
    hasBackgroundImage?: boolean | null | undefined
    isComponent?: boolean | null | undefined
    name?: string | null | undefined
    variants?:
      | {
          elementType:
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
          boundProperties: {
            value?: Record<string, any> | null | undefined
            type?:
              | string
              | number
              | boolean
              | any[]
              | Record<string, any>
              | ((...args: unknown[]) => unknown)
              | null
              | undefined
            propertyName?: string | null | undefined
          }
          options?: Record<string, any> | null | undefined
          figmaNodeRef?: string | null | undefined
          styles?:
            | Record<string, string | number | Record<string, string | number> | null | undefined>
            | null
            | undefined
        }[]
      | null
      | undefined
    tsType?: string | null | undefined
    textContent?: string | null | undefined
  },
  {
    elementType:
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
    styles?: Record<string, string | number | Record<string, string | number> | null | undefined> | null | undefined
    elementAttributes?: Record<string, string | number | boolean | string[]> | null | undefined
    description?: string | null | undefined
    hasBackgroundImage?: boolean | null | undefined
    isComponent?: boolean | null | undefined
    name?: string | null | undefined
    variants?:
      | {
          elementType:
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
          boundProperties: {
            value?: Record<string, any> | null | undefined
            type?:
              | string
              | number
              | boolean
              | any[]
              | Record<string, any>
              | ((...args: unknown[]) => unknown)
              | null
              | undefined
            propertyName?: string | null | undefined
          }
          options?: Record<string, any> | null | undefined
          figmaNodeRef?: string | null | undefined
          styles?:
            | Record<string, string | number | Record<string, string | number> | null | undefined>
            | null
            | undefined
        }[]
      | null
      | undefined
    tsType?: string | null | undefined
    textContent?: string | null | undefined
  }
>
type BaseNode = z.infer<typeof zBaseNodeSchema> & {
  children?: BaseNode[]
}

/**
 * Parses and validates a UI specification object.
 *
 * @async
 * @param {Record<string, unknown>} html - The UI specification object to parse.
 * @returns {Promise<BaseNode>} A promise that resolves to the parsed and validated BaseNode.
 * @throws {Error} If the input fails validation against the zUISpecSchema.
 */
declare function parseUISpec(html: Record<string, unknown>): Promise<BaseNode>

declare const transformHTMLToSpec: (html: string) => BaseNode

type Styles = {
  paddingInlineStart?: string
  paddingInlineEnd?: string
  paddingBlockStart?: string
  paddingBlockEnd?: string
  padding?: string
  marginInlineStart?: string
  marginInlineEnd?: string
  marginBlockStart?: string
  marginBlockEnd?: string
  margin?: string
  position?: string
  top?: string
  right?: string
  bottom?: string
  left?: string
  display?: string
  flexDirection?: string
  justifyContent?: string
  alignItems?: string
  flexWrap?: string
  gap?: string
  width?: string
  height?: string
  backgroundColor?: string
  color?: string
  fontSize?: string
  fontWeight?: string
  border?: string
  borderRadius?: string
  cursor?: string
  zIndex?: string
  overflow?: string
  boxShadow?: string
  transform?: string
  transition?: string
  opacity?: string
}
type StylesWithModifiers = Styles & {
  [key: string]: Styles
}
declare const tailwindToCSS: (tailwind: string) => StylesWithModifiers

export { parseUISpec, tailwindToCSS, transformHTMLToSpec }
