"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksServerConfigure = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const underscore_1 = require("underscore");
const checkForUpdate_1 = require("../checkForUpdate");
const errorAndExit_1 = require("../errorAndExit");
const getIamKey_1 = require("../getIamKey");
const log_1 = require("../log");
const saveMetadata_1 = require("../saveMetadata");
const tryToExtractRole_1 = require("../tryToExtractRole");
function handleAlksServerConfigure(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const alksAccount = options.account;
        let alksRole = options.role;
        const forceNewSession = options.newSession;
        const filterFaves = options.favorites || false;
        if (!(0, underscore_1.isUndefined)(alksAccount) && (0, underscore_1.isUndefined)(alksRole)) {
            (0, log_1.log)('trying to extract role from account');
            alksRole = (0, tryToExtractRole_1.tryToExtractRole)(alksAccount);
        }
        try {
            let key;
            try {
                key = yield (0, getIamKey_1.getIamKey)(alksAccount, alksRole, forceNewSession, filterFaves, (0, underscore_1.isUndefined)(options.iam) ? false : true);
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)(err);
            }
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                yield (0, saveMetadata_1.saveMetadata)({
                    alksAccount: key.alksAccount,
                    alksRole: key.alksRole,
                    isIam: key.isIAM,
                });
            }
            catch (err) {
                (0, errorAndExit_1.errorAndExit)('Unable to save metadata!', err);
            }
            console.error(cli_color_1.default.white('Metadata has been saved!'));
            yield (0, checkForUpdate_1.checkForUpdate)();
        }
        catch (err) {
            (0, errorAndExit_1.errorAndExit)(err.message, err);
        }
    });
}
exports.handleAlksServerConfigure = handleAlksServerConfigure;
//# sourceMappingURL=alks-server-configure.js.map