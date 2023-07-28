"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamUpdateIamUser = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const underscore_1 = require("underscore");
const badAccountMessage_1 = require("../badAccountMessage");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const getAwsAccountFromString_1 = require("../getAwsAccountFromString");
const log_1 = require("../log");
const unpackTags_1 = require("../unpackTags");
function handleAlksIamUpdateIamUser(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const nameDesc = 'alphanumeric including @+=._-';
        const NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
        const iamUsername = options.iamusername;
        const alksAccount = options.account;
        const output = options.output || 'text';
        const tags = options.tags ? (0, unpackTags_1.unpackTags)(options.tags) : undefined;
        console.log(`tags: ${tags === null || tags === void 0 ? void 0 : tags.length}`);
        if ((0, underscore_1.isUndefined)(tags)) {
            console.log(`error`);
            (0, errorAndExit_1.errorAndExit)('Tags must be provided in update request.  Provide empty list to remove all non-protected tags');
        }
        (0, log_1.log)('validating iam user name: ' + iamUsername);
        if ((0, underscore_1.isEmpty)(iamUsername)) {
            console.log(`empty username`);
            (0, errorAndExit_1.errorAndExit)('Please provide a username (-n)');
        }
        else if (!NAME_REGEX.test(iamUsername)) {
            console.log(`bad username`);
            (0, errorAndExit_1.errorAndExit)('The username provided contains illegal characters. It must be ' +
                nameDesc);
        }
        try {
            if ((0, underscore_1.isUndefined)(alksAccount)) {
                console.log(`undefined alks account`);
                (0, errorAndExit_1.errorAndExit)('Must specifify ALKS Account Id');
            }
            const auth = yield (0, getAuth_1.getAuth)();
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            console.log(`about to fetch aws account`);
            const awsAccount = yield (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount);
            if (!awsAccount) {
                console.log(`no aws account found`);
                throw new Error(badAccountMessage_1.badAccountMessage);
            }
            (0, log_1.log)('calling api to update iamUser: ' + iamUsername);
            let iamUser;
            try {
                iamUser = yield alks.updateIamUser({
                    account: awsAccount.id,
                    iamUserName: iamUsername,
                    tags,
                });
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)(err);
            }
            if (output === 'json') {
                const iamUserData = {
                    accessKey: iamUser.accessKey,
                    iamUserName: iamUser.userName,
                    iamUserArn: iamUser.arn,
                    accountId: iamUser.accountId,
                    tags: iamUser.tags,
                };
                console.log(JSON.stringify(iamUserData, null, 4));
            }
            else {
                const iamUserData = {
                    accessKey: iamUser.accessKey,
                    iamUserName: iamUser.userName,
                    iamUserArn: iamUser.arn,
                    accountId: iamUser.accountId,
                    tags: iamUser.tags,
                };
                console.log(cli_color_1.default.white(`Iam User with username "${iamUsername}" was updated with tags: `) + cli_color_1.default.white.underline(iamUserData.tags));
            }
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksIamUpdateIamUser = handleAlksIamUpdateIamUser;
//# sourceMappingURL=alks-iam-updateiamuser.js.map