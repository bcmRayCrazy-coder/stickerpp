// 运行在 Electron 渲染进程 下的页面脚本
const plugin_path = LiteLoader.plugins.stickerpp.path;
const { config } = await import(
    `llqqnt://local-file/${plugin_path.plugin}/src/renderer/config/config.js`
);
const { initStickerMenu } = await import(
    `llqqnt://local-file/${plugin_path.plugin}/src/renderer/sticker/sticker.js`
);

// 页面加载完成时触发
function onLoad() {
    var getpanelInterval = setInterval(() => {
        var panel = document.querySelector(
            '#app > div.container > div.tab-container > div > div.aio > div.group-panel.need-token-updated > div.group-chat > div.chat-input-area.no-copy > div.expression-panel > div > div'
        );
        if (!panel) return;

        initStickerMenu(panel);
        clearInterval(getpanelInterval);
    }, 500);
}

// 打开设置界面时触发
function onConfigView(view) {
    config(view);
}

// 这两个函数都是可选的
export { onLoad, onConfigView };
