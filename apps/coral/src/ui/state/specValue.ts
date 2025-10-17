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
    "class": "bg-white"
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
                  "hex": "#18181b",
                  "rgb": {
                    "r": 24,
                    "g": 24,
                    "b": 27,
                    "a": 1
                  },
                  "hsl": {
                    "h": 240,
                    "s": 6,
                    "l": 10,
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
                "class": "text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
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
                  "hex": "#52525b",
                  "rgb": {
                    "r": 82,
                    "g": 82,
                    "b": 91,
                    "a": 1
                  },
                  "hsl": {
                    "h": 240,
                    "s": 5,
                    "l": 34,
                    "a": 1
                  }
                }
              },
              "elementAttributes": {
                "class": "mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600"
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
                    "paddingInlineStart": 14,
                    "paddingInlineEnd": 14,
                    "paddingBlockStart": 10,
                    "paddingBlockEnd": 10,
                    "fontSize": 14,
                    "lineHeight": 20,
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
                    },
                    ":hover": {
                      "backgroundColor": {
                        "hex": "#6366f1",
                        "rgb": {
                          "r": 99,
                          "g": 102,
                          "b": 241,
                          "a": 1
                        },
                        "hsl": {
                          "h": 239,
                          "s": 84,
                          "l": 67,
                          "a": 1
                        }
                      }
                    },
                    ":focus-visible": {
                      "outlineWidth": 2,
                      "outlineOffset": 2,
                      "outlineColor": {
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
                      }
                    }
                  },
                  "elementAttributes": {
                    "href": "#",
                    "class": "rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                      "hex": "#18181b",
                      "rgb": {
                        "r": 24,
                        "g": 24,
                        "b": 27,
                        "a": 1
                      },
                      "hsl": {
                        "h": 240,
                        "s": 6,
                        "l": 10,
                        "a": 1
                      }
                    }
                  },
                  "elementAttributes": {
                    "href": "#",
                    "class": "text-sm/6 font-semibold text-gray-900"
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
