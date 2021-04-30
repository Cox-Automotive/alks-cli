"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksDeveloperInfo = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getDeveloper_1 = require("../getDeveloper");
var getPassword_1 = require("../getPassword");
var getToken_1 = require("../getToken");
var log_1 = require("../log");
var tractActivity_1 = require("../tractActivity");
var cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
var underscore_1 = require("underscore");
function handleAlksDeveloperInfo(program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var table, logger, developer, password, token, ignores_1, mapping_1, tablePassword, tableToken, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    table = new cli_table3_1.default({
                        head: [cli_color_1.default.white.bold('Key'), cli_color_1.default.white.bold('Value')],
                        colWidths: [25, 50],
                    });
                    logger = 'dev-info';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    log_1.log(program, logger, 'getting developer');
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 2:
                    developer = _a.sent();
                    log_1.log(program, logger, 'getting password');
                    return [4 /*yield*/, getPassword_1.getPassword(null)];
                case 3:
                    password = _a.sent();
                    log_1.log(program, logger, 'getting 2fa token');
                    return [4 /*yield*/, getToken_1.getToken()];
                case 4:
                    token = _a.sent();
                    ignores_1 = ['lastVersion'];
                    mapping_1 = {
                        server: 'ALKS Server',
                        userid: 'Network Login',
                        alksAccount: 'Default ALKS Account',
                        alksRole: 'Default ALKS Role',
                        outputFormat: 'Default Output Format',
                    };
                    underscore_1.each(developer, function (val, key) {
                        if (!underscore_1.contains(ignores_1, key)) {
                            table.push([mapping_1[key], underscore_1.isEmpty(val) ? '' : val]);
                        }
                    });
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
                    log_1.log(program, logger, 'checking for update');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tractActivity_1.trackActivity(logger)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    errorAndExit_1.errorAndExit(err_1.message, err_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksDeveloperInfo = handleAlksDeveloperInfo;
//# sourceMappingURL=alks-developer-info.js.map