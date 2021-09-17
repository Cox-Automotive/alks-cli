"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigured = void 0;
var tslib_1 = require("tslib");
var developer_1 = require("./state/developer");
var server_1 = require("./state/server");
var userId_1 = require("./state/userId");
function ensureConfigured() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _b.sent();
                    if (!developer.server || !developer.userid) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, userId_1.getUserId()];
                case 2:
                    _a = !(_b.sent());
                    if (_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, server_1.getServer()];
                case 3:
                    _a = !(_b.sent());
                    _b.label = 4;
                case 4:
                    // If developer is not configured, ensure we at least have required variables configured
                    if (_a) {
                        throw new Error('ALKS CLI is not configured. Please run: `alks developer configure` or set the environment variables ALKS_USERID and ALKS_SERVER');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.ensureConfigured = ensureConfigured;
//# sourceMappingURL=ensureConfigured.js.map