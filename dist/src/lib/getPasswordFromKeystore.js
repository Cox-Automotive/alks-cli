"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordFromKeystore = void 0;
const tslib_1 = require("tslib");
const getKeytar_1 = require("./getKeytar");
const log_1 = require("./log");
const credentials_1 = require("./state/credentials");
const SERVICE = 'alkscli';
const ALKS_PASSWORD = 'alkspassword';
function getPasswordFromKeystore() {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const keytar = yield (0, getKeytar_1.getKeytar)();
            const password = (_a = (yield keytar.getPassword(SERVICE, ALKS_PASSWORD))) !== null && _a !== void 0 ? _a : undefined;
            (0, log_1.log)(`found password "${password}" in keystore`, {
                unsafe: true,
                alt: `found password of ${password
                    ? `${password.length} characters starting with "${password.substring(0, 1)}"`
                    : `undefined`} in keystore`,
            });
            return password;
        }
        catch (e) {
            (0, log_1.log)(e.message);
            (0, log_1.log)('Failed to use keychain. Checking for plaintext file');
            const credentials = yield (0, credentials_1.getCredentials)();
            return (_b = credentials.password) !== null && _b !== void 0 ? _b : undefined;
        }
    });
}
exports.getPasswordFromKeystore = getPasswordFromKeystore;
//# sourceMappingURL=getPasswordFromKeystore.js.map