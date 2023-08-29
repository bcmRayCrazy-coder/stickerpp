/**
 * 显示/隐藏界面
 * @param {string} id tab id
 * @param {boolean} show 是否显示
 * @param {Element} pageWrapper page元素
 */
function setPageShow(id, show, pageWrapper) {
    pageWrapper.querySelector('#page-' + id).style.display = show
        ? 'block'
        : 'none';
}

/**
 * 添加菜单
 * @param {Element} pannel 表情面板
 * @param {string} title 标题
 * @param {string} icon 图标
 * @param {Element} page 页面
 * @param {string} id tab id
 */
export function addMenu(pannel, title, icon, page, id) {
    const iconElement = document.createElement('div');
    iconElement.innerHTML = `<i class="q-icon" title="${title}" is-bold="true"style="color:var(--icon_primary); height:24px;">${icon}</i>`;
    iconElement.classList.add(
        'tabs-container-item',
        'stickerpp-container-item'
    );
    iconElement.id = id;

    // Page
    const pageElement = document.createElement('div');
    pageElement.classList.add('stickerpp-container');
    pageElement.innerHTML = `<div class="q-scroll-view scroll-view--show-scrollbar stickerpp-container-list">${page}</div>`;
    pageElement.id = 'page-' + id;

    const pageWrapperElement = pannel.querySelector('.sticker-panel__pages');
    pageWrapperElement.appendChild(pageElement);

    // Tab
    const tabElement = pannel.querySelector(
        'div.tabs.sticker-panel__bar > div'
    );
    tabElement.appendChild(iconElement);

    iconElement.addEventListener('click', () => {
        // 切换到本tab
        pannel
            .querySelectorAll('.tabs-container-item-active')
            .forEach((e) => e.classList.remove('tabs-container-item-active'));
        pannel
            .querySelectorAll('div.sticker-panel__pages > div')
            .forEach((e) => (e.style.display = 'none'));
        setPageShow(id, true, pageWrapperElement);
    });

    document.querySelectorAll('.tabs-container-item').forEach((e) =>
        e.addEventListener('click', () => {
            if (e.id != id) {
                // 切换到其他tab
                iconElement.classList.remove('tabs-container-item-active');
                setPageShow(id, false, pageWrapperElement);
            }
        })
    );

    setPageShow(id, false, pageWrapperElement);
}
