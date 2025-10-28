import { contextBridge, ipcRenderer } from 'electron'

// Define the API that will be exposed to the renderer process
export interface ElectronAPI {
  fs: {
    readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>
    writeFile: (
      filePath: string,
      content: string,
    ) => Promise<{ success: boolean; error?: string }>
    readdir: (
      dirPath: string,
    ) => Promise<{
      success: boolean
      data?: Array<{ name: string; path: string; isDirectory: boolean }>
      error?: string
    }>
  }
  dialog: {
    openFile: () => Promise<{
      success: boolean
      canceled?: boolean
      data?: { path: string; content: string }
      error?: string
    }>
    saveFile: (
      content: string,
      defaultName?: string,
    ) => Promise<{ success: boolean; canceled?: boolean; path?: string; error?: string }>
  }
  platform: 'electron'
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  fs: {
    readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath: string, content: string) =>
      ipcRenderer.invoke('fs:writeFile', filePath, content),
    readdir: (dirPath: string) => ipcRenderer.invoke('fs:readdir', dirPath),
  },
  dialog: {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveFile: (content: string, defaultName?: string) =>
      ipcRenderer.invoke('dialog:saveFile', content, defaultName),
  },
  platform: 'electron' as const,
} satisfies ElectronAPI)

// Add type declaration for window.electron
declare global {
  interface Window {
    electron?: ElectronAPI
  }
}
