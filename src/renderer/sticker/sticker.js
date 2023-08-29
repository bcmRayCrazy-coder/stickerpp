const plugin_path = LiteLoader.plugins.stickerpp.path;
const { addMenu } = await import(
    `llqqnt://local-file/${plugin_path.plugin}/src/renderer/sticker/addMenu.js`
);

/**
 * 初始化表情面板
 * @param {Element} pannel 表情面板
 */
export async function initStickerMenu(pannel) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `llqqnt://local-file/${LiteLoader.plugins.stickerpp.path.plugin}/src/sticker.css`;
    document.head.appendChild(style);

    const localStickersPath = `llqqnt://local-file/${
        (await stickerpp.getConfig()).sticker_path
    }`;

    const fillColor = getComputedStyle(
        pannel.querySelector('div.tabs.sticker-panel__bar > div > div')
    ).color;
    addMenu(
        pannel,
        '本地表情',
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${fillColor}' height='20'><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8 0-1.168.258-2.275.709-3.276.154.09.308.182.456.276.396.25.791.5 1.286.688.494.187 1.088.312 1.879.312.792 0 1.386-.125 1.881-.313s.891-.437 1.287-.687.792-.5 1.287-.688c.494-.187 1.088-.312 1.88-.312s1.386.125 1.88.313c.495.187.891.437 1.287.687s.792.5 1.287.688c.178.067.374.122.581.171.191.682.3 1.398.3 2.141 0 4.411-3.589 8-8 8z"></path><circle cx="8.5" cy="12.5" r="1.5"></circle><circle cx="15.5" cy="12.5" r="1.5"></circle></svg>`,
        '<div></div>',
        'local-stickers'
    );
}
