import { CoralRootNode } from '@reallygoodwork/coral-core'

import { collectFontsAndStyles } from '../prepareStructure'

describe('prepareStructure', () => {
  describe('collectFontsAndStyles', () => {
    describe('font collection', () => {
      it('should collect fonts from a single node', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
          },
          children: [],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.fontsToLoad).toContain('Roboto:Bold')
        expect(result.fontsToLoad).toHaveLength(1)
      })

      it('should collect unique fonts from multiple nodes', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            fontFamily: 'Inter',
            fontWeight: 400,
          },
          children: [
            {
              name: 'Child1',
              elementType: 'p',
              styles: {
                fontFamily: 'Roboto',
                fontWeight: 700,
              },
              children: [],
            },
            {
              name: 'Child2',
              elementType: 'span',
              styles: {
                fontFamily: 'Roboto',
                fontWeight: 700,
              },
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.fontsToLoad).toHaveLength(2)
        expect(result.fontsToLoad).toContain('Inter:Regular')
        expect(result.fontsToLoad).toContain('Roboto:Bold')
      })

      it('should handle nodes without font styles', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            color: 'red',
            padding: '10px',
          },
          children: [],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.fontsToLoad).toHaveLength(0)
      })
    })

    describe('style inheritance', () => {
      it('should inherit text styles from parent to child', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            fontFamily: 'Inter',
            fontSize: '16px',
            color: 'blue',
          },
          children: [
            {
              name: 'Child',
              elementType: 'p',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Root node should have its own styles
        expect(result.nodeStyles[0].current).toEqual({
          fontFamily: 'Inter',
          fontSize: '16px',
          color: 'blue',
        })
        expect(result.nodeStyles[0].merged).toEqual({
          fontFamily: 'Inter',
          fontSize: '16px',
          color: 'blue',
        })

        // Child should inherit parent styles
        expect(result.nodeStyles[1].inherited).toEqual({
          fontFamily: 'Inter',
          fontSize: '16px',
          color: 'blue',
        })
        expect(result.nodeStyles[1].current).toEqual({})
        expect(result.nodeStyles[1].merged).toEqual({
          fontFamily: 'Inter',
          fontSize: '16px',
          color: 'blue',
        })
      })

      it('should override inherited styles with current styles', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            fontFamily: 'Inter',
            fontSize: '16px',
            color: 'blue',
          },
          children: [
            {
              name: 'Child',
              elementType: 'p',
              styles: {
                fontSize: '20px',
                fontWeight: 700,
              },
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Child should override fontSize but keep inherited fontFamily and color
        expect(result.nodeStyles[1].inherited).toEqual({
          fontFamily: 'Inter',
          fontSize: '16px',
          color: 'blue',
        })
        expect(result.nodeStyles[1].current).toEqual({
          fontSize: '20px',
          fontWeight: 700,
        })
        expect(result.nodeStyles[1].merged).toEqual({
          fontFamily: 'Inter',
          fontSize: '20px',
          color: 'blue',
          fontWeight: 700,
        })
      })

      it('should handle multi-level inheritance', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            fontFamily: 'Inter',
            fontSize: '16px',
          },
          children: [
            {
              name: 'Child',
              elementType: 'div',
              styles: {
                color: 'red',
              },
              children: [
                {
                  name: 'Grandchild',
                  elementType: 'p',
                  styles: {
                    fontWeight: 700,
                  },
                  children: [],
                },
              ],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Grandchild should inherit from both parent and grandparent
        const grandchildNode = result.nodeStyles[2]
        expect(grandchildNode.nodeType).toBe('p')
        expect(grandchildNode.merged).toEqual({
          fontFamily: 'Inter',
          fontSize: '16px',
          color: 'red',
          fontWeight: 700,
        })
      })

      it('should only inherit text-related styles', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            fontFamily: 'Inter',
            fontSize: '16px',
            padding: '10px',
            margin: '20px',
            backgroundColor: 'white',
          },
          children: [
            {
              name: 'Child',
              elementType: 'p',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Child should only inherit text styles
        expect(result.nodeStyles[1].inherited).toEqual({
          fontFamily: 'Inter',
          fontSize: '16px',
        })
        expect(result.nodeStyles[1].inherited).not.toHaveProperty('padding')
        expect(result.nodeStyles[1].inherited).not.toHaveProperty('margin')
        expect(result.nodeStyles[1].inherited).not.toHaveProperty('backgroundColor')
      })
    })

    describe('list example', () => {
      it('should inherit styles from ul/ol to li elements', () => {
        const spec: CoralRootNode = {
          name: 'List',
          elementType: 'ul',
          elementAttributes: {},
          styles: {
            fontFamily: 'Roboto',
            fontSize: '14px',
            color: 'black',
          },
          children: [
            {
              name: 'ListItem1',
              elementType: 'li',
              styles: {},
              children: [
                {
                  name: 'Text1',
                  elementType: 'span',
                  styles: {},
                  children: [],
                },
              ],
            },
            {
              name: 'ListItem2',
              elementType: 'li',
              styles: {
                fontSize: '18px',
              },
              children: [
                {
                  name: 'Text2',
                  elementType: 'span',
                  styles: {
                    fontWeight: 700,
                  },
                  children: [],
                },
              ],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // First li should inherit all styles from ul
        const firstLi = result.nodeStyles[1]
        expect(firstLi.nodeType).toBe('li')
        expect(firstLi.merged).toEqual({
          fontFamily: 'Roboto',
          fontSize: '14px',
          color: 'black',
        })

        // First span should inherit from li (which inherited from ul)
        const firstSpan = result.nodeStyles[2]
        expect(firstSpan.nodeType).toBe('span')
        expect(firstSpan.merged).toEqual({
          fontFamily: 'Roboto',
          fontSize: '14px',
          color: 'black',
        })

        // Second li should override fontSize
        const secondLi = result.nodeStyles[3]
        expect(secondLi.nodeType).toBe('li')
        expect(secondLi.merged).toEqual({
          fontFamily: 'Roboto',
          fontSize: '18px',
          color: 'black',
        })

        // Second span should inherit overridden fontSize and add fontWeight
        const secondSpan = result.nodeStyles[4]
        expect(secondSpan.nodeType).toBe('span')
        expect(secondSpan.merged).toEqual({
          fontFamily: 'Roboto',
          fontSize: '18px',
          color: 'black',
          fontWeight: 700,
        })
      })
    })

    describe('responsive variant collection', () => {
      it('should collect responsive variants from root node', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            fontSize: '14px',
          },
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '768px',
              },
              label: 'Tablet',
              styles: {
                fontSize: '16px',
              },
            },
            {
              breakpoint: {
                type: 'min-width',
                value: '1024px',
              },
              label: 'Desktop',
              styles: {
                fontSize: '18px',
              },
            },
          ],
          children: [],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.responsiveVariants).toHaveLength(2)
        expect(result.responsiveVariants[0]).toEqual({
          name: 'Tablet',
          breakpoint: {
            type: 'min-width',
            value: '768px',
          },
          label: 'Tablet',
          depth: 0,
          nodePath: ['Root'],
        })
        expect(result.responsiveVariants[1]).toEqual({
          name: 'Desktop',
          breakpoint: {
            type: 'min-width',
            value: '1024px',
          },
          label: 'Desktop',
          depth: 0,
          nodePath: ['Root'],
        })
      })

      it('should collect responsive variants from nested nodes', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          children: [
            {
              name: 'Child',
              elementType: 'div',
              styles: {},
              children: [
                {
                  name: 'Grandchild',
                  elementType: 'p',
                  styles: {},
                  responsiveStyles: [
                    {
                      breakpoint: {
                        type: 'min-width',
                        value: '768px',
                      },
                      styles: {
                        fontSize: '18px',
                      },
                    },
                  ],
                  children: [],
                },
              ],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.responsiveVariants).toHaveLength(1)
        expect(result.responsiveVariants[0]).toEqual({
          name: 'min-width:768px',
          breakpoint: {
            type: 'min-width',
            value: '768px',
          },
          label: undefined,
          depth: 2,
          nodePath: ['Root', 'Child', 'Grandchild'],
        })
      })

      it('should deduplicate responsive variants with same breakpoint', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '768px',
              },
              label: 'Tablet',
              styles: {
                padding: '20px',
              },
            },
          ],
          children: [
            {
              name: 'Child1',
              elementType: 'div',
              styles: {},
              responsiveStyles: [
                {
                  breakpoint: {
                    type: 'min-width',
                    value: '768px',
                  },
                  styles: {
                    fontSize: '18px',
                  },
                },
              ],
              children: [],
            },
            {
              name: 'Child2',
              elementType: 'p',
              styles: {},
              responsiveStyles: [
                {
                  breakpoint: {
                    type: 'min-width',
                    value: '768px',
                  },
                  styles: {
                    color: 'red',
                  },
                },
              ],
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Should only have one variant for the 768px breakpoint
        expect(result.responsiveVariants).toHaveLength(1)
        expect(result.responsiveVariants[0].name).toBe('Tablet')
        expect(result.responsiveVariants[0].depth).toBe(0)
        expect(result.responsiveVariants[0].nodePath).toEqual(['Root'])
      })

      it('should handle range breakpoints', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          responsiveStyles: [
            {
              breakpoint: {
                min: {
                  type: 'min-width',
                  value: '768px',
                },
                max: {
                  type: 'max-width',
                  value: '1024px',
                },
              },
              label: 'Tablet Only',
              styles: {
                fontSize: '16px',
              },
            },
          ],
          children: [],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.responsiveVariants).toHaveLength(1)
        expect(result.responsiveVariants[0]).toEqual({
          name: 'Tablet Only',
          breakpoint: {
            min: {
              type: 'min-width',
              value: '768px',
            },
            max: {
              type: 'max-width',
              value: '1024px',
            },
          },
          label: 'Tablet Only',
          depth: 0,
          nodePath: ['Root'],
        })
      })

      it('should generate name from breakpoint when label is not provided', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '768px',
              },
              styles: {
                fontSize: '16px',
              },
            },
            {
              breakpoint: {
                min: {
                  type: 'min-width',
                  value: '768px',
                },
                max: {
                  type: 'max-width',
                  value: '1024px',
                },
              },
              styles: {
                padding: '20px',
              },
            },
          ],
          children: [],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.responsiveVariants).toHaveLength(2)
        expect(result.responsiveVariants[0].name).toBe('min-width:768px')
        expect(result.responsiveVariants[1].name).toBe('min-width:768px AND max-width:1024px')
      })

      it('should track depth correctly for nested variants', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '320px',
              },
              label: 'Mobile',
              styles: {},
            },
          ],
          children: [
            {
              name: 'Child',
              elementType: 'div',
              styles: {},
              responsiveStyles: [
                {
                  breakpoint: {
                    type: 'min-width',
                    value: '768px',
                  },
                  label: 'Tablet',
                  styles: {},
                },
              ],
              children: [
                {
                  name: 'Grandchild',
                  elementType: 'p',
                  styles: {},
                  responsiveStyles: [
                    {
                      breakpoint: {
                        type: 'min-width',
                        value: '1024px',
                      },
                      label: 'Desktop',
                      styles: {},
                    },
                  ],
                  children: [],
                },
              ],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.responsiveVariants).toHaveLength(3)
        expect(result.responsiveVariants[0].depth).toBe(0)
        expect(result.responsiveVariants[0].nodePath).toEqual(['Root'])
        expect(result.responsiveVariants[1].depth).toBe(1)
        expect(result.responsiveVariants[1].nodePath).toEqual(['Root', 'Child'])
        expect(result.responsiveVariants[2].depth).toBe(2)
        expect(result.responsiveVariants[2].nodePath).toEqual(['Root', 'Child', 'Grandchild'])
      })

      it('should handle nodes without responsive styles', () => {
        const spec: CoralRootNode = {
          name: 'Root',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            fontSize: '16px',
          },
          children: [
            {
              name: 'Child',
              elementType: 'p',
              styles: {
                color: 'red',
              },
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.responsiveVariants).toHaveLength(0)
      })

      it('should handle complex real-world scenario with multiple breakpoints at different levels', () => {
        const spec: CoralRootNode = {
          name: 'Card',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            padding: '10px',
          },
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '768px',
              },
              label: 'Tablet',
              styles: {
                padding: '20px',
              },
            },
            {
              breakpoint: {
                type: 'min-width',
                value: '1024px',
              },
              label: 'Desktop',
              styles: {
                padding: '30px',
              },
            },
          ],
          children: [
            {
              name: 'Title',
              elementType: 'h2',
              styles: {
                fontSize: '18px',
              },
              responsiveStyles: [
                {
                  breakpoint: {
                    type: 'min-width',
                    value: '768px',
                  },
                  styles: {
                    fontSize: '24px',
                  },
                },
              ],
              children: [],
            },
            {
              name: 'Content',
              elementType: 'p',
              styles: {
                fontSize: '14px',
              },
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Should have 2 unique variants (768px and 1024px)
        // The duplicate 768px from Title should be deduplicated
        expect(result.responsiveVariants).toHaveLength(2)
        expect(result.responsiveVariants[0].name).toBe('Tablet')
        expect(result.responsiveVariants[0].depth).toBe(0)
        expect(result.responsiveVariants[1].name).toBe('Desktop')
        expect(result.responsiveVariants[1].depth).toBe(0)
      })
    })

    describe('text alignment inheritance', () => {
      it('should inherit textAlign from parent div to child text elements', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            textAlign: 'center',
            fontSize: '16px',
          },
          children: [
            {
              name: 'Heading',
              elementType: 'h2',
              styles: {},
              children: [],
            },
            {
              name: 'Paragraph',
              elementType: 'p',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Parent should have textAlign
        expect(result.nodeStyles[0].current).toEqual({
          textAlign: 'center',
          fontSize: '16px',
        })

        // Children should inherit textAlign
        expect(result.nodeStyles[1].inherited).toHaveProperty('textAlign', 'center')
        expect(result.nodeStyles[1].merged).toHaveProperty('textAlign', 'center')
        expect(result.nodeStyles[2].inherited).toHaveProperty('textAlign', 'center')
        expect(result.nodeStyles[2].merged).toHaveProperty('textAlign', 'center')
      })

      it('should allow children to override inherited textAlign', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            textAlign: 'center',
          },
          children: [
            {
              name: 'LeftAligned',
              elementType: 'p',
              styles: {
                textAlign: 'left',
              },
              children: [],
            },
            {
              name: 'CenterAligned',
              elementType: 'p',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // First child overrides with left
        expect(result.nodeStyles[1].current).toHaveProperty('textAlign', 'left')
        expect(result.nodeStyles[1].merged).toHaveProperty('textAlign', 'left')

        // Second child inherits center
        expect(result.nodeStyles[2].merged).toHaveProperty('textAlign', 'center')
      })
    })

    describe('auto layout detection', () => {
      it('should detect auto layout needed for div with textAlign and children', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            textAlign: 'center',
          },
          children: [
            {
              name: 'Heading',
              elementType: 'h2',
              styles: {},
              children: [],
            },
            {
              name: 'Paragraph',
              elementType: 'p',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.autoLayoutNodes).toHaveLength(1)
        expect(result.autoLayoutNodes[0]).toEqual({
          nodeName: 'Container',
          nodeType: 'div',
          depth: 0,
          nodePath: ['Container'],
          reason: 'text-align',
          textAlign: 'center',
          hasChildren: true,
        })
      })

      it('should not detect auto layout for div without textAlign', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            padding: '20px',
          },
          children: [
            {
              name: 'Heading',
              elementType: 'h2',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.autoLayoutNodes).toHaveLength(0)
      })

      it('should not detect auto layout for div with textAlign but no children', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            textAlign: 'center',
          },
          children: [],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.autoLayoutNodes).toHaveLength(0)
      })

      it('should not detect auto layout for text elements with textAlign', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          children: [
            {
              name: 'Heading',
              elementType: 'h2',
              styles: {
                textAlign: 'center',
              },
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.autoLayoutNodes).toHaveLength(0)
      })

      it('should detect auto layout for section elements with textAlign', () => {
        const spec: CoralRootNode = {
          name: 'Section',
          elementType: 'section',
          elementAttributes: {},
          styles: {
            textAlign: 'right',
          },
          children: [
            {
              name: 'Content',
              elementType: 'p',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.autoLayoutNodes).toHaveLength(1)
        expect(result.autoLayoutNodes[0]).toEqual({
          nodeName: 'Section',
          nodeType: 'section',
          depth: 0,
          nodePath: ['Section'],
          reason: 'text-align',
          textAlign: 'right',
          hasChildren: true,
        })
      })

      it('should detect multiple auto layout nodes at different depths', () => {
        const spec: CoralRootNode = {
          name: 'Outer',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            textAlign: 'center',
          },
          children: [
            {
              name: 'Inner',
              elementType: 'div',
              styles: {
                textAlign: 'left',
              },
              children: [
                {
                  name: 'Text',
                  elementType: 'p',
                  styles: {},
                  children: [],
                },
              ],
            },
            {
              name: 'Sibling',
              elementType: 'p',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.autoLayoutNodes).toHaveLength(2)
        expect(result.autoLayoutNodes[0]).toEqual({
          nodeName: 'Outer',
          nodeType: 'div',
          depth: 0,
          nodePath: ['Outer'],
          reason: 'text-align',
          textAlign: 'center',
          hasChildren: true,
        })
        expect(result.autoLayoutNodes[1]).toEqual({
          nodeName: 'Inner',
          nodeType: 'div',
          depth: 1,
          nodePath: ['Outer', 'Inner'],
          reason: 'text-align',
          textAlign: 'left',
          hasChildren: true,
        })
      })

      it('should handle real-world example with centered content', () => {
        const spec: CoralRootNode = {
          name: 'HeroSection',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f5f5f5',
          },
          children: [
            {
              name: 'Title',
              elementType: 'h2',
              styles: {
                fontSize: '32px',
                fontWeight: 700,
              },
              children: [],
            },
            {
              name: 'Subtitle',
              elementType: 'p',
              styles: {
                fontSize: '18px',
                color: '#666',
              },
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Should detect auto layout for the container
        expect(result.autoLayoutNodes).toHaveLength(1)
        expect(result.autoLayoutNodes[0].textAlign).toBe('center')

        // Children should inherit textAlign
        expect(result.nodeStyles[1].merged).toHaveProperty('textAlign', 'center')
        expect(result.nodeStyles[2].merged).toHaveProperty('textAlign', 'center')
      })
    })

    describe('wrapper frame detection', () => {
      it('should detect text nodes that need wrapper frames for margin', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          children: [
            {
              name: 'Text',
              elementType: 'p',
              styles: {
                marginBlockStart: 24,
                fontSize: '16px',
              },
              textContent: 'Some text with margin',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.wrapperNodes).toContain('Text')
        expect(
          result.autoLayoutNodes.some((al) => al.nodeName === 'Text-wrapper' && al.reason === 'text-spacing'),
        ).toBe(true)
      })

      it('should detect text nodes that need wrapper frames for padding', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          children: [
            {
              name: 'Button',
              elementType: 'a',
              styles: {
                paddingBlockStart: 10,
                paddingBlockEnd: 10,
                paddingInlineStart: 14,
                paddingInlineEnd: 14,
              },
              textContent: 'Click me',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.wrapperNodes).toContain('Button')
        expect(result.autoLayoutNodes.some((al) => al.needsWrapper === true)).toBe(true)
      })

      it('should not detect wrapper for text nodes without margin/padding', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          children: [
            {
              name: 'SimpleText',
              elementType: 'p',
              styles: {
                fontSize: '16px',
              },
              textContent: 'Simple text',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.wrapperNodes).toHaveLength(0)
        expect(result.autoLayoutNodes.some((al) => al.reason === 'text-spacing')).toBe(false)
      })

      it('should detect wrapper for h2 with margin', () => {
        const spec: CoralRootNode = {
          name: 'Article',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          children: [
            {
              name: 'Title',
              elementType: 'h2',
              styles: {
                marginBlockStart: 8,
                fontSize: '32px',
              },
              textContent: 'Article Title',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        expect(result.wrapperNodes).toContain('Title')
        const wrapperNode = result.autoLayoutNodes.find((al) => al.nodeName === 'Title-wrapper')
        expect(wrapperNode).toBeDefined()
        expect(wrapperNode?.reason).toBe('text-spacing')
        expect(wrapperNode?.needsWrapper).toBe(true)
      })

      it('should include textAlign in wrapper auto layout info', () => {
        const spec: CoralRootNode = {
          name: 'Container',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            textAlign: 'center',
          },
          children: [
            {
              name: 'CenteredText',
              elementType: 'p',
              styles: {
                marginBlockStart: 16,
              },
              textContent: 'Centered text with margin',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const wrapperNode = result.autoLayoutNodes.find((al) => al.nodeName === 'CenteredText-wrapper')
        expect(wrapperNode).toBeDefined()
        expect(wrapperNode?.textAlign).toBe('center')
      })

      it('should not add wrapper for container elements', () => {
        const spec: CoralRootNode = {
          name: 'Outer',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            marginBlockStart: 24,
          },
          children: [
            {
              name: 'Inner',
              elementType: 'p',
              styles: {},
              textContent: 'Text',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Outer div should not need wrapper (it's a container)
        expect(result.wrapperNodes).not.toContain('Outer')
        // Only text elements with spacing need wrappers
        expect(result.autoLayoutNodes.some((al) => al.nodeName === 'Outer-wrapper')).toBe(false)
      })

      it('should handle complex scenario with multiple text nodes needing wrappers', () => {
        const spec: CoralRootNode = {
          name: 'Card',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            paddingBlockStart: 32,
          },
          children: [
            {
              name: 'Title',
              elementType: 'h3',
              styles: {
                fontSize: '24px',
              },
              textContent: 'Card Title',
              children: [],
            },
            {
              name: 'Description',
              elementType: 'p',
              styles: {
                marginBlockStart: 16,
                fontSize: '16px',
              },
              textContent: 'Card description',
              children: [],
            },
            {
              name: 'Button',
              elementType: 'a',
              styles: {
                marginBlockStart: 24,
                paddingBlockStart: 10,
                paddingBlockEnd: 10,
              },
              textContent: 'Learn more',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        // Title has no margin/padding, shouldn't need wrapper
        expect(result.wrapperNodes).not.toContain('Title')

        // Description has margin, should need wrapper
        expect(result.wrapperNodes).toContain('Description')

        // Button has both margin and padding, should need wrapper
        expect(result.wrapperNodes).toContain('Button')

        // Check auto layout nodes
        expect(result.autoLayoutNodes.some((al) => al.nodeName === 'Description-wrapper')).toBe(true)
        expect(result.autoLayoutNodes.some((al) => al.nodeName === 'Button-wrapper')).toBe(true)

        expect(result.wrapperNodes).toHaveLength(2)
      })
    })

    describe('grid layout detection', () => {
      it('should detect grid containers and capture grid template columns', () => {
        const spec: CoralRootNode = {
          name: 'GridContainer',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
          children: [
            {
              name: 'GridItem1',
              elementType: 'div',
              styles: {},
              children: [],
            },
            {
              name: 'GridItem2',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const gridNode = result.autoLayoutNodes.find((al) => al.nodeName === 'GridContainer')
        expect(gridNode).toBeDefined()
        expect(gridNode?.reason).toBe('grid-layout')
        expect(gridNode?.layoutMode).toBe('GRID')
        expect(gridNode?.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))')
      })

      it('should detect single column grid', () => {
        const spec: CoralRootNode = {
          name: 'SingleColumnGrid',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          },
          children: [
            {
              name: 'Item',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const gridNode = result.autoLayoutNodes.find((al) => al.nodeName === 'SingleColumnGrid')
        expect(gridNode?.gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))')
        expect(gridNode?.layoutMode).toBe('GRID')
      })

      it('should capture grid gap properties', () => {
        const spec: CoralRootNode = {
          name: 'GridWithGaps',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: 16,
            rowGap: 24,
          },
          children: [
            {
              name: 'Item1',
              elementType: 'div',
              styles: {},
              children: [],
            },
            {
              name: 'Item2',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const gridNode = result.autoLayoutNodes.find((al) => al.nodeName === 'GridWithGaps')
        expect(gridNode?.columnGap).toBe(16)
        expect(gridNode?.rowGap).toBe(24)
      })

      it('should handle grid with responsive breakpoints (mobile-first)', () => {
        const spec: CoralRootNode = {
          name: 'ResponsiveGrid',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            rowGap: 24,
          },
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '640px',
              },
              styles: {
                rowGap: 0,
              },
            },
            {
              breakpoint: {
                type: 'min-width',
                value: '1024px',
              },
              styles: {
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              },
            },
          ],
          children: [
            {
              name: 'Item1',
              elementType: 'div',
              styles: {},
              children: [],
            },
            {
              name: 'Item2',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const gridNode = result.autoLayoutNodes.find((al) => al.nodeName === 'ResponsiveGrid')
        expect(gridNode?.gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))')
        expect(gridNode?.rowGap).toBe(24)

        // Verify responsive variants collected
        expect(result.responsiveVariants).toHaveLength(2)
      })

      it('should not detect grid for non-grid containers', () => {
        const spec: CoralRootNode = {
          name: 'RegularDiv',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          children: [
            {
              name: 'Child',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const gridNode = result.autoLayoutNodes.find(
          (al) => al.nodeName === 'RegularDiv' && al.reason === 'grid-layout',
        )
        expect(gridNode).toBeUndefined()
      })

      it('should handle grid with margin that should be applied as padding', () => {
        const spec: CoralRootNode = {
          name: 'GridWithMargin',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            marginBlockStart: 64,
            marginInlineStart: 'auto',
            marginInlineEnd: 'auto',
          },
          children: [
            {
              name: 'Item',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const gridNode = result.autoLayoutNodes.find((al) => al.nodeName === 'GridWithMargin')
        expect(gridNode?.layoutMode).toBe('GRID')
        expect(gridNode?.reason).toBe('grid-layout')
      })

      it('should require children for grid layout detection', () => {
        const spec: CoralRootNode = {
          name: 'EmptyGrid',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          children: [],
        }

        const result = collectFontsAndStyles(spec)

        const gridNode = result.autoLayoutNodes.find((al) => al.nodeName === 'EmptyGrid' && al.reason === 'grid-layout')
        expect(gridNode).toBeUndefined()
      })

      it('should handle real-world card grid layout', () => {
        const spec: CoralRootNode = {
          name: 'CardGrid',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            rowGap: 32,
          },
          responsiveStyles: [
            {
              breakpoint: {
                type: 'min-width',
                value: '768px',
              },
              label: 'Tablet',
              styles: {
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                columnGap: 24,
              },
            },
            {
              breakpoint: {
                type: 'min-width',
                value: '1024px',
              },
              label: 'Desktop',
              styles: {
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              },
            },
          ],
          children: [
            {
              name: 'Card1',
              elementType: 'div',
              styles: {},
              children: [],
            },
            {
              name: 'Card2',
              elementType: 'div',
              styles: {},
              children: [],
            },
            {
              name: 'Card3',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const gridNode = result.autoLayoutNodes.find((al) => al.nodeName === 'CardGrid')
        expect(gridNode?.layoutMode).toBe('GRID')
        expect(gridNode?.gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))')
        expect(gridNode?.rowGap).toBe(32)
        expect(gridNode?.hasChildren).toBe(true)

        // Verify responsive variants
        expect(result.responsiveVariants).toHaveLength(2)
        expect(result.responsiveVariants[0].label).toBe('Tablet')
        expect(result.responsiveVariants[1].label).toBe('Desktop')
      })
    })

    describe('flex layout detection', () => {
      it('should detect flex containers and determine layout mode', () => {
        const spec: CoralRootNode = {
          name: 'FlexContainer',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'flex',
            flexDirection: 'row',
          },
          children: [
            {
              name: 'Child1',
              elementType: 'div',
              styles: {},
              children: [],
            },
            {
              name: 'Child2',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find((al) => al.nodeName === 'FlexContainer')
        expect(flexNode).toBeDefined()
        expect(flexNode?.reason).toBe('flex-layout')
        expect(flexNode?.layoutMode).toBe('HORIZONTAL')
        expect(flexNode?.flexDirection).toBe('row')
      })

      it('should detect column flex direction as VERTICAL', () => {
        const spec: CoralRootNode = {
          name: 'FlexColumn',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'flex',
            flexDirection: 'column',
          },
          children: [
            {
              name: 'Child',
              elementType: 'p',
              styles: {},
              textContent: 'Text',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find((al) => al.nodeName === 'FlexColumn')
        expect(flexNode?.layoutMode).toBe('VERTICAL')
      })

      it('should capture justify-content and align-items', () => {
        const spec: CoralRootNode = {
          name: 'FlexCentered',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: [
            {
              name: 'Child',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find((al) => al.nodeName === 'FlexCentered')
        expect(flexNode?.justifyContent).toBe('center')
        expect(flexNode?.alignItems).toBe('center')
      })

      it('should capture gap properties', () => {
        const spec: CoralRootNode = {
          name: 'FlexWithGap',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'flex',
            gap: 16,
          },
          children: [
            {
              name: 'Child1',
              elementType: 'div',
              styles: {},
              children: [],
            },
            {
              name: 'Child2',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find((al) => al.nodeName === 'FlexWithGap')
        expect(flexNode?.gap).toBe(16)
      })

      it('should capture columnGap and rowGap separately', () => {
        const spec: CoralRootNode = {
          name: 'FlexWithSeparateGaps',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'flex',
            columnGap: 12,
            rowGap: 24,
          },
          children: [
            {
              name: 'Child',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find((al) => al.nodeName === 'FlexWithSeparateGaps')
        expect(flexNode?.columnGap).toBe(12)
        expect(flexNode?.rowGap).toBe(24)
      })

      it('should handle flex with space-between', () => {
        const spec: CoralRootNode = {
          name: 'FlexSpaceBetween',
          elementType: 'div',
          elementAttributes: {},
          styles: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          },
          children: [
            {
              name: 'Child1',
              elementType: 'div',
              styles: {},
              children: [],
            },
            {
              name: 'Child2',
              elementType: 'div',
              styles: {},
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find((al) => al.nodeName === 'FlexSpaceBetween')
        expect(flexNode?.justifyContent).toBe('space-between')
        expect(flexNode?.alignItems).toBe('baseline')
      })

      it('should not add flex layout for containers without display flex', () => {
        const spec: CoralRootNode = {
          name: 'RegularDiv',
          elementType: 'div',
          elementAttributes: {},
          styles: {},
          children: [
            {
              name: 'Child',
              elementType: 'p',
              styles: {},
              textContent: 'Text',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find(
          (al) => al.nodeName === 'RegularDiv' && al.reason === 'flex-layout',
        )
        expect(flexNode).toBeUndefined()
      })

      it('should handle inline-flex', () => {
        const spec: CoralRootNode = {
          name: 'InlineFlex',
          elementType: 'span',
          elementAttributes: {},
          styles: {
            display: 'inline-flex',
            gap: 8,
          },
          children: [
            {
              name: 'Child',
              elementType: 'span',
              styles: {},
              textContent: 'Text',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find((al) => al.nodeName === 'InlineFlex')
        expect(flexNode).toBeDefined()
        expect(flexNode?.reason).toBe('flex-layout')
      })

      it('should handle real-world pricing card flex layout', () => {
        const spec: CoralRootNode = {
          name: 'PriceDisplay',
          elementType: 'p',
          elementAttributes: {},
          styles: {
            display: 'flex',
            alignItems: 'baseline',
            columnGap: 8,
          },
          children: [
            {
              name: 'Price',
              elementType: 'span',
              styles: {
                fontSize: '48px',
                fontWeight: 600,
              },
              textContent: '$29',
              children: [],
            },
            {
              name: 'Period',
              elementType: 'span',
              styles: {
                fontSize: '16px',
              },
              textContent: '/month',
              children: [],
            },
          ],
        }

        const result = collectFontsAndStyles(spec)

        const flexNode = result.autoLayoutNodes.find((al) => al.nodeName === 'PriceDisplay')
        expect(flexNode?.layoutMode).toBe('HORIZONTAL')
        expect(flexNode?.alignItems).toBe('baseline')
        expect(flexNode?.columnGap).toBe(8)
      })
    })
  })
})
