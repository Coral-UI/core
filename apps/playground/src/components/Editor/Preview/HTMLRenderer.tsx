import { useRef, useState } from 'react'

import type { CoralRootNode } from '@reallygoodwork/coral-core'

import { IframeRenderer } from './IframeRenderer'
import { InteractionLayer } from './InteractionLayer'

interface HTMLRendererProps {
  spec: CoralRootNode
  onElementClick: ((elementId: string) => void) | undefined
  selectedElementId: string | null | undefined
  viewportWidth: number
}

export const HTMLRenderer = ({ spec, onElementClick, selectedElementId, viewportWidth }: HTMLRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isIframeReady, setIsIframeReady] = useState(false)

  const handleIframeLoad = () => {
    setIsIframeReady(true)
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-white dark:bg-neutral-950 border border-input p-4 rounded-xl relative"
    >
      <IframeRenderer
        ref={iframeRef}
        spec={spec}
        selectedElementId={selectedElementId}
        viewportWidth={viewportWidth}
        onLoad={handleIframeLoad}
      />
      {isIframeReady && (
        <InteractionLayer
          iframeRef={iframeRef}
          containerRef={containerRef}
          spec={spec}
          onElementClick={onElementClick}
          selectedElementId={selectedElementId}
        />
      )}
      {/* Debug: Show hit zone count */}
      {process.env['NODE_ENV'] === 'development' && (
        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs p-2 rounded z-50">
          Hit zones: {isIframeReady ? 'ready' : 'waiting'}
        </div>
      )}
    </div>
  )
}
