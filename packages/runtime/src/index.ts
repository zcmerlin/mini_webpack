export const runtime = `
const __modules = MODULES;

const __cache = {};

function __require(id) {
    if (__cache[id]) {
        return __cache[id].exports;
    }

    const module = {
        exports: {}
    };

    __cache[id] = module;

    __modules[id](module, module.exports);

    return module.exports;
}
`;
