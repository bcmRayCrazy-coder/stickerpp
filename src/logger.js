(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.logger = factory();
    }
})(globalThis, () => {
    return {
        log(...args) {
            console.log('\u001B[34m[Sticker++]\u001B[39m', args.join(' '));
        },
    };
});
