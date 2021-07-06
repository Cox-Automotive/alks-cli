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
        var developer, e2_1, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    if (!developer.server || !developer.userid) {
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 10, , 11]);
                    return [4 /*yield*/, userId_1.getUserId()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, server_1.getServer()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 9]);
                    return [4 /*yield*/, password_1.getPassword()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7:
                    e2_1 = _a.sent();
                    return [4 /*yield*/, token_1.getToken()];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_1 = _a.sent();
                    throw new Error('ALKS CLI is not configured. Please run: alks developer configure');
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.ensureConfigured = ensureConfigured;
//# sourceMappingURL=ensureConfigured.js.map