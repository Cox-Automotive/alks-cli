"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePassword = void 0;
var tslib_1 = require("tslib");
var isPasswordSecurelyStorable_1 = require("./isPasswordSecurelyStorable");
var log_1 = require("./log");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var chmod_1 = tslib_1.__importDefault(require("chmod"));
var getFilePathInHome_1 = require("./getFilePathInHome");
var getOwnerReadWriteOwnerPermission_1 = require("./getOwnerReadWriteOwnerPermission");
var getKeytar_1 = require("./getKeytar");
var SERVICE = 'alkscli';
var ALKS_USERID = 'alksuid';
function storePassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('storing password');
                    if (!isPasswordSecurelyStorable_1.isPasswordSecurelyStorable()) return [3 /*break*/, 3];
                    return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 1:
                    keytar = _a.sent();
                    return [4 /*yield*/, keytar.setPassword(SERVICE, ALKS_USERID, password)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    node_netrc_1.default.update(SERVICE, {
                        login: ALKS_USERID,
                        password: password,
                    });
                    chmod_1.default(getFilePathInHome_1.getFilePathInHome('.netrc'), getOwnerReadWriteOwnerPermission_1.getOwnerReadWriteOnlyPermission());
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.storePassword = storePassword;
//# sourceMappingURL=storePassword.js.map