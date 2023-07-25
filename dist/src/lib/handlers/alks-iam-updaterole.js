"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamUpdateRole = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var log_1 = require("../log");
var unpackTags_1 = require("../unpackTags");
var extractAccountAndRole_1 = require("../extractAccountAndRole");
function handleAlksIamUpdateRole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var roleName, trustPolicy, tags, _a, awsAccount, role, auth, alks, err_1, err_2;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    roleName = options.rolename;
                    if (!roleName) {
                        (0, errorAndExit_1.errorAndExit)('Must provide a valid role name');
                    }
                    try {
                        trustPolicy = options.trustPolicy
                            ? JSON.parse(options.trustPolicy)
                            : undefined;
                    }
                    catch (_c) {
                        (0, errorAndExit_1.errorAndExit)('Error parsing trust policy. Must be valid JSON string');
                    }
                    tags = options.tags ? (0, unpackTags_1.unpackTags)(options.tags) : undefined;
                    return [4 /*yield*/, (0, extractAccountAndRole_1.extractAccountAndRole)(options)];
                case 1:
                    _a = _b.sent(), awsAccount = _a.awsAccount, role = _a.role;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 10, , 11]);
                    return [4 /*yield*/, (0, getAuth_1.getAuth)()];
                case 3:
                    auth = _b.sent();
                    (0, log_1.log)('calling api to update role: ' + roleName);
                    return [4 /*yield*/, (0, getAlks_1.getAlks)(tslib_1.__assign({}, auth))];
                case 4:
                    alks = _b.sent();
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, alks.updateRole({
                            account: awsAccount.id,
                            role: role,
                            roleName: roleName,
                            trustPolicy: trustPolicy,
                            tags: tags,
                        })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _b.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1);
                    return [3 /*break*/, 8];
                case 8:
                    console.log(cli_color_1.default.white(['The role: ', roleName, ' was updated successfully']));
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _b.sent();
                    (0, errorAndExit_1.errorAndExit)(err_2.message, err_2);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamUpdateRole = handleAlksIamUpdateRole;
//# sourceMappingURL=alks-iam-updaterole.js.map