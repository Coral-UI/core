/**
 * Coordinate transformation utilities for converting between iframe and parent container coordinate systems
 */

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Get the bounding rectangle of an iframe relative to its parent container
 */
export function getIframeBoundingRect(iframe: HTMLIFrameElement): BoundingBox {
  const rect = iframe.getBoundingClientRect()
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  }
}

/**
 * Transform coordinates from iframe's coordinate system to parent container's coordinate system
 *
 * Strategy:
 * 1. Element position relative to iframe viewport (both are viewport-relative)
 * 2. Add iframe scroll to get element position in iframe content
 * 3. Get iframe position relative to container (both are viewport-relative)
 * 4. Combine: iframe position in container + element position in iframe content - container scroll
 *
 * Note: Container padding is handled by the container's positioning context
 */
export function transformIframeToParent(
  iframeRect: BoundingBox,
  elementRect: DOMRect,
  containerScrollX: number = 0,
  containerScrollY: number = 0,
  containerRect?: DOMRect,
  iframeElement?: HTMLIFrameElement,
): BoundingBox {
  if (!containerRect || !iframeElement) {
    // Fallback if container rect or iframe element not available
    return {
      x: elementRect.left - iframeRect.x - containerScrollX,
      y: elementRect.top - iframeRect.y - containerScrollY,
      width: elementRect.width,
      height: elementRect.height,
    }
  }

  // All getBoundingClientRect() calls return coordinates relative to viewport
  // The InteractionLayer is positioned absolutely with inset-0 relative to container
  // This means it's positioned at the container's padding edge (not content edge)

  // The container has p-4 padding, so:
  // - Container's content box starts at containerRect.left + padding
  // - Iframe is positioned inside the padding
  // - InteractionLayer with inset-0 starts at containerRect.left (padding edge)

  // The element's getBoundingClientRect() inside an iframe returns coordinates
  // relative to the PARENT page's viewport, which already includes iframe transformation.
  // However, based on the logs, elementRect.left (16) appears to be relative to
  // the iframe's content, not the viewport.
  //
  // Iframe is at viewport (281, 157), container is at (264, 140)
  // Iframe is inside container with padding, so iframe starts at container.left + padding
  // Container has p-4 (16px padding), so iframe should be at ~264+16=280, which matches 281

  // Step 1: Element position relative to iframe content
  // elementRect appears to be relative to iframe content coordinates
  const elementInIframeContentX = elementRect.left
  const elementInIframeContentY = elementRect.top

  // Step 2: Iframe position relative to container (accounting for padding)
  // Container has p-4 padding, iframe is positioned inside that padding
  const iframeOffsetFromContainerX = iframeRect.x - containerRect.left
  const iframeOffsetFromContainerY = iframeRect.y - containerRect.top

  // Step 3: Element position relative to container = iframe offset + element in iframe - scroll
  const finalX = iframeOffsetFromContainerX + elementInIframeContentX - containerScrollX
  const finalY = iframeOffsetFromContainerY + elementInIframeContentY - containerScrollY

  // Debug: Log intermediate values
  if (process.env['NODE_ENV'] === 'development') {
    console.log('Coordinate transform debug:', {
      elementRectLeft: elementRect.left,
      elementRectTop: elementRect.top,
      iframeRectX: iframeRect.x,
      iframeRectY: iframeRect.y,
      containerRectLeft: containerRect.left,
      containerRectTop: containerRect.top,
      elementInIframeContentX,
      elementInIframeContentY,
      iframeOffsetFromContainerX,
      iframeOffsetFromContainerY,
      containerScrollX,
      containerScrollY,
      finalX,
      finalY,
    })
  }

  return {
    x: finalX,
    y: finalY,
    width: elementRect.width,
    height: elementRect.height,
  }
}

/**
 * Get scroll offsets from an iframe's content window
 */
export function getIframeScrollOffsets(iframe: HTMLIFrameElement): { x: number; y: number } {
  try {
    const contentWindow = iframe.contentWindow
    if (!contentWindow) {
      return { x: 0, y: 0 }
    }
    return {
      x: contentWindow.scrollX || contentWindow.pageXOffset || 0,
      y: contentWindow.scrollY || contentWindow.pageYOffset || 0,
    }
  } catch {
    // Cross-origin iframe - return zero offsets
    return { x: 0, y: 0 }
  }
}
