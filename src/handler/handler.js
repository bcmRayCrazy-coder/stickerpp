const { ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { log } = require('../logger.js');
const getAllRemoteStickers = require('../remote/remote.js');
const downloadRemoteStickers = require('../remote/download.js');

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

module.exports = function registerHandlers(plugin) {
    log('初始化handlers');

    const pluginDataPath = plugin.path.data;
    const configPath = path.join(pluginDataPath, 'config.json');
    var config = JSON.parse(fs.readFileSync(configPath, 'utf-8').toString());

    const tmpPath = path.join(config.sticker_path, '/tmp/');

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

    // 获取本地表情
    ipcMain.handle('LiteLoader.stickerpp.getLocalStickers', (event) => {
        var paths = getAllFiles(config.sticker_path).filter(isValidStickerFile);
        return paths;
    });

    // 获取远程表情
    ipcMain.handle('LiteLoader.stickerpp.getRemoteStickers', async (event) => {
        const remotePath = path.join(config.sticker_path, 'remotes.txt');
        if (!fs.existsSync(remotePath)) return [];
        const stickerUrls = fs.readFileSync(remotePath).toString().split('\n');
        console.log(stickerUrls);
        return await getAllRemoteStickers(stickerUrls);
    });

    // 下载远程表情
    ipcMain.handle(
        'LiteLoader.stickerpp.downloadRemoteSticker',
        async (event, stickerPath) => {
            // 16位随机字符串
            const localPath = path.join(
                tmpPath,
                crypto.randomBytes(Math.ceil(32)).toString('hex').slice(0, 16)
            );
            await downloadRemoteStickers(stickerPath, localPath);
            setTimeout(() => {
                // 一分钟后删除缓存
                fs.unlinkSync(localPath);
            }, 60000);
            return localPath;
        }
    );

    // 清除缓存
    ipcMain.handle('LiteLoader.stickerpp.clearCache', async (event) => {
        getAllFiles(tmpPath).forEach(async (filePath) =>
            fs.unlinkSync(filePath)
        );
    });

    // 操作
    ipcMain.handle(
        'LiteLoader.stickerpp.action.openPath',
        async (event, path) => await shell.openPath(path)
    );
    ipcMain.handle(
        'LiteLoader.stickerpp.action.openExternal',
        async (event, url) => await shell.openExternal(url)
    );
    ipcMain.handle('LiteLoader.stickerpp.action.showItem', (event, path) =>
        shell.showItemInFolder(path)
    );
};
