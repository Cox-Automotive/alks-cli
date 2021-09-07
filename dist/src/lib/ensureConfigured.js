"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigured = void 0;
var tslib_1 = require("tslib");
var developer_1 = require("./state/developer");
var password_1 = require("./state/password");
var server_1 = require("./state/server");
var token_1 = require("./state/token");
var userId_1 = require("./state/userId");
function ensureConfigured() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _d.sent();
                    if (!developer.server || !developer.userid) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, userId_1.getUserId()];
                case 2:
                    _b = !(_d.sent());
                    if (_b) return [3 /*break*/, 4];
                    return [4 /*yield*/, server_1.getServer()];
                case 3:
                    _b = !(_d.sent());
                    _d.label = 4;
                case 4:
                    _a = _b;
                    if (_a) return [3 /*break*/, 8];
                    return [4 /*yield*/, password_1.getPassword()];
                case 5:
                    _c = (_d.sent());
                    if (!_c) return [3 /*break*/, 7];
                    return [4 /*yield*/, token_1.getToken()];
                case 6:
                    _c = (_d.sent());
                    _d.label = 7;
                case 7:
                    _a = !(_c);
                    _d.label = 8;
                case 8:
                    // If developer is not configured, ensure we at least have required variables configured
                    if (_a) {
                        throw new Error('ALKS CLI is not configured. Please run: alks developer configure');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.ensureConfigured = ensureConfigured;
//# sourceMappingURL=ensureConfigured.js.map