"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = void 0;
var tslib_1 = require("tslib");
var log_1 = require("../lib/log");
var promptForPassword_1 = require("./promptForPassword");
var password_1 = require("./state/password");
var token_1 = require("./state/token");
var userId_1 = require("./state/userId");
// TODO: refactor all calls to this function to do their own error handling so that we can just return Auth or undefined
function getAuth() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var token, auth, userid, password, _a, auth;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, log_1.log)('checking for refresh token');
                    return [4 /*yield*/, (0, token_1.getToken)()];
                case 1:
                    token = _b.sent();
                    if (!token) return [3 /*break*/, 2];
                    auth = { token: token };
                    return [2 /*return*/, auth];
                case 2:
                    (0, log_1.log)('no refresh token found, falling back to password');
                    return [4 /*yield*/, (0, userId_1.getUserId)()];
                case 3:
                    userid = _b.sent();
                    if (!userid) {
                        throw new Error('No authentication information was found. Please run `alks developer configure`');
                    }
                    return [4 /*yield*/, (0, password_1.getPassword)()];
                case 4:
                    _a = (_b.sent());
                    if (_a) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, promptForPassword_1.promptForPassword)()];
                case 5:
                    _a = (_b.sent());
                    _b.label = 6;
                case 6:
                    password = _a;
                    auth = { userid: userid, password: password };
                    return [2 /*return*/, auth];
            }
        });
    });
}
exports.getAuth = getAuth;
//# sourceMappingURL=getAuth.js.map