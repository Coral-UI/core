export const simpleStacked = {
  id: 'root',
  name: 'Root',
  elementType: 'div',
  type: 'NODE',
  children: [
    {
      id: 'element_1763394460597_vc4qt9l',
      name: 'Div',
      elementType: 'div',
      type: 'NODE',
      elementAttributes: {
        class: 'bg-white',
      },
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
      },
      children: [
        {
          id: 'element_1763394460597_mrlebg0',
          name: 'Div',
          elementType: 'div',
          type: 'NODE',
          elementAttributes: {
            class: 'mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8',
          },
          styles: {
            marginInlineStart: 'auto',
            marginInlineEnd: 'auto',
            maxWidth: {
              value: 1280,
              unit: 'px',
            },
            paddingInlineStart: {
              value: 24,
              unit: 'px',
            },
            paddingInlineEnd: {
              value: 24,
              unit: 'px',
            },
            paddingBlockStart: {
              value: 96,
              unit: 'px',
            },
            paddingBlockEnd: {
              value: 96,
              unit: 'px',
            },
          },
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '640px',
              },
              styles: {
                paddingBlockStart: {
                  value: 128,
                  unit: 'px',
                },
                paddingBlockEnd: {
                  value: 128,
                  unit: 'px',
                },
              },
            },
            {
              breakpoint: {
                type: 'min-width',
                value: '1024px',
              },
              styles: {
                paddingInlineStart: {
                  value: 32,
                  unit: 'px',
                },
                paddingInlineEnd: {
                  value: 32,
                  unit: 'px',
                },
              },
            },
          ],
          children: [
            {
              id: 'element_1763394460597_drgm1ya',
              name: 'H2',
              elementType: 'h2',
              type: 'NODE',
              textContent: 'Boost your productivity. Start using our app today.',
              elementAttributes: {
                class: 'max-w-2xl text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl',
              },
              styles: {
                maxWidth: {
                  value: 672,
                  unit: 'px',
                },
                fontSize: {
                  value: 36,
                  unit: 'px',
                },
                lineHeight: {
                  value: 40,
                  unit: 'px',
                },
                fontWeight: 600,
                letterSpacing: {
                  value: -0.025,
                  unit: 'em',
                },
                textWrap: 'balance',
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
                      value: 48,
                      unit: 'px',
                    },
                    lineHeight: {
                      value: 48,
                      unit: 'px',
                    },
                  },
                },
              ],
            },
            {
              id: 'element_1763394460597_nxj80ey',
              name: 'Div',
              elementType: 'div',
              type: 'NODE',
              elementAttributes: {
                class: 'mt-10 flex items-center gap-x-6',
              },
              styles: {
                marginBlockStart: {
                  value: 40,
                  unit: 'px',
                },
                display: 'flex',
                alignItems: 'center',
                columnGap: {
                  value: 24,
                  unit: 'px',
                },
              },
              children: [
                {
                  id: 'element_1763394460597_6ixp6x1',
                  name: 'A',
                  elementType: 'a',
                  type: 'NODE',
                  textContent: 'Get started',
                  elementAttributes: {
                    href: '#',
                    class:
                      'rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                  },
                  styles: {
                    borderRadius: {
                      value: 6,
                      unit: 'px',
                    },
                    backgroundColor: {
                      hex: '#4f46e5',
                      rgb: {
                        r: 79,
                        g: 70,
                        b: 229,
                        a: 1,
                      },
                      hsl: {
                        h: 243,
                        s: 75,
                        l: 59,
                        a: 1,
                      },
                    },
                    paddingInlineStart: {
                      value: 14,
                      unit: 'px',
                    },
                    paddingInlineEnd: {
                      value: 14,
                      unit: 'px',
                    },
                    paddingBlockStart: {
                      value: 10,
                      unit: 'px',
                    },
                    paddingBlockEnd: {
                      value: 10,
                      unit: 'px',
                    },
                    fontSize: {
                      value: 14,
                      unit: 'px',
                    },
                    lineHeight: {
                      value: 20,
                      unit: 'px',
                    },
                    fontWeight: 600,
                    color: {
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
                    ':hover': {
                      backgroundColor: {
                        hex: '#6366f1',
                        rgb: {
                          r: 99,
                          g: 102,
                          b: 241,
                          a: 1,
                        },
                        hsl: {
                          h: 239,
                          s: 84,
                          l: 67,
                          a: 1,
                        },
                      },
                    },
                    ':focus-visible': {
                      outlineWidth: 2,
                      outlineOffset: 2,
                      outlineColor: {
                        hex: '#4f46e5',
                        rgb: {
                          r: 79,
                          g: 70,
                          b: 229,
                          a: 1,
                        },
                        hsl: {
                          h: 243,
                          s: 75,
                          l: 59,
                          a: 1,
                        },
                      },
                    },
                    textDecoration: 'none',
                  },
                },
                {
                  id: 'element_1763394460597_735ipgg',
                  name: 'A',
                  elementType: 'a',
                  type: 'NODE',
                  textContent: 'Learn more',
                  elementAttributes: {
                    href: '#',
                    class: 'text-sm/6 font-semibold text-gray-900',
                  },
                  styles: {
                    fontSize: {
                      value: 14,
                      unit: 'px',
                    },
                    lineHeight: {
                      value: 24,
                      unit: 'px',
                    },
                    fontWeight: 600,
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
                    textDecoration: 'none',
                  },
                  children: [
                    {
                      id: 'element_1763394460597_m8lk5r4',
                      name: 'Span',
                      elementType: 'span',
                      type: 'NODE',
                      textContent: '→',
                      elementAttributes: {
                        'aria-hidden': 'true',
                      },
                      styles: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
