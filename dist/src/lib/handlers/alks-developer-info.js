"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperInfo = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var log_1 = require("../log");
var cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
var underscore_1 = require("underscore");
var password_1 = require("../state/password");
var token_1 = require("../state/token");
var developer_1 = require("../state/developer");
function handleAlksDeveloperInfo(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var table, developer, password, token, mapping, _i, _a, _b, key, label, value, tablePassword, tableToken, err_1;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    table = new cli_table3_1.default({
                        head: [cli_color_1.default.white.bold('Key'), cli_color_1.default.white.bold('Value')],
                        colWidths: [25, 50],
                    });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    log_1.log('getting developer');
                    return [4 /*yield*/, developer_1.getDeveloper()];
                case 2:
                    developer = _c.sent();
                    log_1.log('getting password');
                    return [4 /*yield*/, password_1.getPassword()];
                case 3:
                    password = _c.sent();
                    log_1.log('getting 2fa token');
                    return [4 /*yield*/, token_1.getToken()];
                case 4:
                    token = _c.sent();
                    mapping = {
                        server: 'ALKS Server',
                        userid: 'Network Login',
                        alksAccount: 'Default ALKS Account',
                        alksRole: 'Default ALKS Role',
                        outputFormat: 'Default Output Format',
                    };
                    for (_i = 0, _a = Object.entries(mapping); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], label = _b[1];
                        value = developer[key];
                        table.push([label, underscore_1.isEmpty(value) ? '' : value]);
                    }
                    tablePassword = !underscore_1.isEmpty(password)
                        ? '**********'
                        : cli_color_1.default.red('NOT SET');
                    table.push(['Password', tablePassword]);
                    tableToken = !underscore_1.isEmpty(token)
                        ? token.substring(0, 4) + '**********'
                        : cli_color_1.default.red('NOT SET');
                    table.push(['2FA Token', tableToken]);
                    console.error(cli_color_1.default.white.underline.bold('\nDeveloper Configuration'));
                    console.log(cli_color_1.default.white(table.toString()));
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _c.sent();
                    errorAndExit_1.errorAndExit(err_1.message, err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperInfo = handleAlksDeveloperInfo;
//# sourceMappingURL=alks-developer-info.js.map