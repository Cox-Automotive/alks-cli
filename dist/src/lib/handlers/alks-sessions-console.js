"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsConsole = void 0;
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const underscore_2 = require("underscore");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getIamKey_1 = require("../getIamKey");
const getUserAgentString_1 = require("../getUserAgentString");
const log_1 = require("../log");
const tryToExtractRole_1 = require("../tryToExtractRole");
const open_1 = tslib_1.__importDefault(require("open"));
const alksAccount_1 = require("../state/alksAccount");
const alksRole_1 = require("../state/alksRole");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const AWS_SIGNIN_URL = 'https://signin.aws.amazon.com/federation';
const AWS_CONSOLE_URL = 'https://console.aws.amazon.com/';
const DEFAULT_UA = 'alks-cli';
const SANITIZE_FIELDS = [
    'password',
    'refreshToken',
    'accessToken',
    'accessKey',
    'secretKey',
    'sessionToken',
];
function sanitizeData(data) {
    const cleansed = {};
    underscore_1.default.each(data, function (val, field) {
        cleansed[field] = underscore_1.default.contains(SANITIZE_FIELDS, field) ? '********' : val;
    });
    return cleansed;
}
function handleAlksSessionsConsole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let alksAccount = options.account;
        let alksRole = options.role;
        const forceNewSession = options.newSession;
        const useDefaultAcct = options.default;
        const filterFaves = options.favorites || false;
        // Validation for ChangeAPI options
        const hasCiid = !!options.ciid;
        const hasActivityType = !!options.activityType;
        const hasDescription = !!options.description;
        const hasChgNumber = !!options.chgNumber;
        if (hasChgNumber) {
            // If chg-number is provided, do not require the other three
            if (hasCiid || hasActivityType || hasDescription) {
                (0, errorAndExit_1.errorAndExit)('Do not provide --ciid, --activity-type, or --description when using --chg-number.');
            }
        }
        else if (hasCiid || hasActivityType || hasDescription) {
            // If any of the three is provided, all must be present
            if (!(hasCiid && hasActivityType && hasDescription)) {
                (0, errorAndExit_1.errorAndExit)('If any of --ciid, --activity-type, or --description is provided, all three must be specified.');
            }
        }
        if (!(0, underscore_2.isUndefined)(alksAccount) && (0, underscore_2.isUndefined)(alksRole)) {
            (0, log_1.log)('trying to extract role from account');
            alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
        }
        try {
            if (useDefaultAcct) {
                alksAccount = yield (0, alksAccount_1.getAlksAccount)();
                alksRole = yield (0, alksRole_1.getAlksRole)();
                if (!alksAccount || !alksRole) {
                    (0, errorAndExit_1.errorAndExit)('Unable to load default account!');
                }
            }
            let key;
            try {
                key = yield (0, getIamKey_1.getIamKey)(alksAccount, alksRole, forceNewSession, filterFaves, (0, underscore_2.isUndefined)(options.iam) ? false : true);
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)(err);
            }
            (0, log_1.log)('calling aws to generate 15min console URL');
            const url = yield generateConsoleUrl(key, options);
            if (options.url) {
                console.log(url);
            }
            else {
                const opts = !(0, underscore_2.isEmpty)(options.openWith) ? { app: options.openWith } : {};
                console.error(`Opening ${cli_color_1.default.underline(url)} in the browser...`);
                try {
                    yield Promise.race([
                        (0, open_1.default)(url, Object.assign(Object.assign({}, opts), { newInstance: true })),
                        new Promise((_, rej) => {
                            setTimeout(() => rej(), 5000);
                        }), // timeout after 5 seconds
                    ]);
                }
                catch (err) {
                    console.error(`Failed to open ${url}`);
                    console.error('Please open the url in the browser of your choice');
                }
                yield (0, checkForUpdate_1.checkForUpdate)();
                yield new Promise((resolve) => setTimeout(resolve, 3000)); // needed for if browser is still open
            }
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksSessionsConsole = handleAlksSessionsConsole;
function generateConsoleUrl(key, options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const payload = {
            sessionId: key.accessKey,
            sessionKey: key.secretKey,
            sessionToken: key.sessionToken,
        };
        const optionsLocal = underscore_1.default.extend({
            debug: false,
            ua: (_a = (0, getUserAgentString_1.getUserAgentString)()) !== null && _a !== void 0 ? _a : DEFAULT_UA,
        }, options);
        const urlParms = `?Action=getSigninToken&SessionType=json&Session=${encodeURIComponent(JSON.stringify(payload))}`;
        const endpoint = AWS_SIGNIN_URL + urlParms;
        (0, log_1.log)(`api:generateConsoleUrl, generating console url at endpoint: ${endpoint}, ${optionsLocal}`);
        (0, log_1.log)(`api:generateConsoleUrl, with data: ${JSON.stringify(sanitizeData(payload), null, 4)}, ${optionsLocal}`);
        (0, log_1.log)(`ua, ${optionsLocal.ua}, ${optionsLocal}`);
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(endpoint, {
                    headers: { 'User-Agent': optionsLocal.ua },
                });
                if (response.status !== 200) {
                    return reject(new Error(response.data));
                }
                const returnedData = response.data;
                if (!underscore_1.default.isEmpty(returnedData.SigninToken)) {
                    const consoleUrl = [
                        AWS_SIGNIN_URL,
                        '?Action=login',
                        '&Destination=',
                        encodeURIComponent(AWS_CONSOLE_URL),
                        '&SigninToken=',
                        encodeURIComponent(returnedData.SigninToken),
                    ].join('');
                    return resolve(consoleUrl);
                }
                else {
                    console.log(response.data);
                    return reject(new Error('AWS didn’t return signin token!'));
                }
            }
            catch (err) {
                return reject(err);
            }
        }));
    });
}
//# sourceMappingURL=alks-sessions-console.js.map