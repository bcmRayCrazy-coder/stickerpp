// 运行在 Electron 主进程 下的插件入口
const fs = require('fs');
const path = require('path');

// 默认配置
var defaultConfig = {
    sticker_together: false,
    enable_remote: false,
    send_to_input: false,
    sticker_path: '',
};

// 加载插件时触发
async function onLoad(plugin) {
    const { log } = require('./logger.js');
    const registerHandlers = require('./handler/handler.js');

    log('初始化配置文件');
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

    const tmpPath = path.join(config.sticker_path, '/tmp/');

    // 初始化表情目录
    if (!fs.existsSync(config.sticker_path))
        fs.mkdirSync(config.sticker_path, { recursive: true });
    if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath, { recursive: true });

    registerHandlers(plugin);
}

// 创建窗口时触发
function onBrowserWindowCreated(window, plugin) {}

// 这两个函数都是可选的
module.exports = {
    onLoad,
    onBrowserWindowCreated,
};
