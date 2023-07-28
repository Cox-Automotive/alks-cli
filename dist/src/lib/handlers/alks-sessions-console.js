"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsConsole = void 0;
const tslib_1 = require("tslib");
const underscore_1 = require("underscore");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getIamKey_1 = require("../getIamKey");
const getUserAgentString_1 = require("../getUserAgentString");
const log_1 = require("../log");
const tryToExtractRole_1 = require("../tryToExtractRole");
const alks_node_1 = tslib_1.__importDefault(require("alks-node"));
const open_1 = tslib_1.__importDefault(require("open"));
const alksAccount_1 = require("../state/alksAccount");
const alksRole_1 = require("../state/alksRole");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
function handleAlksSessionsConsole(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let alksAccount = options.account;
        let alksRole = options.role;
        const forceNewSession = options.newSession;
        const useDefaultAcct = options.default;
        const filterFaves = options.favorites || false;
        if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
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
                key = yield (0, getIamKey_1.getIamKey)(alksAccount, alksRole, forceNewSession, filterFaves, (0, underscore_1.isUndefined)(options.iam) ? false : true);
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)(err);
            }
            (0, log_1.log)('calling aws to generate 15min console URL');
            const url = yield new Promise((resolve) => {
                alks_node_1.default.generateConsoleUrl(key, { debug: options.verbose, ua: (0, getUserAgentString_1.getUserAgentString)() }, (err, consoleUrl) => {
                    if (err) {
                        (0, errorAndExit_1.errorAndExit)(err.message, err);
                    }
                    else {
                        resolve(consoleUrl);
                    }
                });
            });
            if (options.url) {
                console.log(url);
            }
            else {
                const opts = !(0, underscore_1.isEmpty)(options.openWith) ? { app: options.openWith } : {};
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
//# sourceMappingURL=alks-sessions-console.js.map