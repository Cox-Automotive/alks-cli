"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigured = void 0;
var tslib_1 = require("tslib");
var getAuth_1 = require("./getAuth");
var developer_1 = require("./state/developer");
var server_1 = require("./state/server");
function ensureConfigured() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, developer_1.getDeveloper)()];
                case 1:
                    developer = _b.sent();
                    if (!developer.server || !developer.userid) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getAuthButDontThrow()];
                case 2:
                    _a = !(_b.sent());
                    if (_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, server_1.getServer)()];
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
// TODO: make getAuth simply return Auth or undefined so we don't have to do this
function getAuthButDontThrow() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, getAuth_1.getAuth)()];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=ensureConfigured.js.map