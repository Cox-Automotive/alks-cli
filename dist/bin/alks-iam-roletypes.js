#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = tslib_1.__importDefault(require("underscore"));
var Alks = tslib_1.__importStar(require("../lib/alks"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var Developer = tslib_1.__importStar(require("../lib/developer"));
var utils = tslib_1.__importStar(require("../lib/utils"));
var checkForUpdate_1 = require("../lib/checkForUpdate");
var logger = 'iam-roletypes';
var outputVals = ['list', 'json'];
commander_1.default
    .version(package_json_1.default.version)
    .description('list the available iam role types')
    .option('-o, --output [format]', 'output format (' + outputVals.join(', ') + '), default: ' + outputVals[0], outputVals[0])
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var output = commander_1.default.output;
if (!underscore_1.default.contains(outputVals, output)) {
    utils.errorAndExit('The output provided (' +
        output +
        ') is not in the allowed values: ' +
        outputVals.join(', '));
}
(function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, auth, alks, roleTypes, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils.log(commander_1.default, logger, 'getting developer');
                    return [4 /*yield*/, Developer.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    utils.log(commander_1.default, logger, 'getting auth');
                    return [4 /*yield*/, Developer.getAuth(commander_1.default)];
                case 2:
                    auth = _a.sent();
                    return [4 /*yield*/, Alks.getAlks({
                            baseUrl: developer.server,
                            userid: developer.userid,
                            password: auth.password,
                            token: auth.token,
                        })];
                case 3:
                    alks = _a.sent();
                    utils.log(commander_1.default, logger, 'getting list of role types from REST API');
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, alks.getAllAWSRoleTypes({})];
                case 5:
                    roleTypes = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    return [2 /*return*/, utils.errorAndExit(err_1)];
                case 7:
                    utils.log(commander_1.default, logger, 'outputting list of ' + (roleTypes ? roleTypes.length : -1) + ' role types');
                    console.error(cli_color_1.default.white.underline.bold('\nAvailable IAM Role Types'));
                    if (output === 'list') {
                        underscore_1.default.each(roleTypes, function (roleType, i) {
                            console.log(cli_color_1.default.white([i < 9 ? ' ' : '', i + 1, ') ', roleType.roleTypeName].join('')));
                        });
                    }
                    else {
                        console.log(JSON.stringify(roleTypes.map(function (roleType) { return roleType.roleTypeName; })));
                    }
                    utils.log(commander_1.default, logger, 'checking for updates');
                    return [4 /*yield*/, checkForUpdate_1.checkForUpdate()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, Developer.trackActivity(logger)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})().catch(function (err) { return utils.errorAndExit(err.message, err); });
//# sourceMappingURL=alks-iam-roletypes.js.map