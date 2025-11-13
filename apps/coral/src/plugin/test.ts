// Quick Script: GRID without wrappers. Sections sized explicitly, text = FILL.
// 2 columns, bottom row spans both columns. Parent height computed.

export async function createGrid() {
  // Fonts
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' }).catch(() => {})

  // Config
  const PADDING = 16
  const GAP = 16
  const GRID_WIDTH = 960

  // Parent GRID
  const grid = figma.createFrame()
  grid.name = 'Grid Example'
  grid.layoutMode = 'GRID'
  grid.gridRowCount = 2 // top row + bottom row
  grid.gridColumnCount = 2 // two columns
  grid.gridRowGap = GAP
  grid.gridColumnGap = GAP
  grid.paddingTop = grid.paddingRight = grid.paddingBottom = grid.paddingLeft = PADDING
  grid.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }]
  grid.resizeWithoutConstraints(GRID_WIDTH, 1) // fixed width, temp height

  const innerWidth = GRID_WIDTH - PADDING * 2
  const colWidth = Math.floor((innerWidth - GAP) / 2)
  const fullWidth = innerWidth

  // Helpers
  const makeText = (txt, size, style) => {
    const t = figma.createText()
    t.fontName = { family: 'Inter', style }
    t.fontSize = size
    t.characters = txt
    t.fills = [{ type: 'SOLID', color: { r: 0.12, g: 0.12, b: 0.12 } }]
    return t
  }

  const makeSection = (titleText, bodyText) => {
    const section = figma.createFrame()
    section.name = 'Section'
    section.layoutMode = 'VERTICAL' // auto-layout for inner content
    section.primaryAxisSizingMode = 'AUTO' // height hugs content
    section.counterAxisSizingMode = 'AUTO' // width will be made FIXED after append
    section.paddingTop = section.paddingRight = section.paddingBottom = section.paddingLeft = 16
    section.itemSpacing = 8
    section.cornerRadius = 8
    section.strokes = [{ type: 'SOLID', color: { r: 0.89, g: 0.89, b: 0.89 } }]
    section.strokeWeight = 1
    section.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]

    const h2 = makeText(titleText, 20, 'Semi Bold')
    const p = makeText(bodyText, 14, 'Regular')
    section.appendChild(h2)
    section.appendChild(p)

    // Safe to set text FILL now. Parent is auto-layout.
    h2.layoutSizingHorizontal = 'FILL'
    h2.layoutSizingVertical = 'HUG'
    p.layoutSizingHorizontal = 'FILL'
    p.layoutSizingVertical = 'HUG'

    return section
  }

  // Sections
  const col1 = makeSection(
    'Column One Title',
    'Supporting text for column one. Add a few sentences to simulate body copy and wrapping behavior.',
  )
  const col2 = makeSection(
    'Column Two Title',
    'Supporting text for column two. Use this area to test text flow and spacing.',
  )
  const bottom = makeSection(
    'Bottom Row Title',
    'This row spans both columns. Useful for a summary, CTA, or footer content.',
  )

  // Append to GRID first, then size and place
  grid.appendChild(col1)
  grid.appendChild(col2)
  grid.appendChild(bottom)

  // Position in GRID
  col1.setGridChildPosition(0, 0)
  col2.setGridChildPosition(0, 1)
  bottom.setGridChildPosition(1, 0)
  bottom.gridColumnSpan = 2

  // Since parent is GRID, children cannot use FILL/HUG horizontally.
  // Set explicit widths and mark counter axis as FIXED so width sticks.
  col1.counterAxisSizingMode = 'FIXED'
  col2.counterAxisSizingMode = 'FIXED'
  bottom.counterAxisSizingMode = 'FIXED'

  col1.resizeWithoutConstraints(colWidth, col1.height || 1)
  col2.resizeWithoutConstraints(colWidth, col2.height || 1)
  bottom.resizeWithoutConstraints(fullWidth, bottom.height || 1)

  // Attach and let layout resolve so text wraps and heights settle
  figma.currentPage.appendChild(grid)
  await Promise.resolve()

  // Compute heights and include the row gap
  const row0Height = Math.max(col1.height, col2.height)
  const row1Height = bottom.height
  const totalHeight = PADDING + row0Height + GAP + row1Height + PADDING

  // Resize GRID to exact height
  grid.resizeWithoutConstraints(GRID_WIDTH, totalHeight)

  grid.x = 200
  grid.y = 200
  figma.viewport.scrollAndZoomIntoView([grid])
  figma.closePlugin('Grid created without wrappers. Children sized explicitly.')
}
