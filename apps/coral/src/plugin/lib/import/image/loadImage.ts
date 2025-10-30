/**
 * Loads an image from a URL and returns the Figma Image object
 * @param url - The URL of the image to load
 * @returns Promise<Image> - The loaded Figma Image object
 */
export const loadImage = async (url: string): Promise<Image> => {
  try {
    const image = await figma.createImageAsync(url)
    return image
  } catch (error) {
    console.error(`Failed to load image from ${url}:`, error)
    throw error
  }
}

/**
 * Creates a frame with an image fill from a URL
 * @param url - The URL of the image to load
 * @param width - Optional width for the frame
 * @param height - Optional height for the frame
 * @returns Promise<FrameNode> - A frame with the image as fill
 */
export const createImageFrame = async (url: string, width?: number, height?: number): Promise<FrameNode> => {
  const image = await loadImage(url)
  const frame = figma.createFrame()

  // Get image dimensions if width/height not provided
  let frameWidth = width
  let frameHeight = height

  if (!frameWidth || !frameHeight) {
    const { width: imgWidth, height: imgHeight } = await image.getSizeAsync()
    frameWidth = width || imgWidth
    frameHeight = height || imgHeight
  }

  // Set frame size
  frame.resize(frameWidth, frameHeight)

  // Apply image as fill
  frame.fills = [
    {
      type: 'IMAGE',
      imageHash: image.hash,
      scaleMode: 'FILL',
    },
  ]

  return frame
}
