"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamUpdateIamUser = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var underscore_1 = require("underscore");
var badAccountMessage_1 = require("../badAccountMessage");
var checkForUpdate_1 = require("../checkForUpdate");
var errorAndExit_1 = require("../errorAndExit");
var getAlks_1 = require("../getAlks");
var getAuth_1 = require("../getAuth");
var getAwsAccountFromString_1 = require("../getAwsAccountFromString");
var log_1 = require("../log");
var unpackTags_1 = require("../unpackTags");
function handleAlksIamUpdateIamUser(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var nameDesc, NAME_REGEX, iamUsername, alksAccount, output, tags, auth, alks, awsAccount, iamUser, err_1, iamUserData, iamUserData, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nameDesc = 'alphanumeric including @+=._-';
                    NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
                    iamUsername = options.iamusername;
                    alksAccount = options.account;
                    output = options.output || 'text';
                    tags = options.tags ? (0, unpackTags_1.unpackTags)(options.tags) : undefined;
                    console.log("tags: ".concat(tags === null || tags === void 0 ? void 0 : tags.length));
                    if ((0, underscore_1.isUndefined)(tags)) {
                        console.log("error");
                        (0, errorAndExit_1.errorAndExit)('Tags must be provided in update request.  Provide empty list to remove all non-protected tags');
                    }
                    (0, log_1.log)('validating iam user name: ' + iamUsername);
                    if ((0, underscore_1.isEmpty)(iamUsername)) {
                        console.log("empty username");
                        (0, errorAndExit_1.errorAndExit)('Please provide a username (-n)');
                    }
                    else if (!NAME_REGEX.test(iamUsername)) {
                        console.log("bad username");
                        (0, errorAndExit_1.errorAndExit)('The username provided contains illegal characters. It must be ' +
                            nameDesc);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    if ((0, underscore_1.isUndefined)(alksAccount)) {
                        console.log("undefined alks account");
                        (0, errorAndExit_1.errorAndExit)('Must specifify ALKS Account Id');
                    }
                    return [4 /*yield*/, (0, getAuth_1.getAuth)()];
                case 2:
                    auth = _a.sent();
                    return [4 /*yield*/, (0, getAlks_1.getAlks)(tslib_1.__assign({}, auth))];
                case 3:
                    alks = _a.sent();
                    console.log("about to fetch aws account");
                    return [4 /*yield*/, (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount)];
                case 4:
                    awsAccount = _a.sent();
                    if (!awsAccount) {
                        console.log("no aws account found");
                        throw new Error(badAccountMessage_1.badAccountMessage);
                    }
                    (0, log_1.log)('calling api to update iamUser: ' + iamUsername);
                    iamUser = void 0;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, alks.updateIamUser({
                            account: awsAccount.id,
                            iamUserName: iamUsername,
                            tags: tags,
                        })];
                case 6:
                    iamUser = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1);
                    return [3 /*break*/, 8];
                case 8:
                    if (output === 'json') {
                        iamUserData = {
                            accessKey: iamUser.accessKey,
                            iamUserName: iamUser.userName,
                            iamUserArn: iamUser.arn,
                            accountId: iamUser.accountId,
                            tags: iamUser.tags,
                        };
                        console.log(JSON.stringify(iamUserData, null, 4));
                    }
                    else {
                        iamUserData = {
                            accessKey: iamUser.accessKey,
                            iamUserName: iamUser.userName,
                            iamUserArn: iamUser.arn,
                            accountId: iamUser.accountId,
                            tags: iamUser.tags,
                        };
                        console.log(cli_color_1.default.white([
                            'Iam User with username: ',
                            iamUsername,
                            ' was updated with tags: ',
                        ].join('')) + cli_color_1.default.white.underline(iamUserData.tags));
                    }
                    return [4 /*yield*/, (0, checkForUpdate_1.checkForUpdate)()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_2 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_2.message, err_2);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksIamUpdateIamUser = handleAlksIamUpdateIamUser;
//# sourceMappingURL=alks-iam-updateiamuser.js.map