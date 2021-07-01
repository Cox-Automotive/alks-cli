"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLastVersion = exports.getLastVersion = void 0;
var tslib_1 = require("tslib");
var developer_1 = require("./developer");
var package_json_1 = require("../../../package.json");
var log_1 = require("../log");
function getLastVersion() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    if (developer.lastVersion) {
                        log_1.log('using stored last version');
                        return [2 /*return*/, developer.lastVersion];
                    }
                    // Since this function is primarily used by checkForUpdate, just return the current version if this is the first time we're running the CLI so it doesn't show us what's new
                    return [2 /*return*/, package_json_1.version];
            }
        });
    });
}
exports.getLastVersion = getLastVersion;
function setLastVersion(lastVersion) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.updateDeveloper({ lastVersion: lastVersion })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setLastVersion = setLastVersion;
//# sourceMappingURL=lastVersion.js.map