"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeytar = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var isOsx_1 = require("./isOsx");
var isWindows_1 = require("./isWindows");
var log_1 = require("./log");
function getKeytar() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('keytar')); })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    log_1.log('failed to import keytar');
                    if (!isOsx_1.isOsx() && !isWindows_1.isWindows()) {
                        // see https://github.com/atom/node-keytar#on-linux
                        console.error(cli_color_1.red("Please ensure that either libsecret-1-dev, libsecret-devel, or libsecret is installed, then reinstall this tool with 'npm install -g --unsafe-perm=true alks'"));
                    }
                    else {
                        console.error(cli_color_1.red("Please reinstall this cli with 'npm install -g --unsafe-perm=true alks'"));
                    }
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getKeytar = getKeytar;
//# sourceMappingURL=getKeytar.js.map