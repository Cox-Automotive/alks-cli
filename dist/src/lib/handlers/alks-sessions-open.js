"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksSessionsOpen = void 0;
const tslib_1 = require("tslib");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getIamKey_1 = require("../getIamKey");
const getKeyOutput_1 = require("../getKeyOutput");
const log_1 = require("../log");
const tryToExtractRole_1 = require("../tryToExtractRole");
const alksAccount_1 = require("../state/alksAccount");
const alksRole_1 = require("../state/alksRole");
const outputFormat_1 = require("../state/outputFormat");
function handleAlksSessionsOpen(options) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let alksAccount = options.account;
        let alksRole = options.role;
        // Try to guess role from account if only account was provided
        if (alksAccount && !alksRole) {
            (0, log_1.log)('trying to extract role from account');
            alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
        }
        try {
            if (options.default) {
                alksAccount = yield (0, alksAccount_1.getAlksAccount)();
                alksRole = yield (0, alksRole_1.getAlksRole)();
                if (!alksAccount || !alksRole) {
                    (0, errorAndExit_1.errorAndExit)('Unable to load default account!');
                }
            }
            const key = yield (0, getIamKey_1.getIamKey)(alksAccount, alksRole, options.newSession, options.favorites, !!options.iam);
            console.log((0, getKeyOutput_1.getKeyOutput)(options.output || (yield (0, outputFormat_1.getOutputFormat)()), key, (_a = options.profile) !== null && _a !== void 0 ? _a : options.namedProfile, options.force));
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksSessionsOpen = handleAlksSessionsOpen;
//# sourceMappingURL=alks-sessions-open.js.map