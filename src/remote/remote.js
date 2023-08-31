/**
 * 获取一个远程下的所有表情
 * @param {string} url 链接
 * @returns {Promise<string[]>}
 */
async function getRemoteSticker(url) {
    const fetch = (await import('node-fetch')).default;
    var stickers = [];
    try {
        const fetchData = await fetch(url, { method: 'head' });

        if (!fetchData.ok)
            throw new Error(
                '无法获取 ' + url + ' 的表情 - 状态码不在 200~299 之间'
            );

        const type = fetchData.headers.get('Content-Type').split('/')[0];

        switch (type) {
            case 'image':
                stickers.push(fetchData.url);
                break;

            case 'text':
                const stickerUrls = (await fetchData.text()).split('\n');
                for (let i = 0; i < stickerUrls.length; i++) {
                    const stickerUrl = stickerUrls[i];
                    stickers.push(...(await getRemoteSticker(stickerUrl)));
                }
                break;

            default:
                console.error('错误的表情type', type);
                break;
        }
    } catch (err) {
        console.error(err);
    }
    return stickers;
}

/**
 * 获取所有远程表情
 * @param {string[]} url 链接
 */
module.exports = async function getAllRemoteStickers(url) {
    var stickers = [];
    for (let i = 0; i < url.length; i++) {
        const stickerUrl = url[i];
        stickers.push(...(await getRemoteSticker(stickerUrl)));
    }
    return stickers;
};
