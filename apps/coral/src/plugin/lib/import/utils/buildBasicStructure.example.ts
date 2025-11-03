import { CoralRootNode } from '@reallygoodwork/coral-core'

import { buildBasicStructure } from './buildBasicStructure'

/**
 * Example usage of buildBasicStructure
 * This can be called from the plugin to test the structure builder
 */
export async function exampleBuildStructure() {
  // Example 1: Simple centered hero section
  const heroSpec: CoralRootNode = {
    name: 'HeroSection',
    elementType: 'div',
    elementAttributes: {},
    styles: {
      textAlign: 'center',
      padding: '40px',
    },
    children: [
      {
        name: 'Title',
        elementType: 'h2',
        styles: {
          fontSize: '32px',
          fontWeight: 700,
        },
        textContent: 'Welcome to Our Platform',
        children: [],
      },
      {
        name: 'Subtitle',
        elementType: 'p',
        styles: {
          fontSize: '18px',
          fontWeight: 400,
        },
        textContent: 'Build better products faster',
        children: [],
      },
    ],
  }

  const { component: heroComponent, analysis: heroAnalysis } = await buildBasicStructure(heroSpec)

  console.log('Hero Section Created:')
  console.log('- Auto Layout Nodes:', heroAnalysis.autoLayoutNodes)
  console.log('- Fonts Loaded:', heroAnalysis.fontsToLoad)
  console.log('- Component:', heroComponent.name)

  // Position on page
  heroComponent.x = 100
  heroComponent.y = 100

  // Example 2: Responsive card with variants
  const cardSpec: CoralRootNode = {
    name: 'Card',
    elementType: 'div',
    elementAttributes: {},
    styles: {
      padding: '16px',
    },
    responsiveStyles: [
      {
        breakpoint: {
          type: 'min-width',
          value: '768px',
        },
        label: 'Tablet',
        styles: {
          padding: '24px',
        },
      },
      {
        breakpoint: {
          type: 'min-width',
          value: '1024px',
        },
        label: 'Desktop',
        styles: {
          padding: '32px',
        },
      },
    ],
    children: [
      {
        name: 'CardTitle',
        elementType: 'h3',
        styles: {
          fontSize: '24px',
          fontWeight: 700,
        },
        textContent: 'Card Title',
        children: [],
      },
      {
        name: 'CardContent',
        elementType: 'p',
        styles: {
          fontSize: '16px',
        },
        textContent: 'This is the card content that adapts to different screen sizes.',
        children: [],
      },
    ],
  }

  const { component: cardComponent, analysis: cardAnalysis } = await buildBasicStructure(cardSpec)

  console.log('\nCard with Variants Created:')
  console.log('- Responsive Variants:', cardAnalysis.responsiveVariants.map((v) => v.name))
  console.log('- Component:', cardComponent.name)
  console.log('- Type:', cardComponent.type)

  // Position on page
  cardComponent.x = 100
  cardComponent.y = 400

  // Example 3: List with inherited text alignment
  const listSpec: CoralRootNode = {
    name: 'List',
    elementType: 'ul',
    elementAttributes: {},
    styles: {
      textAlign: 'left',
    },
    children: [
      {
        name: 'ListItem1',
        elementType: 'li',
        styles: {},
        textContent: 'First item',
        children: [],
      },
      {
        name: 'ListItem2',
        elementType: 'li',
        styles: {},
        textContent: 'Second item',
        children: [],
      },
      {
        name: 'ListItem3',
        elementType: 'li',
        styles: {},
        textContent: 'Third item',
        children: [],
      },
    ],
  }

  const { component: listComponent, analysis: listAnalysis } = await buildBasicStructure(listSpec)

  console.log('\nList Created:')
  console.log('- Node Styles:', listAnalysis.nodeStyles.length, 'nodes analyzed')
  console.log('- Component:', listComponent.name)

  // Position on page
  listComponent.x = 500
  listComponent.y = 100

  return {
    hero: { component: heroComponent, analysis: heroAnalysis },
    card: { component: cardComponent, analysis: cardAnalysis },
    list: { component: listComponent, analysis: listAnalysis },
  }
}

/**
 * Test with a user-provided spec value
 * Call this from the plugin with: await testWithSpecValue(specValue)
 */
export async function testWithSpecValue(spec: CoralRootNode) {
  try {
    const { component, analysis } = await buildBasicStructure(spec)

    console.log('\n=== Structure Built Successfully ===')
    console.log('Component Name:', component.name)
    console.log('Component Type:', component.type)
    console.log('\nAnalysis:')
    console.log('- Fonts to Load:', analysis.fontsToLoad)
    console.log('- Responsive Variants:', analysis.responsiveVariants.length)
    console.log('- Auto Layout Nodes:', analysis.autoLayoutNodes.length)
    console.log('- Nodes Analyzed:', analysis.nodeStyles.length)

    if (analysis.autoLayoutNodes.length > 0) {
      console.log('\nAuto Layout Requirements:')
      analysis.autoLayoutNodes.forEach((al) => {
        console.log(`  - ${al.nodeName} (${al.nodeType}): ${al.textAlign} alignment`)
      })
    }

    if (analysis.responsiveVariants.length > 0) {
      console.log('\nResponsive Variants:')
      analysis.responsiveVariants.forEach((rv) => {
        console.log(`  - ${rv.name} at depth ${rv.depth}`)
      })
    }

    // Position on page
    component.x = 100
    component.y = 100

    // Select the component to show it was created
    figma.currentPage.selection = [component]
    figma.viewport.scrollAndZoomIntoView([component])

    return { component, analysis }
  } catch (error) {
    console.error('Error building structure:', error)
    throw error
  }
}
