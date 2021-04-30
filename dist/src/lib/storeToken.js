"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeToken = void 0;
var tslib_1 = require("tslib");
var clortho_1 = tslib_1.__importDefault(require("clortho"));
var isPasswordSecurelyStorable_1 = require("./isPasswordSecurelyStorable");
var log_1 = require("./log");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var chmod_1 = tslib_1.__importDefault(require("chmod"));
var getFilePathInHome_1 = require("./getFilePathInHome");
var getOwnerReadWriteOwnerPermission_1 = require("./getOwnerReadWriteOwnerPermission");
var clortho = clortho_1.default.forService('alkscli');
var SERVICETKN = 'alksclitoken';
var ALKS_TOKEN = 'alkstoken';
var logger = 'token';
function storeToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log(null, logger, 'storing token');
                    if (!isPasswordSecurelyStorable_1.isPasswordSecurelyStorable()) return [3 /*break*/, 2];
                    return [4 /*yield*/, clortho.saveToKeychain(ALKS_TOKEN, token)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    node_netrc_1.default.update(SERVICETKN, {
                        password: token,
                    });
                    chmod_1.default(getFilePathInHome_1.getFilePathInHome('.netrc'), getOwnerReadWriteOwnerPermission_1.getOwnerReadWriteOnlyPermission());
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.storeToken = storeToken;
//# sourceMappingURL=storeToken.js.map