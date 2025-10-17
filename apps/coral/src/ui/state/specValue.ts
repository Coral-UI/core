import { create } from 'zustand'

interface SpecValue {
  value: string
  setValue: (value: string) => void
}

export const useSpecValue = create<SpecValue>((set) => ({
  value: `{
  "name": "Div",
  "elementType": "div",
  "styles": {
    "backgroundColor": {
      "hex": "#4338ca",
      "rgb": {
        "r": 67,
        "g": 56,
        "b": 202,
        "a": 1
      },
      "hsl": {
        "h": 245,
        "s": 58,
        "l": 51,
        "a": 1
      }
    }
  },
  "elementAttributes": {
    "class": "bg-indigo-700"
  },
  "children": [
    {
      "name": "Div",
      "elementType": "div",
      "styles": {
        "paddingInlineStart": 24,
        "paddingInlineEnd": 24,
        "paddingBlockStart": 96,
        "paddingBlockEnd": 96
      },
      "responsiveStyles": [
        {
          "breakpoint": {
            "type": "min-width",
            "value": "640px"
          },
          "styles": {
            "paddingBlockStart": 128,
            "paddingBlockEnd": 128
          }
        },
        {
          "breakpoint": {
            "type": "min-width",
            "value": "1024px"
          },
          "styles": {
            "paddingInlineStart": 32,
            "paddingInlineEnd": 32
          }
        }
      ],
      "elementAttributes": {
        "class": "px-6 py-24 sm:py-32 lg:px-8"
      },
      "children": [
        {
          "name": "Div",
          "elementType": "div",
          "styles": {
            "marginInlineStart": "auto",
            "marginInlineEnd": "auto",
            "maxWidth": 672,
            "textAlign": "center"
          },
          "elementAttributes": {
            "class": "mx-auto max-w-2xl text-center"
          },
          "children": [
            {
              "name": "H2",
              "elementType": "h2",
              "styles": {
                "textWrap": "balance",
                "fontSize": 36,
                "lineHeight": 40,
                "fontWeight": 600,
                "letterSpacing": -2.5,
                "color": {
                  "hex": "#ffffff",
                  "rgb": {
                    "r": 255,
                    "g": 255,
                    "b": 255,
                    "a": 1
                  },
                  "hsl": {
                    "h": 0,
                    "s": 0,
                    "l": 100,
                    "a": 1
                  }
                }
              },
              "responsiveStyles": [
                {
                  "breakpoint": {
                    "type": "min-width",
                    "value": "640px"
                  },
                  "styles": {
                    "fontSize": 48,
                    "lineHeight": 48
                  }
                }
              ],
              "elementAttributes": {
                "class": "text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              },
              "children": [],
              "textContent": "Boost your productivity. Start using our app today."
            },
            {
              "name": "P",
              "elementType": "p",
              "styles": {
                "marginInlineStart": "auto",
                "marginInlineEnd": "auto",
                "marginBlockStart": 24,
                "maxWidth": 576,
                "textWrap": "pretty",
                "fontSize": 18,
                "lineHeight": 32,
                "color": {
                  "hex": "#c7d2fe",
                  "rgb": {
                    "r": 199,
                    "g": 210,
                    "b": 254,
                    "a": 1
                  },
                  "hsl": {
                    "h": 228,
                    "s": 96,
                    "l": 89,
                    "a": 1
                  }
                }
              },
              "elementAttributes": {
                "class": "mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-indigo-200"
              },
              "children": [],
              "textContent": "Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea."
            },
            {
              "name": "Div",
              "elementType": "div",
              "styles": {
                "marginBlockStart": 40,
                "display": "flex",
                "alignItems": "center",
                "justifyContent": "center",
                "columnGap": 24
              },
              "elementAttributes": {
                "class": "mt-10 flex items-center justify-center gap-x-6"
              },
              "children": [
                {
                  "name": "A",
                  "elementType": "a",
                  "styles": {
                    "borderRadius": 6,
                    "backgroundColor": {
                      "hex": "#ffffff",
                      "rgb": {
                        "r": 255,
                        "g": 255,
                        "b": 255,
                        "a": 1
                      },
                      "hsl": {
                        "h": 0,
                        "s": 0,
                        "l": 100,
                        "a": 1
                      }
                    },
                    "paddingInlineStart": 14,
                    "paddingInlineEnd": 14,
                    "paddingBlockStart": 10,
                    "paddingBlockEnd": 10,
                    "fontSize": 14,
                    "lineHeight": 20,
                    "fontWeight": 600,
                    "color": {
                      "hex": "#4f46e5",
                      "rgb": {
                        "r": 79,
                        "g": 70,
                        "b": 229,
                        "a": 1
                      },
                      "hsl": {
                        "h": 243,
                        "s": 75,
                        "l": 59,
                        "a": 1
                      }
                    },
                    ":hover": {
                      "backgroundColor": {
                        "hex": "#eef2ff",
                        "rgb": {
                          "r": 238,
                          "g": 242,
                          "b": 255,
                          "a": 1
                        },
                        "hsl": {
                          "h": 226,
                          "s": 100,
                          "l": 97,
                          "a": 1
                        }
                      }
                    },
                    ":focus-visible": {
                      "outlineWidth": 2,
                      "outlineOffset": 2,
                      "outlineColor": {
                        "hex": "#ffffff",
                        "rgb": {
                          "r": 255,
                          "g": 255,
                          "b": 255,
                          "a": 1
                        },
                        "hsl": {
                          "h": 0,
                          "s": 0,
                          "l": 100,
                          "a": 1
                        }
                      }
                    }
                  },
                  "elementAttributes": {
                    "href": "#",
                    "class": "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  },
                  "children": [],
                  "textContent": "Get started"
                },
                {
                  "name": "A",
                  "elementType": "a",
                  "styles": {
                    "fontSize": 14,
                    "lineHeight": 24,
                    "fontWeight": 600,
                    "color": {
                      "hex": "#ffffff",
                      "rgb": {
                        "r": 255,
                        "g": 255,
                        "b": 255,
                        "a": 1
                      },
                      "hsl": {
                        "h": 0,
                        "s": 0,
                        "l": 100,
                        "a": 1
                      }
                    }
                  },
                  "elementAttributes": {
                    "href": "#",
                    "class": "text-sm/6 font-semibold text-white"
                  },
                  "children": [
                    {
                      "name": "Span",
                      "elementType": "span",
                      "styles": {},
                      "elementAttributes": {
                        "aria-hidden": "true"
                      },
                      "children": [],
                      "textContent": "→"
                    }
                  ],
                  "textContent": "Learn more"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`,
  setValue: (value: string) => set({ value }),
}))
