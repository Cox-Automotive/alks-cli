"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIamCreateLtk = void 0;
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
const promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
const tryToExtractRole_1 = require("../tryToExtractRole");
const unpackTags_1 = require("../unpackTags");
function handleAlksIamCreateLtk(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const nameDesc = 'alphanumeric including @+=._-';
        const NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
        const iamUsername = options.iamusername;
        let alksAccount = options.account;
        let alksRole = options.role;
        const filterFaves = options.favorites || false;
        const output = options.output || 'text';
        const tags = options.tags ? (0, unpackTags_1.unpackTags)(options.tags) : undefined;
        try {
            (0, log_1.log)('validating iam user name: ' + iamUsername);
            if ((0, underscore_1.isEmpty)(iamUsername)) {
                (0, errorAndExit_1.errorAndExit)('Please provide a username (-n)');
            }
            else if (!NAME_REGEX.test(iamUsername)) {
                (0, errorAndExit_1.errorAndExit)('The username provided contains illegal characters. It must be ' +
                    nameDesc);
            }
            if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
                (0, log_1.log)('trying to extract role from account');
                alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
            }
            if (!alksAccount || !alksRole) {
                ({ alksAccount, alksRole } = yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                    iamOnly: true,
                    filterFavorites: filterFaves,
                }));
            }
            const auth = yield (0, getAuth_1.getAuth)();
            const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
            const awsAccount = yield (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount);
            if (!awsAccount) {
                throw new Error(badAccountMessage_1.badAccountMessage);
            }
            (0, log_1.log)('calling api to create ltk: ' + iamUsername);
            const ltk = yield alks.createAccessKeys({
                account: awsAccount.id,
                role: alksRole,
                iamUserName: iamUsername,
                tags,
            });
            if (output === 'json') {
                const ltkData = {
                    accessKey: ltk.accessKey,
                    secretKey: ltk.secretKey,
                    iamUserName: iamUsername,
                    iamUserArn: ltk.iamUserArn,
                };
                console.log(JSON.stringify(ltkData, null, 4));
            }
            else {
                const ltkData = {
                    accessKey: ltk.accessKey,
                    secretKey: ltk.secretKey,
                    iamUserName: iamUsername,
                    iamUserArn: ltk.iamUserArn,
                    alksAccount: awsAccount.id,
                    alksRole,
                };
                console.log(cli_color_1.default.white(`LTK created for IAM User "${iamUsername}" was created with the ARN: `) + cli_color_1.default.white.underline(ltkData.iamUserArn));
                console.log(cli_color_1.default.white('LTK Access Key: ') + cli_color_1.default.white.underline(ltkData.accessKey));
                console.log(cli_color_1.default.white('LTK Secret Key: ') + cli_color_1.default.white.underline(ltkData.secretKey));
            }
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksIamCreateLtk = handleAlksIamCreateLtk;
//# sourceMappingURL=alks-iam-createltk.js.map