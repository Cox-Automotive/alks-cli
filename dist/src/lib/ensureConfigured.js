"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigured = exports.versionAtStart = void 0;
var tslib_1 = require("tslib");
var developer_1 = require("./state/developer");
function ensureConfigured() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    if (!exports.versionAtStart)
                        exports.versionAtStart = developer.lastVersion;
                    // validate we have a valid configuration
                    // Note that we're explicitly checking the developer object instead of calling getServer and getUserId to ensure the developer object is configured
                    if (!developer.server || !developer.userid) {
                        throw new Error('ALKS CLI is not configured. Please run: alks developer configure');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.ensureConfigured = ensureConfigured;
//# sourceMappingURL=ensureConfigured.js.map