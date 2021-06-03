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
var trackActivity_1 = require("../trackActivity");
var getKeys_1 = require("../getKeys");
var underscore_1 = require("underscore");
var log_1 = require("../log");
function handleAlksSessionsList(_options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var auth, nonIamKeys, iamKeys, foundKeys, table_1, groupedKeys, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, ensureConfigured_1.ensureConfigured()];
                case 1:
                    _a.sent();
                    log_1.log('getting auth');
                    return [4 /*yield*/, getAuth_1.getAuth(program)];
                case 2:
                    auth = _a.sent();
                    log_1.log('getting existing sesions');
                    return [4 /*yield*/, getKeys_1.getKeys(auth, false)];
                case 3:
                    nonIamKeys = _a.sent();
                    log_1.log('getting existing iam sesions');
                    return [4 /*yield*/, getKeys_1.getKeys(auth, true)];
                case 4:
                    iamKeys = _a.sent();
                    foundKeys = tslib_1.__spreadArray(tslib_1.__spreadArray([], nonIamKeys), iamKeys);
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
                    groupedKeys = underscore_1.groupBy(foundKeys, 'alksAccount');
                    underscore_1.each(groupedKeys, function (keys, alksAccount) {
                        table_1.push([
                            {
                                colSpan: 4,
                                content: cli_color_1.default.yellow.bold('ALKS Account: ' + alksAccount),
                            },
                        ]);
                        underscore_1.each(keys, function (keydata) {
                            console.log(JSON.stringify(keydata, null, 2));
                            table_1.push([
                                obfuscate_1.obfuscate(keydata.accessKey),
                                obfuscate_1.obfuscate(keydata.secretKey),
                                keydata.isIAM ? 'IAM' : 'Standard',
                                moment_1.default(keydata.expires).calendar(),
                                moment_1.default(keydata.meta.created).fromNow(),
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
                    log_1.log('checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, trackActivity_1.trackActivity()];
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
exports.handleAlksSessionsList = handleAlksSessionsList;
//# sourceMappingURL=alks-sessions-list.js.map