"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSizedEncryptionKey = void 0;
var ENC_LEN = 32;
function getSizedEncryptionKey(key) {
    // must be 256 bytes (32 characters)
    return key.padStart(ENC_LEN, '0').substring(0, ENC_LEN);
}
exports.getSizedEncryptionKey = getSizedEncryptionKey;
//# sourceMappingURL=getSizedEncryptionKey.js.map