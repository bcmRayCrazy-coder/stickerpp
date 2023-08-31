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
    const showStickerDir = debounce(
        () => stickerpp.openPath(config.sticker_path),
        200,
    );

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
        (e, defaultValue) => (e.value = defaultValue),
    );

    view.querySelector('#show_sticker_dir').addEventListener('click', () =>
        showStickerDir(),
    );

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
}
