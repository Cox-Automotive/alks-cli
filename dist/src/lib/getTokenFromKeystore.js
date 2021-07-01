"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromKeystore = void 0;
var tslib_1 = require("tslib");
var clortho_1 = tslib_1.__importDefault(require("@cox-automotive/clortho"));
var isPasswordSecurelyStorable_1 = require("./isPasswordSecurelyStorable");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var underscore_1 = require("underscore");
var clortho = clortho_1.default.forService('alkscli');
var SERVICETKN = 'alksclitoken';
var ALKS_TOKEN = 'alkstoken';
function getTokenFromKeystore() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var data, e_1, auth;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isPasswordSecurelyStorable_1.isPasswordSecurelyStorable()) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, clortho.getFromKeychain(ALKS_TOKEN)];
                case 2:
                    data = _a.sent();
                    if (data) {
                        return [2 /*return*/, data.password];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [3 /*break*/, 6];
                case 5:
                    auth = node_netrc_1.default(SERVICETKN);
                    if (!underscore_1.isEmpty(auth.password)) {
                        return [2 /*return*/, auth.password];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getTokenFromKeystore = getTokenFromKeystore;
//# sourceMappingURL=getTokenFromKeystore.js.map