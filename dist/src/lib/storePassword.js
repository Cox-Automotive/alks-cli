"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePassword = void 0;
var tslib_1 = require("tslib");
var log_1 = require("./log");
var getKeytar_1 = require("./getKeytar");
var confirm_1 = require("./confirm");
var cli_color_1 = require("cli-color");
var credentials_1 = require("./state/credentials");
var SERVICE = 'alkscli';
var ALKS_PASSWORD = 'alkspassword';
function storePassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keytar, e_1, confirmation, credentials;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('storing password');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 8]);
                    return [4 /*yield*/, getKeytar_1.getKeytar()];
                case 2:
                    keytar = _a.sent();
                    return [4 /*yield*/, keytar.setPassword(SERVICE, ALKS_PASSWORD, password)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 4:
                    e_1 = _a.sent();
                    log_1.log(e_1.message);
                    console.error(cli_color_1.red('No keychain could be found for storing the password'));
                    return [4 /*yield*/, confirm_1.confirm('Would you like to store your password in a plaintext file? (Not Recommended)', false)];
                case 5:
                    confirmation = _a.sent();
                    if (!confirmation) {
                        throw new Error('Failed to save password');
                    }
                    return [4 /*yield*/, credentials_1.getCredentials()];
                case 6:
                    credentials = _a.sent();
                    credentials.password = password;
                    return [4 /*yield*/, credentials_1.setCredentials(credentials)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.storePassword = storePassword;
//# sourceMappingURL=storePassword.js.map