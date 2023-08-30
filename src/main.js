// 运行在 Electron 主进程 下的插件入口
const { ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');

const plugin_path = LiteLoader.plugins.stickerpp.path;
const { getAllRemoteStickers } = await import(
    `llqqnt://local-file/${plugin_path.plugin}/src/remote/remote.js`
);

// 默认配置
var defaultConfig = {
    sticker_together: false,
    enable_remote: false,
    sticker_path: '',
};

const stickerFileRegExp = new RegExp(/.+\.(png|jpe?g|gif)/g);
function isValidStickerFile(value) {
    return stickerFileRegExp.test(value);
}

/**
 * 递归遍历，获取指定文件夹下面的所有文件路径
 * @returns {string[]} 文件
 */
function getAllFiles(filePath) {
    let allFilePaths = [];
    if (fs.existsSync(filePath)) {
        const files = fs.readdirSync(filePath);
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let currentFilePath = filePath + '/' + file;
            let stats = fs.lstatSync(currentFilePath);
            if (stats.isDirectory()) {
                allFilePaths = allFilePaths.concat(
                    getAllFiles(currentFilePath)
                );
            } else {
                allFilePaths.push(currentFilePath);
            }
        }
    } else {
        console.warn(`指定的目录${filePath}不存在！`);
    }

    return allFilePaths;
}

function setConfig(configPath, content) {
    const newConfig =
        typeof content == 'string'
            ? JSON.stringify(JSON.parse(content), null, 4)
            : JSON.stringify(content, null, 4);
    fs.writeFileSync(configPath, newConfig, 'utf-8');
}

// 加载插件时触发
async function onLoad(plugin) {
    const pluginDataPath = plugin.path.data;
    const configPath = path.join(pluginDataPath, 'config.json');
    defaultConfig.sticker_path = path.join(pluginDataPath, 'stickers');

    // 初始化设置文件
    if (!fs.existsSync(pluginDataPath))
        fs.mkdirSync(pluginDataPath, { recursive: true });

    if (!fs.existsSync(configPath))
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));

    /**
     * @type {defaultConfig}
     */
    var config = JSON.parse(fs.readFileSync(configPath, 'utf-8').toString());

    // 初始化表情目录
    if (!fs.existsSync(config.sticker_path))
        fs.mkdirSync(config.sticker_path, { recursive: true });

    // 获取设置
    ipcMain.handle('LiteLoader.stickerpp.getConfig', (event) => {
        try {
            return config;
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
            config =
                typeof content == 'string'
                    ? JSON.stringify(JSON.parse(content), null, 4)
                    : JSON.stringify(content, null, 4);
            setConfig(configPath, content);
        } catch (error) {
            console.error(error);
        }
    });

    // 显示表情目录
    ipcMain.handle('LiteLoader.stickerpp.showStickerDir', (event) => {
        shell.openPath(config.sticker_path);
    });

    // 获取本地表情
    ipcMain.handle('LiteLoader.stickerpp.getLocalStickers', (event) => {
        var paths = getAllFiles(config.sticker_path).filter(isValidStickerFile);
        return paths;
    });

    // 获取远程表情
    ipcMain.handle('LiteLoader.stickerpp.getRemoteStickers', async (event) => {
        const remotePath = path.join(config.sticker_path, 'remote.txt');

        if (!fs.existsSync(remotePath)) return [];

        const stickerUrls = fs.readFileSync(remotePath).toString().split('\n');
        return await getAllRemoteStickers(stickerUrls);
    });
}

// 创建窗口时触发
function onBrowserWindowCreated(window, plugin) {}

// 这两个函数都是可选的
module.exports = {
    onLoad,
    onBrowserWindowCreated,
};
