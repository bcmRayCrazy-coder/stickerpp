// Electron 主进程 与 渲染进程 交互的桥梁
const { contextBridge, ipcRenderer } = require('electron');

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld('stickerpp', {
    getConfig: () => ipcRenderer.invoke('LiteLoader.stickerpp.getConfig'),
    setConfig: (content) =>
        ipcRenderer.invoke('LiteLoader.stickerpp.setConfig', content),
    showStickerDir: () =>
        ipcRenderer.invoke('LiteLoader.stickerpp.showStickerDir'),
    getLocalStickers: () =>
        ipcRenderer.invoke('LiteLoader.stickerpp.getLocalStickers'),
});
