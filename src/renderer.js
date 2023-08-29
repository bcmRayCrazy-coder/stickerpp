// 运行在 Electron 渲染进程 下的页面脚本
function log(...args) {
    console.log('\u001B[34m[Sticker++]\u001B[39m', args.join(' '));
}

// 防抖
function debounce(fn, time) {
    let timer;
    return function (...args) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    };
}

// 添加配置页面
async function addConfigContent(view) {
    const pluginPath = LiteLoader.plugins.stickerpp.path.plugin;
    const htmlPath = `llqqnt://local-file/${pluginPath}/src/config/view.html`;
    const cssPath = `llqqnt://local-file/${pluginPath}/src/config/view.css`;
    // 插入设置页
    const htmlText = await (await fetch(htmlPath)).text();
    view.insertAdjacentHTML('afterbegin', htmlText);
    // 插入设置页样式
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);

    log('Added config view');
}

/** 监听配置页面
 * @param {Element} view 页面
 */
async function listenConfigContent(view) {
    var config = await stickerpp.getConfig();

    // 防抖更新配置
    const updateConfig = debounce((newConfig) => {
        stickerpp.setConfig(JSON.stringify(newConfig));
    }, 500);
    // 显示表情目录
    const showStickerDir = debounce(() => stickerpp.showStickerDir(), 200);

    /**
     * 监听元素
     * @param {Element} element 监听的元素
     * @param {string} key 配置的键
     * @param {(Element)=>any} parseFn 转换函数
     * @param {(Element,any)=>void} initFn 初始化元素
     */
    function listenChange(key, parseFn, initFn) {
        const element = view.querySelector('#' + key);

        initFn(element, config[key]);
        element.addEventListener('change', () => {
            const newValue = parseFn(element);
            config[key] = newValue;
            updateConfig(config);
        });
    }

    /**
     * 监听开关
     * @param {string} key 配置的键
     * @param {boolean} init 初始值
     */
    function listenSwitch(key, init = false) {
        const element = view.querySelector('#' + key);

        function update(value = false) {
            if (!value) element.classList.remove('is-active');
            else if (!element.classList.contains('is-active'))
                element.classList.add('is-active');
        }

        var value = config[key] || init;
        update(value);

        element.addEventListener('click', () => {
            value = !value;
            update(value);
            config[key] = value;
            updateConfig(config);
        });
    }

    listenSwitch('sticker_together');
    listenSwitch('enable_remote');

    listenChange(
        'sticker_path',
        (e) => e.value,
        (e, defaultValue) => (e.value = defaultValue)
    );

    view.querySelector('#show_sticker_dir').addEventListener('click', () =>
        showStickerDir()
    );

    log('Listening to config view');
}

/**
 * 初始化表情面板
 * @param {Element} pannel 表情面板
 */
async function initStickerMenu(pannel) {
    function setPageShow(id, show, pageWrapper) {
        pageWrapper.querySelector('#page-' + id).style.display = show
            ? 'block'
            : 'none';
    }

    /**
     * 添加菜单
     * @param {string} title 标题
     * @param {string} icon 图标
     * @param {Element} page 页面
     */
    function addMenu(title, icon, page, id) {
        // const pageElement = icon.cloneNode(true);
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

        const pageWrapperElement = pannel.querySelector(
            '.sticker-panel__pages'
        );
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
                .forEach((e) =>
                    e.classList.remove('tabs-container-item-active')
                );
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
        '本地表情',
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${fillColor}' height='20'><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8 0-1.168.258-2.275.709-3.276.154.09.308.182.456.276.396.25.791.5 1.286.688.494.187 1.088.312 1.879.312.792 0 1.386-.125 1.881-.313s.891-.437 1.287-.687.792-.5 1.287-.688c.494-.187 1.088-.312 1.88-.312s1.386.125 1.88.313c.495.187.891.437 1.287.687s.792.5 1.287.688c.178.067.374.122.581.171.191.682.3 1.398.3 2.141 0 4.411-3.589 8-8 8z"></path><circle cx="8.5" cy="12.5" r="1.5"></circle><circle cx="15.5" cy="12.5" r="1.5"></circle></svg>`,
        '<div></div>',
        'local-stickers'
    );
}

// 页面加载完成时触发
function onLoad() {
    var getPannelInterval = setInterval(() => {
        var pannel = document.querySelector(
            '#app > div.container > div.tab-container > div > div.aio > div.group-panel.need-token-updated > div.group-chat > div.chat-input-area.no-copy > div.expression-panel > div > div'
        );
        if (!pannel) return;

        initStickerMenu(pannel);
        clearInterval(getPannelInterval);
    }, 500);
}

// 打开设置界面时触发
function onConfigView(view) {
    addConfigContent(view).then(() => {
        listenConfigContent(view);
    });
}

// 这两个函数都是可选的
export { onLoad, onConfigView };
