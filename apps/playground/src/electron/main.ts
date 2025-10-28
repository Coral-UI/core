import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env['APP_ROOT'] = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env['APP_ROOT']!, 'dist-electron')
export const RENDERER_DIST = path.join(process.env['APP_ROOT']!, 'dist')

process.env['VITE_PUBLIC'] = VITE_DEV_SERVER_URL
  ? path.join(process.env['APP_ROOT']!, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(process.env['VITE_PUBLIC']!, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTools if in development
    win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

// IPC Handlers for file system operations
ipcMain.handle('fs:readFile', async (_, filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return { success: true, data: content }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('fs:writeFile', async (_, filePath: string, content: string) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('fs:readdir', async (_, dirPath: string) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const items = entries.map((entry) => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDirectory: entry.isDirectory(),
    }))
    return { success: true, data: items }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('dialog:openFile', async () => {
  if (!win) {
    return { success: false, error: 'No window available' }
  }

  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      { name: 'Coral Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, canceled: true }
  }

  try {
    const filePath = result.filePaths[0]
    const content = await fs.readFile(filePath, 'utf-8')
    return { success: true, data: { path: filePath, content } }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle('dialog:saveFile', async (_, content: string, defaultName?: string) => {
  if (!win) {
    return { success: false, error: 'No window available' }
  }

  const result = await dialog.showSaveDialog(win, {
    defaultPath: defaultName || 'coral-spec.json',
    filters: [
      { name: 'Coral Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (result.canceled || !result.filePath) {
    return { success: false, canceled: true }
  }

  try {
    await fs.writeFile(result.filePath, content, 'utf-8')
    return { success: true, path: result.filePath }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})
