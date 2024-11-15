import { create } from 'zustand'

interface SpecValue {
  value: string
  setValue: (value: string) => void
}

export const useSpecValue = create<SpecValue>((set) => ({
  value: `{
  "$schema": "https://coral.design/schema.json",
  "elementType": "div",
  "componentProperties": {},
  "elementAttributes": {},
  "isComponent": false,
  "name": "Example",
  "methods": [],
  "stateHooks": [],
  "componentName": "Example",
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
    "paddingInlineStart": 24,
    "paddingInlineEnd": 24,
    "paddingBlockStart": 96,
    "paddingBlockEnd": 96,
    "sm": {
      "paddingBlockStart": 128,
      "paddingBlockEnd": 128
    },
    "lg": {
      "paddingInlineStart": 32,
      "paddingInlineEnd": 32
    }
  },
  "children": [
    {
      "elementType": "div",
      "componentProperties": {},
      "isComponent": false,
      "name": "div",
      "methods": [],
      "stateHooks": [],
      "componentName": "div",
      "styles": {
        "marginInlineStart": "auto",
        "marginInlineEnd": "auto",
        "maxWidth": 672,
        "textAlign": "center"
      },
      "children": [
        {
          "elementType": "p",
          "componentProperties": {},
          "isComponent": false,
          "name": "p",
          "methods": [],
          "stateHooks": [],
          "componentName": "p",
          "styles": {
            "fontSize": 16,
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
          "children": [
            {
              "elementType": "text",
              "componentProperties": {},
              "isComponent": false,
              "name": "text",
              "methods": [],
              "stateHooks": [],
              "componentName": "text",
              "styles": {},
              "children": [],
              "elementAttributes": {},
              "textContent": "Get the help you need"
            }
          ],
          "elementAttributes": {}
        },
        {
          "elementType": "h2",
          "componentProperties": {},
          "isComponent": false,
          "name": "h2",
          "methods": [],
          "stateHooks": [],
          "componentName": "h2",
          "styles": {
            "marginBlockStart": 8,
            "fontSize": 36,
            "lineHeight": 40,
            "fontWeight": 700,
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
            },
            "sm": {
              "fontSize": 60,
              "lineHeight": 60
            }
          },
          "children": [
            {
              "elementType": "text",
              "componentProperties": {},
              "isComponent": false,
              "name": "text",
              "methods": [],
              "stateHooks": [],
              "componentName": "text",
              "styles": {},
              "children": [],
              "elementAttributes": {},
              "textContent": "Support center"
            }
          ],
          "elementAttributes": {}
        },
        {
          "elementType": "p",
          "componentProperties": {},
          "isComponent": false,
          "name": "p",
          "methods": [],
          "stateHooks": [],
          "componentName": "p",
          "styles": {
            "marginBlockStart": 24,
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
          "children": [
            {
              "elementType": "text",
              "componentProperties": {},
              "isComponent": false,
              "name": "text",
              "methods": [],
              "stateHooks": [],
              "componentName": "text",
              "styles": {},
              "children": [],
              "elementAttributes": {},
              "textContent": "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua."
            }
          ],
          "elementAttributes": {}
        }
      ],
      "elementAttributes": {}
    }
  ]
}`,
  setValue: (value: string) => set({ value }),
}))
