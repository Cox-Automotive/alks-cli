"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksCr = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const errorAndExit_1 = require("../errorAndExit");
const getAlks_1 = require("../getAlks");
const getAuth_1 = require("../getAuth");
const getAwsAccountFromString_1 = require("../getAwsAccountFromString");
const promptForAlksAccountAndRole_1 = require("../promptForAlksAccountAndRole");
function handleAlksCr(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let alksAccount = options.account;
        let alksRole = options.role;
        const crNumber = options.cr;
        const sessionTime = options.sessionTime || 1;
        const filterFaves = options.favorites || false;
        try {
            if (!crNumber) {
                (0, errorAndExit_1.errorAndExit)('Please provide a Change Request number using --cr <crNumber>');
                return;
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
                (0, errorAndExit_1.errorAndExit)('Invalid or unknown AWS account.');
                return;
            }
            // Prepare params for getIAMKeys
            const params = {
                account: awsAccount.id,
                role: alksRole,
                sessionTime,
                changeRequestNumber: crNumber,
            };
            if (options.workloadId) {
                params.workloadId = options.workloadId;
            }
            const result = yield alks.getIAMKeys(params);
            console.log(cli_color_1.default.green('CR operation result:'));
            console.log(result);
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksCr = handleAlksCr;
//# sourceMappingURL=alks-cr.js.map