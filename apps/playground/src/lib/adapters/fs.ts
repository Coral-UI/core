import { getElectronAPI, isElectron } from './platform'

/**
 * File system adapter interface
 * Provides a unified API for file operations across Electron and browser environments
 */
export interface FileSystemAdapter {
  /**
   * Read a file's contents
   * @param filePath - Path to the file (Electron only)
   * @returns Promise with file content
   */
  readFile(filePath?: string): Promise<string>

  /**
   * Write content to a file
   * @param content - Content to write
   * @param filePath - Path to the file (Electron only)
   * @returns Promise that resolves when write is complete
   */
  writeFile(content: string, filePath?: string): Promise<void>

  /**
   * Open a file picker dialog
   * @returns Promise with file content and metadata
   */
  openFile(): Promise<{ content: string; path?: string; name: string }>

  /**
   * Save file dialog
   * @param content - Content to save
   * @param defaultName - Default file name
   * @returns Promise that resolves when save is complete
   */
  saveFile(content: string, defaultName?: string): Promise<void>

  /**
   * Check if the platform supports file system access
   */
  hasFileSystemAccess(): boolean
}

/**
 * Electron file system implementation
 */
class ElectronFS implements FileSystemAdapter {
  async readFile(filePath: string): Promise<string> {
    const api = getElectronAPI()
    const result = await api.fs.readFile(filePath)

    if (!result.success) {
      throw new Error(result.error || 'Failed to read file')
    }

    return result.data!
  }

  async writeFile(content: string, filePath: string): Promise<void> {
    const api = getElectronAPI()
    const result = await api.fs.writeFile(filePath, content)

    if (!result.success) {
      throw new Error(result.error || 'Failed to write file')
    }
  }

  async openFile(): Promise<{ content: string; path?: string; name: string }> {
    const api = getElectronAPI()
    const result = await api.dialog.openFile()

    if (!result.success) {
      if (result.canceled) {
        throw new Error('File selection canceled')
      }
      throw new Error(result.error || 'Failed to open file')
    }

    const fileName = result.data!.path.split('/').pop() || 'unknown'
    return {
      content: result.data!.content,
      path: result.data!.path,
      name: fileName,
    }
  }

  async saveFile(content: string, defaultName?: string): Promise<void> {
    const api = getElectronAPI()
    const result = await api.dialog.saveFile(content, defaultName)

    if (!result.success) {
      if (result.canceled) {
        throw new Error('File save canceled')
      }
      throw new Error(result.error || 'Failed to save file')
    }
  }

  hasFileSystemAccess(): boolean {
    return true
  }
}

/**
 * Browser file system implementation using File System Access API
 * Falls back to traditional download/upload for unsupported browsers
 */
class BrowserFS implements FileSystemAdapter {
  private hasNativeFileAccess =
    typeof window !== 'undefined' && 'showOpenFilePicker' in window

  async readFile(): Promise<string> {
    throw new Error(
      'readFile with path is not supported in browser. Use openFile() instead.',
    )
  }

  async writeFile(): Promise<void> {
    throw new Error(
      'writeFile with path is not supported in browser. Use saveFile() instead.',
    )
  }

  async openFile(): Promise<{ content: string; path?: string; name: string }> {
    if (this.hasNativeFileAccess) {
      return this.openFileWithAccessAPI()
    }
    return this.openFileWithInput()
  }

  private async openFileWithAccessAPI(): Promise<{
    content: string
    path?: string
    name: string
  }> {
    const [fileHandle] = await (window as any).showOpenFilePicker({
      types: [
        {
          description: 'Coral Files',
          accept: { 'application/json': ['.json'] },
        },
      ],
      multiple: false,
    })

    const file = await fileHandle.getFile()
    const content = await file.text()

    return {
      content,
      name: file.name,
    }
  }

  private openFileWithInput(): Promise<{ content: string; path?: string; name: string }> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }

        try {
          const content = await file.text()
          resolve({
            content,
            name: file.name,
          })
        } catch (error) {
          reject(error)
        }
      }

      input.oncancel = () => {
        reject(new Error('File selection canceled'))
      }

      input.click()
    })
  }

  async saveFile(content: string, defaultName = 'coral-spec.json'): Promise<void> {
    if (this.hasNativeFileAccess) {
      return this.saveFileWithAccessAPI(content, defaultName)
    }
    return this.saveFileWithDownload(content, defaultName)
  }

  private async saveFileWithAccessAPI(content: string, defaultName: string): Promise<void> {
    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: defaultName,
        types: [
          {
            description: 'Coral Files',
            accept: { 'application/json': ['.json'] },
          },
        ],
      })

      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('File save canceled')
      }
      throw error
    }
  }

  private saveFileWithDownload(content: string, defaultName: string): Promise<void> {
    return new Promise((resolve) => {
      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = defaultName
      a.click()
      URL.revokeObjectURL(url)
      resolve()
    })
  }

  hasFileSystemAccess(): boolean {
    return this.hasNativeFileAccess
  }
}

/**
 * Get the appropriate file system adapter for the current platform
 */
export function getFileSystemAdapter(): FileSystemAdapter {
  if (isElectron()) {
    return new ElectronFS()
  }
  return new BrowserFS()
}

/**
 * Singleton instance of the file system adapter
 */
export const fs = getFileSystemAdapter()
