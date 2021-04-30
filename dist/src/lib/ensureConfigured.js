"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigured = exports.vAtSt = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var getDeveloper_1 = require("./getDeveloper");
function ensureConfigured() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    if (!exports.vAtSt)
                        exports.vAtSt = developer.lastVersion;
                    // validate we have a valid configuration
                    if (underscore_1.isEmpty(developer.server) || underscore_1.isEmpty(developer.userid)) {
                        throw new Error('ALKS CLI is not configured. Please run: alks developer configure');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.ensureConfigured = ensureConfigured;
//# sourceMappingURL=ensureConfigured.js.map