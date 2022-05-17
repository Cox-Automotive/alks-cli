"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamRoleTypes = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var log_1 = require("../log");
function handleAlksIamRoleTypes(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var outputVals, output, auth, alks, roleTypes, err_1, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    outputVals = ['list', 'json'];
                    output = options.output;
                    if (!(0, underscore_1.contains)(outputVals, output)) {
                        (0, errorAndExit_1.errorAndExit)('The output provided (' +
                            output +
                            ') is not in the allowed values: ' +
                            outputVals.join(', '));
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    (0, log_1.log)('getting auth');
                    return [4 /*yield*/, (0, getAuth_1.getAuth)()];
                case 2:
                    auth = _a.sent();
                    return [4 /*yield*/, (0, getAlks_1.getAlks)(tslib_1.__assign({}, auth))];
                case 3:
                    alks = _a.sent();
                    (0, log_1.log)('getting list of role types from REST API');
                    roleTypes = void 0;
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, alks.getAllAWSRoleTypes({})];
                case 5:
                    roleTypes = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1);
                    return [3 /*break*/, 7];
                case 7:
                    (0, log_1.log)('outputting list of ' +
                        (roleTypes ? roleTypes.length : -1) +
                        ' role types');
                    console.error(cli_color_1.default.white.underline.bold('\nAvailable IAM Role Types'));
                    if (output === 'list') {
                        (0, underscore_1.each)(roleTypes, function (roleType, i) {
                            console.log(cli_color_1.default.white([i < 9 ? ' ' : '', i + 1, ') ', roleType.roleTypeName].join('')));
                        });
                    }
                    else {
                        console.log(JSON.stringify(roleTypes.map(function (roleType) { return roleType.roleTypeName; })));
                    }
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_2.message, err_2);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamRoleTypes = handleAlksIamRoleTypes;
//# sourceMappingURL=alks-iam-roletypes.js.map