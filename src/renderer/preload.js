// Electron 主进程 与 渲染进程 交互的桥梁
const { contextBridge, ipcRenderer } = require('electron');

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld('stickerpp', {
    // 配置
    getConfig: () => ipcRenderer.invoke('LiteLoader.stickerpp.getConfig'),
    setConfig: (content) =>
        ipcRenderer.invoke('LiteLoader.stickerpp.setConfig', content),

    // 表情
    getLocalStickers: () =>
        ipcRenderer.invoke('LiteLoader.stickerpp.getLocalStickers'),
    getRemoteStickers: () =>
        ipcRenderer.invoke('LiteLoader.stickerpp.getRemoteStickers'),
    downloadRemoteSticker: (url) =>
        ipcRenderer.invoke('LiteLoader.stickerpp.downloadRemoteSticker', url),

    // 操作
    openPath: (path) =>
        ipcRenderer.invoke('LiteLoader.stickerpp.action.openPath', path),
    openExternal: (url) =>
        ipcRenderer.invoke('LiteLoader.stickerpp.action.openExternal', url),
    showItem: (path) =>
        ipcRenderer.invoke('LiteLoader.stickerpp.action.showItem', path),
});
