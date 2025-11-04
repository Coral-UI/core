export const headerCentered = {
  name: 'Div',
  elementType: 'div',
  styles: {
    backgroundColor: {
      hex: '#ffffff',
      rgb: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
      hsl: {
        h: 0,
        s: 0,
        l: 100,
        a: 1,
      },
    },
    paddingInlineStart: 24,
    paddingInlineEnd: 24,
    paddingBlockStart: 96,
    paddingBlockEnd: 96,
  },
  responsiveStyles: [
    {
      breakpoint: {
        type: 'min-width',
        value: '640px',
      },
      styles: {
        paddingBlockStart: 128,
        paddingBlockEnd: 128,
      },
    },
    {
      breakpoint: {
        type: 'min-width',
        value: '1024px',
      },
      styles: {
        paddingInlineStart: 32,
        paddingInlineEnd: 32,
      },
    },
  ],
  elementAttributes: {
    class: 'bg-white px-6 py-24 sm:py-32 lg:px-8',
  },
  children: [
    {
      name: 'Div',
      elementType: 'div',
      styles: {
        marginInlineStart: 'auto',
        marginInlineEnd: 'auto',
        maxWidth: 672,
        textAlign: 'center',
      },
      elementAttributes: {
        class: 'mx-auto max-w-2xl text-center',
      },
      children: [
        {
          name: 'H2',
          elementType: 'h2',
          styles: {
            fontSize: {
              value: 48,
              unit: 'px',
            },
            lineHeight: {
              value: 48,
              unit: 'px',
            },
            fontWeight: 600,
            letterSpacing: -2.5,
            color: {
              hex: '#18181b',
              rgb: {
                r: 24,
                g: 24,
                b: 27,
                a: 1,
              },
              hsl: {
                h: 240,
                s: 6,
                l: 10,
                a: 1,
              },
            },
          },
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '640px',
              },
              styles: {
                fontSize: {
                  value: 72,
                  unit: 'px',
                },
                lineHeight: {
                  value: 72,
                  unit: 'px',
                },
              },
            },
          ],
          elementAttributes: {
            class: 'text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl',
          },
          children: [],
          textContent: 'Support center',
        },
        {
          name: 'P',
          elementType: 'p',
          styles: {
            marginBlockStart: 32,
            fontSize: {
              value: 18,
              unit: 'px',
            },
            lineHeight: {
              value: 28,
              unit: 'px',
            },
            fontWeight: 500,
            textWrap: 'pretty',
            color: {
              hex: '#71717a',
              rgb: {
                r: 113,
                g: 113,
                b: 122,
                a: 1,
              },
              hsl: {
                h: 240,
                s: 4,
                l: 46,
                a: 1,
              },
            },
          },
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '640px',
              },
              styles: {
                fontSize: {
                  value: 20,
                  unit: 'px',
                },
                lineHeight: 32,
              },
            },
          ],
          elementAttributes: {
            class: 'mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8',
          },
          children: [],
          textContent:
            'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat.',
        },
      ],
    },
  ],
}
