"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperLogout2fa = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const log_1 = require("../log");
const removeToken_1 = require("../removeToken");
function handleAlksDeveloperLogout2fa(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, removeToken_1.removeToken)();
            console.error(cli_color_1.default.white('Token removed!'));
        }
        catch (e) {
            (0, log_1.log)(e.message);
            console.error(cli_color_1.default.red.bold('Error removing token!'));
        }
        try {
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksDeveloperLogout2fa = handleAlksDeveloperLogout2fa;
//# sourceMappingURL=alks-developer-logout2fa.js.map