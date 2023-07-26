"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePassword = void 0;
const tslib_1 = require("tslib");
const log_1 = require("./log");
const getKeytar_1 = require("./getKeytar");
const confirm_1 = require("./confirm");
const cli_color_1 = require("cli-color");
const credentials_1 = require("./state/credentials");
const SERVICE = 'alkscli';
const ALKS_PASSWORD = 'alkspassword';
function storePassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('storing password');
        try {
            const keytar = yield (0, getKeytar_1.getKeytar)();
            yield keytar.setPassword(SERVICE, ALKS_PASSWORD, password);
        }
        catch (e) {
            (0, log_1.log)(e.message);
            console.error((0, cli_color_1.red)('No keychain could be found for storing the password'));
            const confirmation = yield (0, confirm_1.confirm)('Would you like to store your password in a plaintext file? (Not Recommended)', false);
            if (!confirmation) {
                throw new Error('Failed to save password');
            }
            const credentials = yield (0, credentials_1.getCredentials)();
            credentials.password = password;
            yield (0, credentials_1.setCredentials)(credentials);
        }
    });
}
exports.storePassword = storePassword;
//# sourceMappingURL=storePassword.js.map