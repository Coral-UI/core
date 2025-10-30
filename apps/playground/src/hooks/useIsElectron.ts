import { useMemo } from 'react'

interface WindowWithPlatform extends Window {
  platform?: { type?: string }
}

export function useIsElectron(): { isElectron: boolean; isMac: boolean; isWindows: boolean } {
  return useMemo(() => {
    if (typeof navigator === 'undefined') {
      return { isElectron: false, isMac: false, isWindows: false }
    }
    const platform = (window as WindowWithPlatform).platform?.type ?? navigator.userAgent
    const isMac = platform.includes('darwin') || navigator.userAgent.includes('Mac')
    const isWindows = platform.includes('win32') || navigator.userAgent.includes('Win')
    return {
      isElectron: navigator.userAgent.toLowerCase().includes('electron'),
      isMac,
      isWindows,
    }
  }, [])
}
