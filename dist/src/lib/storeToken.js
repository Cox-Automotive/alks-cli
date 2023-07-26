"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeToken = void 0;
const tslib_1 = require("tslib");
const log_1 = require("./log");
const getKeytar_1 = require("./getKeytar");
const cli_color_1 = require("cli-color");
const confirm_1 = require("./confirm");
const credentials_1 = require("./state/credentials");
const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';
function storeToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('storing token');
        try {
            const keytar = yield (0, getKeytar_1.getKeytar)();
            yield keytar.setPassword(SERVICE, ALKS_TOKEN, token);
        }
        catch (e) {
            (0, log_1.log)(e.message);
            console.error((0, cli_color_1.red)('No keychain could be found for storing the token'));
            const confirmation = yield (0, confirm_1.confirm)('Would you like to store your token in a plaintext file? (Not Recommended)', false);
            if (!confirmation) {
                throw new Error('Failed to save token');
            }
            const credentials = yield (0, credentials_1.getCredentials)();
            credentials.refresh_token = token;
            yield (0, credentials_1.setCredentials)(credentials);
        }
    });
}
exports.storeToken = storeToken;
//# sourceMappingURL=storeToken.js.map