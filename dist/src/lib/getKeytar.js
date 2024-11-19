"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeytar = void 0;
const tslib_1 = require("tslib");
const isOsx_1 = require("./isOsx");
const isWindows_1 = require("./isWindows");
const log_1 = require("./log");
function getKeytar() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield Promise.resolve().then(() => tslib_1.__importStar(require('keytar')));
        }
        catch (err) {
            (0, log_1.log)(`failed to import keytar: ${err}`);
            if (!(0, isOsx_1.isOsx)() && !(0, isWindows_1.isWindows)()) {
                // see https://github.com/atom/node-keytar#on-linux
                throw new Error(`Please ensure that either libsecret-1-dev, libsecret-devel, or libsecret is installed, then reinstall this tool with 'npm install -g --unsafe-perm=true alks'`);
            }
            else {
                throw new Error(`Please reinstall this cli with 'npm install -g --unsafe-perm=true alks'`);
            }
        }
    });
}
exports.getKeytar = getKeytar;
//# sourceMappingURL=getKeytar.js.map