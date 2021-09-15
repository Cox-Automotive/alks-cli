"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromKeystore = void 0;
var tslib_1 = require("tslib");
var getKeytar_1 = require("./getKeytar");
var log_1 = require("./log");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var SERVICE = 'alkscli';
var ALKS_TOKEN = 'alkstoken';
function getTokenFromKeystore() {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar, e_1, auth;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 1:
                    keytar = _c.sent();
                    return [4 /*yield*/, keytar.getPassword(SERVICE, ALKS_TOKEN)];
                case 2: return [2 /*return*/, (_a = (_c.sent())) !== null && _a !== void 0 ? _a : undefined];
                case 3:
                    e_1 = _c.sent();
                    log_1.log(e_1.message);
                    log_1.log('Failed to use keychain. Falling back to plaintext file');
                    auth = node_netrc_1.default(ALKS_TOKEN);
                    return [2 /*return*/, (_b = auth.password) !== null && _b !== void 0 ? _b : undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getTokenFromKeystore = getTokenFromKeystore;
//# sourceMappingURL=getTokenFromKeystore.js.map