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
    },
    "paddingBlockStart": 96,
    "paddingBlockEnd": 96,
    "(min-width: 640px)": {
      "paddingBlockStart": 128,
      "paddingBlockEnd": 128
    }
  },
  "elementAttributes": {
    "class": "bg-white py-24 sm:py-32"
  },
  "children": [
    {
      "name": "Div",
      "elementType": "div",
      "styles": {
        "marginInlineStart": "auto",
        "marginInlineEnd": "auto",
        "maxWidth": 1280,
        "paddingInlineStart": 24,
        "paddingInlineEnd": 24,
        "(min-width: 1024px)": {
          "paddingInlineStart": 32,
          "paddingInlineEnd": 32
        }
      },
      "elementAttributes": {
        "class": "mx-auto max-w-7xl px-6 lg:px-8"
      },
      "children": [
        {
          "name": "Div",
          "elementType": "div",
          "styles": {
            "marginInlineStart": "auto",
            "marginInlineEnd": "auto",
            "display": "grid",
            "maxWidth": 672,
            "gridTemplateColumns": "repeat(1, minmax(0, 1fr))",
            "gap": 32,
            "overflow": "hidden",
            "(min-width: 1024px)": {
              "marginInlineStart": 0,
              "marginInlineEnd": 0,
              "maxWidth": "none",
              "gridTemplateColumns": "repeat(4, minmax(0, 1fr))"
            }
          },
          "elementAttributes": {
            "class": "mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4"
          },
          "children": [
            {
              "name": "Div",
              "elementType": "div",
              "styles": {},
              "children": [
                {
                  "name": "Time",
                  "elementType": "time",
                  "styles": {
                    "display": "flex",
                    "alignItems": "center",
                    "fontSize": 14,
                    "lineHeight": 24,
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
                    }
                  },
                  "elementAttributes": {
                    "datetime": "2021-08",
                    "class": "flex items-center text-sm/6 font-semibold text-indigo-600"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "marginInlineEnd": 16,
                        "width": 4,
                        "height": 4,
                        "flex": "none"
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 4 4",
                        "aria-hidden": "true",
                        "class": "mr-4 size-1 flex-none"
                      },
                      "children": [
                        {
                          "name": "Circle",
                          "elementType": "circle",
                          "styles": {},
                          "elementAttributes": {
                            "r": "2",
                            "cx": "2",
                            "cy": "2",
                            "fill": "currentColor"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Div",
                      "elementType": "div",
                      "styles": {
                        "position": "absolute",
                        "height": 1,
                        "(min-width: 640px)": {},
                        "(min-width: 1024px)": {
                          "marginInlineStart": 32,
                          "width": "auto",
                          "flex": "1 1 auto"
                        }
                      },
                      "elementAttributes": {
                        "aria-hidden": "true",
                        "class": "absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                      }
                    }
                  ],
                  "textContent": "Aug 2021"
                },
                {
                  "name": "P",
                  "elementType": "p",
                  "styles": {
                    "marginBlockStart": 24,
                    "fontSize": 18,
                    "lineHeight": 32,
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
                  "elementAttributes": {
                    "class": "mt-6 text-lg/8 font-semibold tracking-tight text-gray-900"
                  },
                  "children": [],
                  "textContent": "Founded company"
                },
                {
                  "name": "P",
                  "elementType": "p",
                  "styles": {
                    "marginBlockStart": 4,
                    "fontSize": 16,
                    "lineHeight": 28,
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
                    "class": "mt-1 text-base/7 text-gray-600"
                  },
                  "children": [],
                  "textContent": "Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae."
                }
              ]
            },
            {
              "name": "Div",
              "elementType": "div",
              "styles": {},
              "children": [
                {
                  "name": "Time",
                  "elementType": "time",
                  "styles": {
                    "display": "flex",
                    "alignItems": "center",
                    "fontSize": 14,
                    "lineHeight": 24,
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
                    }
                  },
                  "elementAttributes": {
                    "datetime": "2021-12",
                    "class": "flex items-center text-sm/6 font-semibold text-indigo-600"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "marginInlineEnd": 16,
                        "width": 4,
                        "height": 4,
                        "flex": "none"
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 4 4",
                        "aria-hidden": "true",
                        "class": "mr-4 size-1 flex-none"
                      },
                      "children": [
                        {
                          "name": "Circle",
                          "elementType": "circle",
                          "styles": {},
                          "elementAttributes": {
                            "r": "2",
                            "cx": "2",
                            "cy": "2",
                            "fill": "currentColor"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Div",
                      "elementType": "div",
                      "styles": {
                        "position": "absolute",
                        "height": 1,
                        "(min-width: 640px)": {},
                        "(min-width: 1024px)": {
                          "marginInlineStart": 32,
                          "width": "auto",
                          "flex": "1 1 auto"
                        }
                      },
                      "elementAttributes": {
                        "aria-hidden": "true",
                        "class": "absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                      }
                    }
                  ],
                  "textContent": "Dec 2021"
                },
                {
                  "name": "P",
                  "elementType": "p",
                  "styles": {
                    "marginBlockStart": 24,
                    "fontSize": 18,
                    "lineHeight": 32,
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
                  "elementAttributes": {
                    "class": "mt-6 text-lg/8 font-semibold tracking-tight text-gray-900"
                  },
                  "children": [],
                  "textContent": "Secured $65m in funding"
                },
                {
                  "name": "P",
                  "elementType": "p",
                  "styles": {
                    "marginBlockStart": 4,
                    "fontSize": 16,
                    "lineHeight": 28,
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
                    "class": "mt-1 text-base/7 text-gray-600"
                  },
                  "children": [],
                  "textContent": "Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil."
                }
              ]
            },
            {
              "name": "Div",
              "elementType": "div",
              "styles": {},
              "children": [
                {
                  "name": "Time",
                  "elementType": "time",
                  "styles": {
                    "display": "flex",
                    "alignItems": "center",
                    "fontSize": 14,
                    "lineHeight": 24,
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
                    }
                  },
                  "elementAttributes": {
                    "datetime": "2022-02",
                    "class": "flex items-center text-sm/6 font-semibold text-indigo-600"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "marginInlineEnd": 16,
                        "width": 4,
                        "height": 4,
                        "flex": "none"
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 4 4",
                        "aria-hidden": "true",
                        "class": "mr-4 size-1 flex-none"
                      },
                      "children": [
                        {
                          "name": "Circle",
                          "elementType": "circle",
                          "styles": {},
                          "elementAttributes": {
                            "r": "2",
                            "cx": "2",
                            "cy": "2",
                            "fill": "currentColor"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Div",
                      "elementType": "div",
                      "styles": {
                        "position": "absolute",
                        "height": 1,
                        "(min-width: 640px)": {},
                        "(min-width: 1024px)": {
                          "marginInlineStart": 32,
                          "width": "auto",
                          "flex": "1 1 auto"
                        }
                      },
                      "elementAttributes": {
                        "aria-hidden": "true",
                        "class": "absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                      }
                    }
                  ],
                  "textContent": "Feb 2022"
                },
                {
                  "name": "P",
                  "elementType": "p",
                  "styles": {
                    "marginBlockStart": 24,
                    "fontSize": 18,
                    "lineHeight": 32,
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
                  "elementAttributes": {
                    "class": "mt-6 text-lg/8 font-semibold tracking-tight text-gray-900"
                  },
                  "children": [],
                  "textContent": "Released beta"
                },
                {
                  "name": "P",
                  "elementType": "p",
                  "styles": {
                    "marginBlockStart": 4,
                    "fontSize": 16,
                    "lineHeight": 28,
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
                    "class": "mt-1 text-base/7 text-gray-600"
                  },
                  "children": [],
                  "textContent": "Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et."
                }
              ]
            },
            {
              "name": "Div",
              "elementType": "div",
              "styles": {},
              "children": [
                {
                  "name": "Time",
                  "elementType": "time",
                  "styles": {
                    "display": "flex",
                    "alignItems": "center",
                    "fontSize": 14,
                    "lineHeight": 24,
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
                    }
                  },
                  "elementAttributes": {
                    "datetime": "2022-12",
                    "class": "flex items-center text-sm/6 font-semibold text-indigo-600"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "marginInlineEnd": 16,
                        "width": 4,
                        "height": 4,
                        "flex": "none"
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 4 4",
                        "aria-hidden": "true",
                        "class": "mr-4 size-1 flex-none"
                      },
                      "children": [
                        {
                          "name": "Circle",
                          "elementType": "circle",
                          "styles": {},
                          "elementAttributes": {
                            "r": "2",
                            "cx": "2",
                            "cy": "2",
                            "fill": "currentColor"
                          }
                        }
                      ]
                    },
                    {
                      "name": "Div",
                      "elementType": "div",
                      "styles": {
                        "position": "absolute",
                        "height": 1,
                        "(min-width: 640px)": {},
                        "(min-width: 1024px)": {
                          "marginInlineStart": 32,
                          "width": "auto",
                          "flex": "1 1 auto"
                        }
                      },
                      "elementAttributes": {
                        "aria-hidden": "true",
                        "class": "absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                      }
                    }
                  ],
                  "textContent": "Dec 2022"
                },
                {
                  "name": "P",
                  "elementType": "p",
                  "styles": {
                    "marginBlockStart": 24,
                    "fontSize": 18,
                    "lineHeight": 32,
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
                  "elementAttributes": {
                    "class": "mt-6 text-lg/8 font-semibold tracking-tight text-gray-900"
                  },
                  "children": [],
                  "textContent": "Global launch of product"
                },
                {
                  "name": "P",
                  "elementType": "p",
                  "styles": {
                    "marginBlockStart": 4,
                    "fontSize": 16,
                    "lineHeight": 28,
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
                    "class": "mt-1 text-base/7 text-gray-600"
                  },
                  "children": [],
                  "textContent": "Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit."
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
