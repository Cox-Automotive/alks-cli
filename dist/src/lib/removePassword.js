"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePassword = void 0;
var tslib_1 = require("tslib");
var clortho_1 = tslib_1.__importDefault(require("clortho"));
var isPasswordSecurelyStorable_1 = require("./isPasswordSecurelyStorable");
var log_1 = require("./log");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var clortho = clortho_1.default.forService('alkscli');
var SERVICE = 'alkscli';
var ALKS_USERID = 'alksuid';
function removePassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            log_1.log('removing password');
            if (isPasswordSecurelyStorable_1.isPasswordSecurelyStorable()) {
                return [2 /*return*/, clortho.removeFromKeychain(ALKS_USERID)];
            }
            else {
                node_netrc_1.default.update(SERVICE, {});
            }
            return [2 /*return*/];
        });
    });
}
exports.removePassword = removePassword;
//# sourceMappingURL=removePassword.js.map