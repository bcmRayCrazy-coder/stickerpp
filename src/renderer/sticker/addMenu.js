/**
 * 显示/隐藏界面
 * @param {string} id tab id
 * @param {boolean} show 是否显示
 * @param {Element} pageWrapper page元素
 */
function setPageShow(id, show, pageWrapper) {
    pageWrapper.querySelector('#page-' + id).style.display = show
        ? ''
        : 'none';
}

/**
 * 添加菜单
 * @param {Element} panel 表情面板
 * @param {string} title 标题
 * @param {string} icon 图标
 * @param {Element} page 页面
 * @param {string} id tab id
 * @returns {HTMLElement} page 元素
 */
var nowTabId = -1;    // 记录当前 tab id，-1 表示 QQ 原有 tab
export function addMenu(panel, title, icon, page, id) {
    const iconElement = document.createElement('div');
    iconElement.innerHTML = `<i class="q-icon" title="${title}" is-bold="true"style="color:var(--icon_primary); height:24px;">${icon}</i>`;
    iconElement.classList.add('stickerpp-container-item');
    iconElement.id = id;

    // Page
    const pageElement = document.createElement('div');
    pageElement.classList.add('stickerpp-container');
    pageElement.style.display = 'none';
    pageElement.innerHTML = `<div class="q-scroll-view scroll-view--show-scrollbar stickerpp-container-list">${page}</div>`;
    pageElement.id = 'page-' + id;

    const pageWrapperElement = panel.querySelector('.sticker-panel__pages');
    pageWrapperElement.appendChild(pageElement);

    // Tab
    const tabElement = panel.querySelector('div.tabs.sticker-panel__bar > div');
    tabElement.appendChild(iconElement);

    // 切换到本 tab
    iconElement.addEventListener('click', () => {
        // 切换出其他 tab
        panel
            .querySelectorAll('.tabs-container-item-active')
            .forEach((e) => {
                e.classList.remove('tabs-container-item-active');
                const icon = e.querySelector('i');
                icon.style.cssText = icon.style.cssText.replace('var(--on_brand_secondary)', 'var(--icon_primary)');
            });
        panel
            .querySelectorAll('.stickerpp-container-item-active')
            .forEach((e) => {
                e.classList.remove('stickerpp-container-item-active');
            });
        panel
            .querySelectorAll('div.sticker-panel__pages > div')
            .forEach((e) => (e.style.display = 'none'));
        // 切换到本 tab
        iconElement.classList.add('stickerpp-container-item-active');
        setPageShow(id, true, pageWrapperElement);
        // 更新 tab id
        nowTabId = id;
    });

    // 切换到其他 tab（QQ 原有 tab）
    document.querySelectorAll('.tabs-container-item').forEach((e, eid) =>
        e.addEventListener('click', () => {
            if (iconElement.classList.contains('stickerpp-container-item-active')) {
                // 切换出本 tab
                iconElement.classList.remove('stickerpp-container-item-active');
                setPageShow(id, false, pageWrapperElement);
                // 切换到其他 tab
                e.classList.add('tabs-container-item-active');
                const icon = e.querySelector('i');
                icon.style.cssText = icon.style.cssText.replace('var(--icon_primary)', 'var(--on_brand_secondary)');
                pageWrapperElement.children[eid].style.display = '';
                // 更新 tab id
                nowTabId = -1;
            }
        }),
    );

    setPageShow(id, false, pageWrapperElement);

    // 修复打开插件添加的tab后关闭表情, 再打开无法使用的问题
    setInterval(() => {
        var shortcutsElement = document.querySelector(
            '#app > div.container   div.group-panel > div.group-chat > div.chat-input-area > div.chat-func-bar.shortcuts > div:nth-child(1) > div:nth-child(1) > div',
        );
        if (!shortcutsElement) return;
        shortcutsElement.addEventListener('click', () => {
            if (nowTabId == id) {
                pageWrapperElement.style.visibility = 'hidden';
                setTimeout(() => {
                    panel
                        .querySelectorAll('div.sticker-panel__pages > div')
                        .forEach((e) => (e.style.display = 'none'));
                    setPageShow(id, true, pageWrapperElement);
                    pageWrapperElement.style.visibility = '';
                }, 50);
            } else {
                setPageShow(id, false, pageWrapperElement);
            }
        });
    }, 500);

    return pageElement;
}
