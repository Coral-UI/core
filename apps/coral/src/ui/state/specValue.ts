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
    "position": "relative",
    "isolation": "isolate",
    "overflow": "hidden",
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
    "class": "relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8"
  },
  "children": [
    {
      "name": "Img",
      "elementType": "img",
      "styles": {
        "position": "absolute",
        "inset": 0,
        "width": "100%",
        "height": "100%",
        "objectFit": "cover",
        "opacity": 0.1
      },
      "elementAttributes": {
        "src": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=screen",
        "alt": "",
        "class": "absolute inset-0 -z-10 size-full object-cover opacity-10"
      }
    },
    {
      "name": "Div",
      "elementType": "div",
      "styles": {
        "display": "none"
      },
      "responsiveStyles": [
        {
          "breakpoint": {
            "type": "min-width",
            "value": "640px"
          },
          "styles": {
            "position": "absolute",
            "marginInlineEnd": 40,
            "display": "block"
          }
        }
      ],
      "elementAttributes": {
        "aria-hidden": "true",
        "class": "hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
      },
      "children": [
        {
          "name": "Div",
          "elementType": "div",
          "styles": {
            "clip-path": "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            "width": "68.5625rem",
            "opacity": 0.15
          },
          "elementAttributes": {
            "class": "aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-15"
          }
        }
      ]
    },
    {
      "name": "Div",
      "elementType": "div",
      "styles": {
        "position": "absolute"
      },
      "responsiveStyles": [
        {
          "breakpoint": {
            "type": "min-width",
            "value": "640px"
          },
          "styles": {
            "marginInlineStart": 64
          }
        }
      ],
      "elementAttributes": {
        "aria-hidden": "true",
        "class": "absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0"
      },
      "children": [
        {
          "name": "Div",
          "elementType": "div",
          "styles": {
            "clip-path": "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            "width": "68.5625rem",
            "opacity": 0.15
          },
          "elementAttributes": {
            "class": "aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-15"
          }
        }
      ]
    },
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
            "fontSize": {
              "value": 48,
              "unit": "px"
            },
            "lineHeight": {
              "value": 48,
              "unit": "px"
            },
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
                "fontSize": {
                  "value": 72,
                  "unit": "px"
                },
                "lineHeight": {
                  "value": 72,
                  "unit": "px"
                }
              }
            }
          ],
          "elementAttributes": {
            "class": "text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
          },
          "children": [],
          "textContent": "Support center"
        },
        {
          "name": "P",
          "elementType": "p",
          "styles": {
            "marginBlockStart": 32,
            "textWrap": "pretty",
            "fontSize": {
              "value": 18,
              "unit": "px"
            },
            "lineHeight": {
              "value": 28,
              "unit": "px"
            },
            "fontWeight": 500,
            "color": {
              "hex": "#3f3f46",
              "rgb": {
                "r": 63,
                "g": 63,
                "b": 70,
                "a": 1
              },
              "hsl": {
                "h": 240,
                "s": 5,
                "l": 26,
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
                "fontSize": {
                  "value": 20,
                  "unit": "px"
                },
                "lineHeight": 32
              }
            }
          ],
          "elementAttributes": {
            "class": "mt-8 text-pretty text-lg font-medium text-gray-700 sm:text-xl/8"
          },
          "children": [],
          "textContent": "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat."
        }
      ]
    }
  ]
}`,
  setValue: (value: string) => set({ value }),
}))
