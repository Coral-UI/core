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
    "class": "relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8"
  },
  "children": [
    {
      "name": "Div",
      "elementType": "div",
      "styles": {
        "position": "absolute",
        "left": 0,
        "right": 0,
        "overflow": "hidden",
        "paddingInlineStart": 144,
        "paddingInlineEnd": 144
      },
      "elementAttributes": {
        "aria-hidden": "true",
        "class": "absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      },
      "children": [
        {
          "name": "Div",
          "elementType": "div",
          "styles": {
            "clip-path": "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            "marginInlineStart": "auto",
            "marginInlineEnd": "auto",
            "width": 1155,
            "opacity": 0.3
          },
          "elementAttributes": {
            "class": "mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
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
        "maxWidth": 896,
        "textAlign": "center"
      },
      "elementAttributes": {
        "class": "mx-auto max-w-4xl text-center"
      },
      "children": [
        {
          "name": "H2",
          "elementType": "h2",
          "styles": {
            "fontSize": {
              "value": 16,
              "unit": "px"
            },
            "lineHeight": 28,
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
            "class": "text-base/7 font-semibold text-indigo-600"
          },
          "children": [],
          "textContent": "Pricing"
        },
        {
          "name": "P",
          "elementType": "p",
          "styles": {
            "marginBlockStart": 8,
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
            "textWrap": "balance",
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
                  "value": 60,
                  "unit": "px"
                },
                "lineHeight": {
                  "value": 60,
                  "unit": "px"
                }
              }
            }
          ],
          "elementAttributes": {
            "class": "mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl"
          },
          "children": [],
          "textContent": "Choose the right plan for you"
        }
      ]
    },
    {
      "name": "P",
      "elementType": "p",
      "styles": {
        "marginInlineStart": "auto",
        "marginInlineEnd": "auto",
        "marginBlockStart": 24,
        "maxWidth": 672,
        "textAlign": "center",
        "fontSize": {
          "value": 18,
          "unit": "px"
        },
        "lineHeight": {
          "value": 28,
          "unit": "px"
        },
        "fontWeight": 500,
        "textWrap": "pretty",
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
        "class": "mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8"
      },
      "children": [],
      "textContent": "Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer loyalty, and driving sales."
    },
    {
      "name": "Div",
      "elementType": "div",
      "styles": {
        "marginInlineStart": "auto",
        "marginInlineEnd": "auto",
        "marginBlockStart": 64,
        "display": "grid",
        "maxWidth": 512,
        "gridTemplateColumns": "repeat(1, minmax(0, 1fr))",
        "alignItems": "center",
        "rowGap": 24
      },
      "responsiveStyles": [
        {
          "breakpoint": {
            "type": "min-width",
            "value": "640px"
          },
          "styles": {
            "marginBlockStart": 80,
            "rowGap": 0
          }
        },
        {
          "breakpoint": {
            "type": "min-width",
            "value": "1024px"
          },
          "styles": {
            "maxWidth": 896,
            "gridTemplateColumns": "repeat(2, minmax(0, 1fr))"
          }
        }
      ],
      "elementAttributes": {
        "class": "mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2"
      },
      "children": [
        {
          "name": "Div",
          "elementType": "div",
          "styles": {
            "paddingInlineStart": 32,
            "paddingInlineEnd": 32,
            "paddingBlockStart": 32,
            "paddingBlockEnd": 32
          },
          "responsiveStyles": [
            {
              "breakpoint": {
                "type": "min-width",
                "value": "640px"
              },
              "styles": {
                "marginInlineStart": 32,
                "marginInlineEnd": 32,
                "paddingInlineStart": 40,
                "paddingInlineEnd": 40,
                "paddingBlockStart": 40,
                "paddingBlockEnd": 40
              }
            },
            {
              "breakpoint": {
                "type": "min-width",
                "value": "1024px"
              },
              "styles": {
                "marginInlineStart": 0,
                "marginInlineEnd": 0
              }
            }
          ],
          "elementAttributes": {
            "class": "rounded-3xl rounded-t-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl"
          },
          "children": [
            {
              "name": "H3",
              "elementType": "h3",
              "styles": {
                "fontSize": {
                  "value": 16,
                  "unit": "px"
                },
                "lineHeight": 28,
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
                "id": "tier-hobby",
                "class": "text-base/7 font-semibold text-indigo-600"
              },
              "children": [],
              "textContent": "Hobby"
            },
            {
              "name": "P",
              "elementType": "p",
              "styles": {
                "marginBlockStart": 16,
                "display": "flex",
                "alignItems": "baseline",
                "columnGap": 8
              },
              "elementAttributes": {
                "class": "mt-4 flex items-baseline gap-x-2"
              },
              "children": [
                {
                  "name": "Span",
                  "elementType": "span",
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
                  "elementAttributes": {
                    "class": "text-5xl font-semibold tracking-tight text-gray-900"
                  },
                  "children": [],
                  "textContent": "$29"
                },
                {
                  "name": "Span",
                  "elementType": "span",
                  "styles": {
                    "fontSize": {
                      "value": 16,
                      "unit": "px"
                    },
                    "lineHeight": {
                      "value": 24,
                      "unit": "px"
                    },
                    "color": {
                      "hex": "#71717a",
                      "rgb": {
                        "r": 113,
                        "g": 113,
                        "b": 122,
                        "a": 1
                      },
                      "hsl": {
                        "h": 240,
                        "s": 4,
                        "l": 46,
                        "a": 1
                      }
                    }
                  },
                  "elementAttributes": {
                    "class": "text-base text-gray-500"
                  },
                  "children": [],
                  "textContent": "/month"
                }
              ]
            },
            {
              "name": "P",
              "elementType": "p",
              "styles": {
                "marginBlockStart": 24,
                "fontSize": {
                  "value": 16,
                  "unit": "px"
                },
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
                "class": "mt-6 text-base/7 text-gray-600"
              },
              "children": [],
              "textContent": "The perfect plan if you're just getting started with our product."
            },
            {
              "name": "Ul",
              "elementType": "ul",
              "styles": {
                "marginBlockStart": 12,
                "fontSize": {
                  "value": 14,
                  "unit": "px"
                },
                "lineHeight": 24,
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
              "responsiveStyles": [
                {
                  "breakpoint": {
                    "type": "min-width",
                    "value": "640px"
                  },
                  "styles": {
                    "marginBlockStart": 40
                  }
                }
              ],
              "elementAttributes": {
                "role": "list",
                "class": "mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10"
              },
              "children": [
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
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
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-600"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "25 products"
                },
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
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
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-600"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "Up to 10,000 subscribers"
                },
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
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
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-600"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "Advanced analytics"
                },
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
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
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-600"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "24-hour support response time"
                }
              ]
            },
            {
              "name": "A",
              "elementType": "a",
              "styles": {
                "marginBlockStart": 32,
                "display": "block",
                "borderRadius": 6,
                "paddingInlineStart": 14,
                "paddingInlineEnd": 14,
                "paddingBlockStart": 10,
                "paddingBlockEnd": 10,
                "textAlign": "center",
                "fontSize": {
                  "value": 14,
                  "unit": "px"
                },
                "lineHeight": {
                  "value": 20,
                  "unit": "px"
                },
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
                "inset": {
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
                },
                ":hover": {
                  "inset": {
                    "hex": "#a5b4fc",
                    "rgb": {
                      "r": 165,
                      "g": 180,
                      "b": 252,
                      "a": 1
                    },
                    "hsl": {
                      "h": 230,
                      "s": 94,
                      "l": 82,
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
              "responsiveStyles": [
                {
                  "breakpoint": {
                    "type": "min-width",
                    "value": "640px"
                  },
                  "styles": {
                    "marginBlockStart": 40
                  }
                }
              ],
              "elementAttributes": {
                "href": "#",
                "aria-describedby": "tier-hobby",
                "class": "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 inset-ring inset-ring-indigo-200 hover:inset-ring-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10"
              },
              "children": [],
              "textContent": "Get started today"
            }
          ]
        },
        {
          "name": "Div",
          "elementType": "div",
          "styles": {
            "position": "relative",
            "borderRadius": 24,
            "backgroundColor": {
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
            },
            "paddingInlineStart": 32,
            "paddingInlineEnd": 32,
            "paddingBlockStart": 32,
            "paddingBlockEnd": 32
          },
          "responsiveStyles": [
            {
              "breakpoint": {
                "type": "min-width",
                "value": "640px"
              },
              "styles": {
                "paddingInlineStart": 40,
                "paddingInlineEnd": 40,
                "paddingBlockStart": 40,
                "paddingBlockEnd": 40
              }
            }
          ],
          "elementAttributes": {
            "class": "relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10"
          },
          "children": [
            {
              "name": "H3",
              "elementType": "h3",
              "styles": {
                "fontSize": {
                  "value": 16,
                  "unit": "px"
                },
                "lineHeight": 28,
                "fontWeight": 600,
                "color": {
                  "hex": "#818cf8",
                  "rgb": {
                    "r": 129,
                    "g": 140,
                    "b": 248,
                    "a": 1
                  },
                  "hsl": {
                    "h": 234,
                    "s": 89,
                    "l": 74,
                    "a": 1
                  }
                }
              },
              "elementAttributes": {
                "id": "tier-enterprise",
                "class": "text-base/7 font-semibold text-indigo-400"
              },
              "children": [],
              "textContent": "Enterprise"
            },
            {
              "name": "P",
              "elementType": "p",
              "styles": {
                "marginBlockStart": 16,
                "display": "flex",
                "alignItems": "baseline",
                "columnGap": 8
              },
              "elementAttributes": {
                "class": "mt-4 flex items-baseline gap-x-2"
              },
              "children": [
                {
                  "name": "Span",
                  "elementType": "span",
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
                    "class": "text-5xl font-semibold tracking-tight text-white"
                  },
                  "children": [],
                  "textContent": "$99"
                },
                {
                  "name": "Span",
                  "elementType": "span",
                  "styles": {
                    "fontSize": {
                      "value": 16,
                      "unit": "px"
                    },
                    "lineHeight": {
                      "value": 24,
                      "unit": "px"
                    },
                    "color": {
                      "hex": "#a1a1aa",
                      "rgb": {
                        "r": 161,
                        "g": 161,
                        "b": 170,
                        "a": 1
                      },
                      "hsl": {
                        "h": 240,
                        "s": 5,
                        "l": 65,
                        "a": 1
                      }
                    }
                  },
                  "elementAttributes": {
                    "class": "text-base text-gray-400"
                  },
                  "children": [],
                  "textContent": "/month"
                }
              ]
            },
            {
              "name": "P",
              "elementType": "p",
              "styles": {
                "marginBlockStart": 24,
                "fontSize": {
                  "value": 16,
                  "unit": "px"
                },
                "lineHeight": 28,
                "color": {
                  "hex": "#d4d4d8",
                  "rgb": {
                    "r": 212,
                    "g": 212,
                    "b": 216,
                    "a": 1
                  },
                  "hsl": {
                    "h": 240,
                    "s": 5,
                    "l": 84,
                    "a": 1
                  }
                }
              },
              "elementAttributes": {
                "class": "mt-6 text-base/7 text-gray-300"
              },
              "children": [],
              "textContent": "Dedicated support and infrastructure for your company."
            },
            {
              "name": "Ul",
              "elementType": "ul",
              "styles": {
                "marginBlockStart": 12,
                "fontSize": {
                  "value": 14,
                  "unit": "px"
                },
                "lineHeight": 24,
                "color": {
                  "hex": "#d4d4d8",
                  "rgb": {
                    "r": 212,
                    "g": 212,
                    "b": 216,
                    "a": 1
                  },
                  "hsl": {
                    "h": 240,
                    "s": 5,
                    "l": 84,
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
                    "marginBlockStart": 40
                  }
                }
              ],
              "elementAttributes": {
                "role": "list",
                "class": "mt-8 space-y-3 text-sm/6 text-gray-300 sm:mt-10"
              },
              "children": [
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
                        "color": {
                          "hex": "#818cf8",
                          "rgb": {
                            "r": 129,
                            "g": 140,
                            "b": 248,
                            "a": 1
                          },
                          "hsl": {
                            "h": 234,
                            "s": 89,
                            "l": 74,
                            "a": 1
                          }
                        }
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-400"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "Unlimited products"
                },
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
                        "color": {
                          "hex": "#818cf8",
                          "rgb": {
                            "r": 129,
                            "g": 140,
                            "b": 248,
                            "a": 1
                          },
                          "hsl": {
                            "h": 234,
                            "s": 89,
                            "l": 74,
                            "a": 1
                          }
                        }
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-400"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "Unlimited subscribers"
                },
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
                        "color": {
                          "hex": "#818cf8",
                          "rgb": {
                            "r": 129,
                            "g": 140,
                            "b": 248,
                            "a": 1
                          },
                          "hsl": {
                            "h": 234,
                            "s": 89,
                            "l": 74,
                            "a": 1
                          }
                        }
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-400"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "Advanced analytics"
                },
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
                        "color": {
                          "hex": "#818cf8",
                          "rgb": {
                            "r": 129,
                            "g": 140,
                            "b": 248,
                            "a": 1
                          },
                          "hsl": {
                            "h": 234,
                            "s": 89,
                            "l": 74,
                            "a": 1
                          }
                        }
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-400"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "Dedicated support representative"
                },
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
                        "color": {
                          "hex": "#818cf8",
                          "rgb": {
                            "r": 129,
                            "g": 140,
                            "b": 248,
                            "a": 1
                          },
                          "hsl": {
                            "h": 234,
                            "s": 89,
                            "l": 74,
                            "a": 1
                          }
                        }
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-400"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "Marketing automations"
                },
                {
                  "name": "Li",
                  "elementType": "li",
                  "styles": {
                    "display": "flex",
                    "columnGap": 12
                  },
                  "elementAttributes": {
                    "class": "flex gap-x-3"
                  },
                  "children": [
                    {
                      "name": "Svg",
                      "elementType": "svg",
                      "styles": {
                        "height": 24,
                        "width": 20,
                        "flex": "none",
                        "color": {
                          "hex": "#818cf8",
                          "rgb": {
                            "r": 129,
                            "g": 140,
                            "b": 248,
                            "a": 1
                          },
                          "hsl": {
                            "h": 234,
                            "s": 89,
                            "l": 74,
                            "a": 1
                          }
                        }
                      },
                      "elementAttributes": {
                        "viewBox": "0 0 20 20",
                        "fill": "currentColor",
                        "data-slot": "icon",
                        "aria-hidden": "true",
                        "class": "h-6 w-5 flex-none text-indigo-400"
                      },
                      "children": [
                        {
                          "name": "Path",
                          "elementType": "path",
                          "styles": {},
                          "elementAttributes": {
                            "d": "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
                            "clip-rule": "evenodd",
                            "fill-rule": "evenodd"
                          }
                        }
                      ]
                    }
                  ],
                  "textContent": "Custom integrations"
                }
              ]
            },
            {
              "name": "A",
              "elementType": "a",
              "styles": {
                "marginBlockStart": 32,
                "display": "block",
                "borderRadius": 6,
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
                },
                "paddingInlineStart": 14,
                "paddingInlineEnd": 14,
                "paddingBlockStart": 10,
                "paddingBlockEnd": 10,
                "textAlign": "center",
                "fontSize": {
                  "value": 14,
                  "unit": "px"
                },
                "lineHeight": {
                  "value": 20,
                  "unit": "px"
                },
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
                    "hex": "#818cf8",
                    "rgb": {
                      "r": 129,
                      "g": 140,
                      "b": 248,
                      "a": 1
                    },
                    "hsl": {
                      "h": 234,
                      "s": 89,
                      "l": 74,
                      "a": 1
                    }
                  }
                },
                ":focus-visible": {
                  "outlineWidth": 2,
                  "outlineOffset": 2,
                  "outlineColor": {
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
                }
              },
              "responsiveStyles": [
                {
                  "breakpoint": {
                    "type": "min-width",
                    "value": "640px"
                  },
                  "styles": {
                    "marginBlockStart": 40
                  }
                }
              ],
              "elementAttributes": {
                "href": "#",
                "aria-describedby": "tier-enterprise",
                "class": "mt-8 block rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:mt-10"
              },
              "children": [],
              "textContent": "Get started today"
            }
          ]
        }
      ]
    }
  ]
}`,
  setValue: (value: string) => set({ value }),
}))
