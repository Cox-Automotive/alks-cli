"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = void 0;
var tslib_1 = require("tslib");
var log_1 = require("../lib/log");
var password_1 = require("./state/password");
var token_1 = require("./state/token");
var userId_1 = require("./state/userId");
function getAuth() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var token, auth, userid, password, auth;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('checking for refresh token');
                    return [4 /*yield*/, token_1.getToken().catch(function () { return undefined; })];
                case 1:
                    token = _a.sent();
                    if (!token) return [3 /*break*/, 2];
                    auth = { token: token };
                    return [2 /*return*/, auth];
                case 2:
                    log_1.log('no refresh token found, falling back to password');
                    return [4 /*yield*/, userId_1.getUserId()];
                case 3:
                    userid = _a.sent();
                    return [4 /*yield*/, password_1.getPassword()];
                case 4:
                    password = _a.sent();
                    auth = { userid: userid, password: password };
                    return [2 /*return*/, auth];
            }
        });
    });
}
exports.getAuth = getAuth;
//# sourceMappingURL=getAuth.js.map