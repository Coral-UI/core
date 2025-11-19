import { useElementSelectionStore } from '@/stores/useElementSelectionStore'
import { useRef, useState } from 'react'

import type { CoralRootNode } from '@reallygoodwork/coral-core'

import { IframeRenderer } from './IframeRenderer'
import { InteractionLayer } from './InteractionLayer'

interface HTMLRendererProps {
  spec: CoralRootNode
  viewportWidth: number
  cssReset?: string
}

export const HTMLRenderer = ({ spec, viewportWidth, cssReset }: HTMLRendererProps) => {
  const selectedElementId = useElementSelectionStore((state) => state.selectedElementId)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isIframeReady, setIsIframeReady] = useState(false)

  const handleIframeLoad = () => {
    setIsIframeReady(true)
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto   relative flex items-center justify-center">
      <div
        className="preview-background h-full border border-border p-4 rounded-xl"
        style={{ width: viewportWidth + 'px' }}
      >
        <IframeRenderer
          ref={iframeRef}
          spec={spec}
          selectedElementId={selectedElementId}
          viewportWidth={viewportWidth}
          cssReset={cssReset}
          onLoad={handleIframeLoad}
        />
        {isIframeReady && <InteractionLayer iframeRef={iframeRef} containerRef={containerRef} spec={spec} />}
      </div>
    </div>
  )
}
