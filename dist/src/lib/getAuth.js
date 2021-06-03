"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = exports.cacheAuth = void 0;
var tslib_1 = require("tslib");
var log_1 = require("../lib/log");
var getPassword_1 = require("./getPassword");
var getToken_1 = require("./getToken");
var getUserId_1 = require("./getUserId");
// TODO: find a better way to handle this
function cacheAuth(newAuth) {
    auth = newAuth;
}
exports.cacheAuth = cacheAuth;
var auth;
function getAuth(program, prompt) {
    if (prompt === void 0) { prompt = true; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var token, userid, password;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('checking for access token');
                    return [4 /*yield*/, getToken_1.getToken()];
                case 1:
                    token = _a.sent();
                    if (!token) return [3 /*break*/, 2];
                    auth = { token: token };
                    return [2 /*return*/, auth];
                case 2:
                    log_1.log('no access token found, falling back to password');
                    if (auth) {
                        log_1.log('using cached auth object');
                        return [2 /*return*/, auth];
                    }
                    return [4 /*yield*/, getUserId_1.getUserId(program, prompt)];
                case 3:
                    userid = _a.sent();
                    return [4 /*yield*/, getPassword_1.getPassword(program, prompt)];
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