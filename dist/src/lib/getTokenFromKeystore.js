"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromKeystore = void 0;
const tslib_1 = require("tslib");
const getKeytar_1 = require("./getKeytar");
const log_1 = require("./log");
const credentials_1 = require("./state/credentials");
const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';
function getTokenFromKeystore() {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const keytar = yield (0, getKeytar_1.getKeytar)();
            const token = (_a = (yield keytar.getPassword(SERVICE, ALKS_TOKEN))) !== null && _a !== void 0 ? _a : undefined;
            (0, log_1.log)(`found token "${token}" in keystore`, {
                unsafe: true,
                alt: `found token of ${token
                    ? `${token.length} characters starting with "${token.substring(0, 1)}"`
                    : `undefined`} in keystore`,
            });
            return token;
        }
        catch (e) {
            (0, log_1.log)(e.message);
            (0, log_1.log)('Failed to use keychain. Checking for plaintext file');
            const credentials = yield (0, credentials_1.getCredentials)();
            return (_b = credentials.refresh_token) !== null && _b !== void 0 ? _b : undefined;
        }
    });
}
exports.getTokenFromKeystore = getTokenFromKeystore;
//# sourceMappingURL=getTokenFromKeystore.js.map