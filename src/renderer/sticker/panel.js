const plugin_path = LiteLoader.plugins.stickerpp.path;
const { addMenu } = await import(
    `llqqnt://local-file/${plugin_path.plugin}/src/renderer/sticker/addMenu.js`
);

async function sendSticker(stickerPath) {
    const peer = await LLAPI.getPeer();
    const elements = [
        {
            type: 'image',
            file: stickerPath,
            asface: true,
        },
    ];
    await LLAPI.sendMessage(peer, elements);
}

/**
 * 添加本地表情面板
 * @param {Element} panel 表情面板
 */
export async function addLocalStickerPanel(panel) {
    /**
     * @type {string[]}
     */
    const stickers = await stickerpp.getLocalStickers();

    var pageContent = '';
    stickers.forEach((stickerPath) => {
        pageContent += `
<div class="stickerpp-list-item"><div class="q-tooltips sticker-list-tooltips"><div class="stickerpp-image sticker-list-item-img" tabindex="-1" data-src="${stickerPath}" style="width: 58px; height: 58px;" id="local-sticker-item"><img class="image-content image-content--contain" src="llqqnt://local-file/${stickerPath}" loading="eager"></div><div class="q-tooltips__content q-tooltips__right  q-tooltips__no_content" style=""></div></div></div>`;
    });

    /**
     * @type {HTMLElement} page元素
     */
    const page = addMenu(
        panel,
        '本地表情',
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#7f24db' height='20'><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8 0-1.168.258-2.275.709-3.276.154.09.308.182.456.276.396.25.791.5 1.286.688.494.187 1.088.312 1.879.312.792 0 1.386-.125 1.881-.313s.891-.437 1.287-.687.792-.5 1.287-.688c.494-.187 1.088-.312 1.88-.312s1.386.125 1.88.313c.495.187.891.437 1.287.687s.792.5 1.287.688c.178.067.374.122.581.171.191.682.3 1.398.3 2.141 0 4.411-3.589 8-8 8z"></path><circle cx="8.5" cy="12.5" r="1.5"></circle><circle cx="15.5" cy="12.5" r="1.5"></circle></svg>`,
        pageContent,
        'local-stickers',
    );
    page.querySelectorAll('#local-sticker-item').forEach((btn) => {
        const stickerPath = btn.dataset.src;
        btn.addEventListener('click', () => {
            sendSticker(stickerPath);
        });
    });
}

/**
 * 添加远程表情面板
 * @param {Element} panel 表情面板
 */
export async function addRemoteStickerPanel(panel) {
    /**
     * @type {string[]}
     */
    const stickers = await stickerpp.getRemoteStickers();
    console.log('\n\n', stickers, '\n\n');

    var pageContent = '';
    stickers.forEach((stickerPath) => {
        pageContent += `
<div class="stickerpp-list-item"><div class="q-tooltips sticker-list-tooltips"><div class="stickerpp-image sticker-list-item-img" tabindex="-1" data-src="${stickerPath}" style="width: 58px; height: 58px;" id="remote-sticker-item"><img class="image-content image-content--contain" src="${stickerPath}" loading="eager"></div><div class="q-tooltips__content q-tooltips__right  q-tooltips__no_content" style=""></div></div></div>`;
    });

    /**
     * @type {HTMLElement} page元素
     */
    const page = addMenu(
        panel,
        '远程表情',
        `<svg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 24 24' fill='#7f24db' height='20'><path d="M12 22c5.131 0 9-1.935 9-4.5V7c0-.051-.024-.097-.033-.146.016-.117.033-.234.033-.354C21 3.935 17.131 2 12 2S3 3.935 3 6.5v11c0 2.565 3.869 4.5 9 4.5zm0-18c4.273 0 7 1.48 7 2.5a.683.683 0 0 1-.025.158c-.004.01-.012.018-.015.027-.274.848-2.29 1.98-5.496 2.253l-.05.003C12.965 8.979 12.494 9 12 9 7.727 9 5 7.52 5 6.5S7.727 4 12 4z"></path></svg>`,
        pageContent,
        'remote-stickers',
    );
    page.querySelectorAll('#remote-sticker-item').forEach((btn) => {
        const stickerPath = btn.dataset.src;
        btn.addEventListener('click', async () => {
            const localPath =
                await stickerpp.downloadRemoteSticker(stickerPath);
            console.log(localPath);
            sendSticker(localPath);
        });
    });
}
