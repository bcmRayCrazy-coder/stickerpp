const plugin_path = LiteLoader.plugins.stickerpp.path;
await import(`llqqnt://local-file/${plugin_path.plugin}/src/logger.js`);
const { log } = globalThis.logger;

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

    const idDarkMode = document.body.getAttribute('q-theme') != 'light';
    view.querySelectorAll('#svg-fill').forEach((e) => {
        e.setAttribute('fill', idDarkMode ? '#ffffff' : '#000000');
    });

    log('Added config view');
}

/**
 * 添加配置图标
 */
function addConfigIcon() {
    document.querySelectorAll('.nav-item.liteloader').forEach((node) => {
        if (node.textContent === 'Sticker++') {
            const icon_node = node.querySelector('.q-icon.icon');
            if (icon_node.firstElementChild) {
                return;
            }

            const isDark = document.body.getAttribute('q-theme') == 'dark';

            const fillColor = isDark ? '#ffffff' : '#000000';
            const borderColor = isDark ? '#ffc600' : '#cca000';

            icon_node.insertAdjacentHTML(
                'afterbegin',
                `<?xml version="1.0" encoding="UTF-8"?> <!--Generator: Apple Native CoreSVG 175.5--> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19.9219" height="19.9316"> <g> <rect height="19.9316" opacity="0" width="19.9219" x="0" y="0"/> <path d="M1.66992 9.96094C1.66992 9.07227 1.80664 8.21289 2.06055 7.42188L0.527344 6.77734C0.195312 7.7832 0 8.84766 0 9.96094C0 11.0645 0.195312 12.1387 0.537109 13.1445L2.06055 12.5C1.80664 11.709 1.66992 10.8496 1.66992 9.96094ZM6.16211 2.55859L5.53711 1.05469C3.60352 2.02148 2.01172 3.61328 1.04492 5.54688L2.56836 6.18164C3.34961 4.62891 4.61914 3.35938 6.16211 2.55859ZM9.95117 1.66016C10.8398 1.66016 11.6992 1.79688 12.5098 2.06055L13.1348 0.537109C12.1289 0.195312 11.0547 0 9.95117 0C8.84766 0 7.76367 0.195312 6.75781 0.537109L7.40234 2.06055C8.20312 1.79688 9.0625 1.66016 9.95117 1.66016ZM17.3535 6.17188L18.8672 5.54688C17.8906 3.61328 16.2988 2.02148 14.3652 1.04492L13.7402 2.55859C15.2832 3.34961 16.5625 4.61914 17.3535 6.17188ZM18.2617 9.96094C18.2617 10.8496 18.125 11.709 17.8711 12.5098L19.3848 13.1543C19.7266 12.1484 19.9219 11.0645 19.9219 9.96094C19.9219 8.84766 19.7266 7.77344 19.3848 6.76758L17.8613 7.41211C18.125 8.21289 18.2617 9.07227 18.2617 9.96094ZM13.7402 17.3535L14.3652 18.877C16.3086 17.9004 17.9004 16.3086 18.8574 14.375L17.3633 13.75C16.5723 15.3027 15.293 16.5625 13.7402 17.3535ZM9.96094 18.2617C9.0625 18.2617 8.20312 18.125 7.40234 17.8613L6.76758 19.3848C7.77344 19.7266 8.85742 19.9219 9.96094 19.9219C11.0645 19.9219 12.1387 19.7266 13.1348 19.3945L12.5 17.8711C11.6992 18.125 10.8496 18.2617 9.96094 18.2617ZM2.56836 13.75L1.05469 14.375C2.03125 16.3086 3.60352 17.9004 5.53711 18.8672L6.16211 17.3438C4.61914 16.5527 3.34961 15.293 2.56836 13.75Z" fill="${borderColor}"/> <path d="M9.94141 16.7773C13.7402 16.7773 16.7676 13.75 16.7578 9.96094C16.748 6.17188 13.7207 3.14453 9.93164 3.14453C6.14258 3.14453 3.13477 6.16211 3.13477 9.96094C3.13477 13.7598 6.15234 16.7773 9.94141 16.7773ZM9.95117 14.0039C8.20312 14.0039 7.03125 12.832 7.03125 12.2754C7.03125 12.0801 7.22656 12.002 7.39258 12.0801C7.99805 12.4121 8.73047 12.793 9.95117 12.793C11.1816 12.793 11.9043 12.4121 12.5195 12.0801C12.6855 12.002 12.8711 12.0801 12.8711 12.2754C12.8711 12.832 11.709 14.0039 9.95117 14.0039ZM7.4707 9.04297C6.94336 9.04297 6.48438 8.57422 6.48438 7.91016C6.48438 7.22656 6.94336 6.75781 7.4707 6.75781C7.99805 6.75781 8.45703 7.22656 8.45703 7.91016C8.45703 8.57422 7.98828 9.04297 7.4707 9.04297ZM12.4512 9.04297C11.9238 9.04297 11.4648 8.57422 11.4648 7.91016C11.4648 7.22656 11.9238 6.75781 12.4512 6.75781C12.9785 6.75781 13.4375 7.22656 13.4375 7.91016C13.4375 8.57422 12.9688 9.04297 12.4512 9.04297Z" fill="${fillColor}"/> </g> </svg>`
            );
        }
    });
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
    const showStickerDir = debounce(
        () => stickerpp.openPath(config.sticker_path),
        500
    );
    // 访问GitHub
    const visitGitHub = debounce(
        () =>
            stickerpp.openExternal(
                'https://github.com/bcmRayCrazy-coder/stickerpp'
            ),
        500
    );
    // 清除缓存
    const clearCache = debounce(() => stickerpp.clearCache(), 500);

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

    /**
     * 监听按钮点击
     * @param {string} id 按钮id
     * @param {()=>void} fn 触发函数
     */
    function listenButton(id, fn) {
        view.querySelector('#' + id).addEventListener('click', () => fn());
    }

    listenSwitch('sticker_together');
    listenSwitch('enable_remote');

    listenChange(
        'sticker_path',
        (e) => e.value,
        (e, defaultValue) => (e.value = defaultValue)
    );

    listenButton('clear_cache', clearCache);
    listenButton('show_sticker_dir', showStickerDir);
    listenButton('visit_github', visitGitHub);

    log('Listening to config view');
}

/**
 * 初始化配置界面
 * @param {Element} view 配置界面元素
 */
export async function config(view) {
    log('设置Config页面');
    await addConfigContent(view);
    await listenConfigContent(view);
    addConfigIcon();
}
