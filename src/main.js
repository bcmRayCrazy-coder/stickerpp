// 运行在 Electron 主进程 下的插件入口
const { ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');

// 默认配置
var defaultConfig = {
    sticker_together: false,
    enable_remote: false,
    sticker_path: '',
};

function setConfig(configPath, content) {
    const newConfig =
        typeof content == 'string'
            ? JSON.stringify(JSON.parse(content), null, 4)
            : JSON.stringify(content, null, 4);
    fs.writeFileSync(configPath, newConfig, 'utf-8');
}

// 加载插件时触发
function onLoad(plugin) {
    const pluginDataPath = plugin.path.data;
    const configPath = path.join(pluginDataPath, 'config.json');
    defaultConfig.sticker_path = path.join(pluginDataPath, 'stickers');

    // 初始化设置文件
    if (!fs.existsSync(pluginDataPath)) {
        fs.mkdirSync(pluginDataPath, { recursive: true });
    }
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));
    }

    // 获取设置
    ipcMain.handle('LiteLoader.stickerpp.getConfig', (event) => {
        try {
            const data = fs.readFileSync(configPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            return {};
        }
    });

    // 保存设置
    ipcMain.handle('LiteLoader.stickerpp.setConfig', (event, content) => {
        if (!content)
            return console.error('[Sticker++] New config content is', content);
        try {
            setConfig(configPath, content);
        } catch (error) {
            console.error(error);
        }
    });

    // 显示表情目录
    ipcMain.handle('LiteLoader.stickerpp.showStickerDir', (event) => {
        const data = fs.readFileSync(configPath, 'utf-8');
        var config = JSON.parse(data);
        shell.openPath(config.sticker_path);
    });
}

// 创建窗口时触发
function onBrowserWindowCreated(window, plugin) {}

// 这两个函数都是可选的
module.exports = {
    onLoad,
    onBrowserWindowCreated,
};
