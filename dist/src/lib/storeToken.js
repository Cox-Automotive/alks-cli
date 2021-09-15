"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeToken = void 0;
var tslib_1 = require("tslib");
var log_1 = require("./log");
var getKeytar_1 = require("./getKeytar");
var node_netrc_1 = tslib_1.__importDefault(require("node-netrc"));
var chmod_1 = tslib_1.__importDefault(require("chmod"));
var getFilePathInHome_1 = require("./getFilePathInHome");
var getOwnerReadWriteOwnerPermission_1 = require("./getOwnerReadWriteOwnerPermission");
var cli_color_1 = require("cli-color");
var confirm_1 = require("./confirm");
var SERVICE = 'alkscli';
var ALKS_TOKEN = 'alkstoken';
function storeToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar, e_1, confirmation;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('storing token');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 6]);
                    return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 2:
                    keytar = _a.sent();
                    return [4 /*yield*/, keytar.setPassword(SERVICE, ALKS_TOKEN, token)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _a.sent();
                    log_1.log(e_1.message);
                    log_1.log('Failed to use keychain. Falling back to plaintext file');
                    console.error(cli_color_1.red('No keychain could be found for storing the token'));
                    return [4 /*yield*/, confirm_1.confirm('Would you like to store your token in a plaintext file? (Not Recommended)', false)];
                case 5:
                    confirmation = _a.sent();
                    if (!confirmation) {
                        throw new Error('Failed to save token');
                    }
                    node_netrc_1.default.update(ALKS_TOKEN, {
                        password: token,
                    });
                    chmod_1.default(getFilePathInHome_1.getFilePathInHome('.netrc'), getOwnerReadWriteOwnerPermission_1.getOwnerReadWriteOnlyPermission());
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.storeToken = storeToken;
//# sourceMappingURL=storeToken.js.map