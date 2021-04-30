"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var cliOptionsCache;
function log(cliOptions, section, msg) {
    if (cliOptions || cliOptionsCache) {
        cliOptionsCache = tslib_1.__assign(tslib_1.__assign({}, cliOptionsCache), cliOptions);
    }
    if (cliOptionsCache === null || cliOptionsCache === void 0 ? void 0 : cliOptionsCache.verbose) {
        console.error(cli_color_1.yellow(['[', section, ']: ', msg].join('')));
    }
}
exports.log = log;
//# sourceMappingURL=log.js.map