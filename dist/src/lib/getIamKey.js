"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIamKey = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = require("cli-color");
const underscore_1 = require("underscore");
const getAlks_1 = require("./getAlks");
const moment_1 = tslib_1.__importDefault(require("moment"));
const log_1 = require("./log");
const badAccountMessage_1 = require("./badAccountMessage");
const ensureConfigured_1 = require("./ensureConfigured");
const getAuth_1 = require("./getAuth");
const promptForAlksAccountAndRole_1 = require("./promptForAlksAccountAndRole");
const getKeys_1 = require("./getKeys");
const addKey_1 = require("./addKey");
const getAwsAccountFromString_1 = require("./getAwsAccountFromString");
function getIamKey(alksAccount, alksRole, forceNewSession = false, filterFavorites = false, iamOnly = true, sessionDuration = undefined) {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, ensureConfigured_1.ensureConfigured)();
        (0, log_1.log)('getting auth');
        const auth = yield (0, getAuth_1.getAuth)();
        // only lookup alks account if they didnt provide
        if (!alksAccount || !alksRole) {
            (0, log_1.log)('getting accounts');
            ({ alksAccount, alksRole } = yield (0, promptForAlksAccountAndRole_1.promptForAlksAccountAndRole)({
                iamOnly,
                filterFavorites,
            }));
        }
        else {
            (0, log_1.log)('using provided account/role');
        }
        const awsAccount = yield (0, getAwsAccountFromString_1.getAwsAccountFromString)(alksAccount);
        if (!awsAccount) {
            throw new Error(badAccountMessage_1.badAccountMessage);
        }
        (0, log_1.log)('getting existing keys');
        const existingKeys = yield (0, getKeys_1.getKeys)(auth, true);
        (0, log_1.log)('got existing keys');
        if (existingKeys.length && !forceNewSession) {
            (0, log_1.log)(`filtering keys by ${awsAccount.id}(${awsAccount === null || awsAccount === void 0 ? void 0 : awsAccount.alias}) with role ${alksRole}`);
            // filter keys for the selected alks account/role
            const keyCriteria = { alksAccount: awsAccount.id, alksRole };
            // filter, sort by expiration, grab last key to expire
            const selectedKey = (0, underscore_1.last)((0, underscore_1.sortBy)((0, underscore_1.where)(existingKeys, keyCriteria), 'expires'));
            if (selectedKey) {
                (0, log_1.log)('found existing valid key');
                console.error(cli_color_1.white.underline(`Resuming existing session in "${(_a = awsAccount.label) !== null && _a !== void 0 ? _a : awsAccount.alias}" (id=${awsAccount.id} alias=${awsAccount.alias}) for ${alksRole}`));
                return selectedKey;
            }
        }
        // generate a new key/session
        if (forceNewSession) {
            (0, log_1.log)('forcing a new session');
        }
        const alks = yield (0, getAlks_1.getAlks)(Object.assign({}, auth));
        const loginRole = yield alks.getLoginRole({
            accountId: awsAccount.id,
            role: alksRole,
        });
        const duration = Math.min(loginRole.maxKeyDuration, sessionDuration !== null && sessionDuration !== void 0 ? sessionDuration : 12);
        console.error(cli_color_1.white.underline(`Creating new session in "${(_b = awsAccount.label) !== null && _b !== void 0 ? _b : awsAccount.alias}" (id=${awsAccount.id} alias=${awsAccount.alias}) for ${alksRole} expiring in ${duration} hour${duration === 1 ? '' : 's'}`));
        let alksKey;
        try {
            alksKey = yield alks.getIAMKeys({
                account: awsAccount.id,
                role: alksRole,
                sessionTime: duration,
            });
        }
        catch (e) {
            throw new Error(badAccountMessage_1.badAccountMessage);
        }
        const key = {
            accessKey: alksKey.accessKey,
            secretKey: alksKey.secretKey,
            sessionToken: alksKey.sessionToken,
            expires: (0, moment_1.default)().add(duration, 'hours').toDate(),
            alksAccount: awsAccount.id,
            alksRole,
            isIAM: true,
        };
        (0, log_1.log)('storing key: ' + JSON.stringify(key), {
            unsafe: true,
            alt: 'storing key',
        });
        yield (0, addKey_1.addKey)(key.accessKey, key.secretKey, key.sessionToken, awsAccount.id, alksRole, key.expires, auth, true);
        return key;
    });
}
exports.getIamKey = getIamKey;
//# sourceMappingURL=getIamKey.js.map