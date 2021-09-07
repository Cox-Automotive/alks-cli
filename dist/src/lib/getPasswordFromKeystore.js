"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordFromKeystore = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var isPasswordSecurelyStorable_1 = require("./isPasswordSecurelyStorable");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var getKeytar_1 = require("./getKeytar");
var SERVICE = 'alkscli';
var ALKS_USERID = 'alksuid';
function getPasswordFromKeystore() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar, auth;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isPasswordSecurelyStorable_1.isPasswordSecurelyStorable()) return [3 /*break*/, 3];
                    return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 1:
                    keytar = _a.sent();
                    return [4 /*yield*/, keytar.getPassword(SERVICE, ALKS_USERID).catch(function () { return 'nopasswordfound'; })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    auth = node_netrc_1.default(SERVICE);
                    if (!underscore_1.isEmpty(auth.password)) {
                        return [2 /*return*/, auth.password];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getPasswordFromKeystore = getPasswordFromKeystore;
//# sourceMappingURL=getPasswordFromKeystore.js.map