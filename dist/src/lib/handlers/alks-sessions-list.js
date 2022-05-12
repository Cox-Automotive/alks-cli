"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsList = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
var moment_1 = tslib_1.__importDefault(require("moment"));
var checkForUpdate_1 = require("../checkForUpdate");
var ensureConfigured_1 = require("../ensureConfigured");
var errorAndExit_1 = require("../errorAndExit");
var getAuth_1 = require("../getAuth");
var obfuscate_1 = require("../obfuscate");
var getKeys_1 = require("../getKeys");
var underscore_1 = require("underscore");
var log_1 = require("../log");
function handleAlksSessionsList(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var auth, nonIamKeys, iamKeys, foundKeys, table_1, groupedKeys, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, (0, ensureConfigured_1.ensureConfigured)()];
                case 1:
                    _a.sent();
                    (0, log_1.log)('getting auth');
                    return [4 /*yield*/, (0, getAuth_1.getAuth)()];
                case 2:
                    auth = _a.sent();
                    (0, log_1.log)('getting existing sesions');
                    return [4 /*yield*/, (0, getKeys_1.getKeys)(auth, false)];
                case 3:
                    nonIamKeys = _a.sent();
                    (0, log_1.log)('getting existing iam sesions');
                    return [4 /*yield*/, (0, getKeys_1.getKeys)(auth, true)];
                case 4:
                    iamKeys = _a.sent();
                    foundKeys = tslib_1.__spreadArray(tslib_1.__spreadArray([], nonIamKeys, true), iamKeys, true);
                    table_1 = new cli_table3_1.default({
                        head: [
                            cli_color_1.default.white.bold('Access Key'),
                            cli_color_1.default.white.bold('Secret Key'),
                            cli_color_1.default.white.bold('Type'),
                            cli_color_1.default.white.bold('Expires'),
                            cli_color_1.default.white.bold('Created'),
                        ],
                        colWidths: [25, 25, 10, 25, 25],
                    });
                    groupedKeys = (0, underscore_1.groupBy)(foundKeys, 'alksAccount');
                    (0, underscore_1.each)(groupedKeys, function (keys, alksAccount) {
                        table_1.push([
                            {
                                colSpan: 4,
                                content: cli_color_1.default.yellow.bold('ALKS Account: ' + alksAccount),
                            },
                        ]);
                        (0, underscore_1.each)(keys, function (keydata) {
                            table_1.push([
                                (0, obfuscate_1.obfuscate)(keydata.accessKey),
                                (0, obfuscate_1.obfuscate)(keydata.secretKey),
                                keydata.isIAM ? 'IAM' : 'Standard',
                                (0, moment_1.default)(keydata.expires).calendar(),
                                (0, moment_1.default)(keydata.meta.created).fromNow(),
                            ]);
                        });
                    });
                    if (!foundKeys.length) {
                        table_1.push([
                            { colSpan: 5, content: cli_color_1.default.yellow.bold('No active sessions found.') },
                        ]);
                    }
                    console.error(cli_color_1.default.white.underline.bold('Active Sessions'));
                    console.log(cli_color_1.default.white(table_1.toString()));
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1.message, err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksSessionsList = handleAlksSessionsList;
//# sourceMappingURL=alks-sessions-list.js.map