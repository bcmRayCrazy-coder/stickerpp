const plugin_path = LiteLoader.plugins.stickerpp.path;
const { addLocalStickerPanel, addRemoteStickerPanel } = await import(
    `llqqnt://local-file/${plugin_path.plugin}/src/renderer/sticker/panel.js`
);

/**
 * 初始化表情面板
 * @param {Element} panel 表情面板
 */
export async function initStickerMenu(panel) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `llqqnt://local-file/${LiteLoader.plugins.stickerpp.path.plugin}/src/sticker.css`;
    document.head.appendChild(style);

    const config = await stickerpp.getConfig();

    addLocalStickerPanel(panel);
    if (config.enable_remote) addRemoteStickerPanel(panel);
}
