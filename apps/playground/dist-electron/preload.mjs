"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  fs: {
    readFile: (filePath) => electron.ipcRenderer.invoke("fs:readFile", filePath),
    writeFile: (filePath, content) => electron.ipcRenderer.invoke("fs:writeFile", filePath, content),
    readdir: (dirPath) => electron.ipcRenderer.invoke("fs:readdir", dirPath)
  },
  dialog: {
    openFile: () => electron.ipcRenderer.invoke("dialog:openFile"),
    saveFile: (content, defaultName) => electron.ipcRenderer.invoke("dialog:saveFile", content, defaultName)
  },
  platform: "electron"
});
