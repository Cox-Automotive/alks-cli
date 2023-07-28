"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
const crypto_1 = require("crypto");
const underscore_1 = require("underscore");
const getSizedEncryptionKey_1 = require("./getSizedEncryptionKey");
const IV_LEN = 16;
const ENCODING = 'hex';
const ALGORITHM = 'aes-256-cbc';
const PART_CHAR = ':';
function encrypt(text, key) {
    if ((0, underscore_1.isEmpty)(text)) {
        text = '';
    }
    const iv = (0, crypto_1.randomBytes)(IV_LEN);
    const cipher = (0, crypto_1.createCipheriv)(ALGORITHM, Buffer.from((0, getSizedEncryptionKey_1.getSizedEncryptionKey)(key)), iv);
    const encd = Buffer.concat([cipher.update(text), cipher.final()]);
    return [iv.toString(ENCODING), encd.toString(ENCODING)].join(PART_CHAR);
}
exports.encrypt = encrypt;
//# sourceMappingURL=encrypt.js.map