"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = void 0;
const crypto_1 = require("crypto");
const underscore_1 = require("underscore");
const getSizedEncryptionKey_1 = require("./getSizedEncryptionKey");
const ENCODING = 'hex';
const ALGORITHM = 'aes-256-cbc';
const PART_CHAR = ':';
function decrypt(text, key) {
    if ((0, underscore_1.isEmpty)(text)) {
        return '';
    }
    const parts = text.split(PART_CHAR);
    // Warning: if parts is empty, parts.shift() returns undefined and breaks Buffer.from(...)
    const iv = Buffer.from(parts.shift(), ENCODING);
    const encd = Buffer.from(parts.join(PART_CHAR), ENCODING);
    const decipher = (0, crypto_1.createDecipheriv)(ALGORITHM, Buffer.from((0, getSizedEncryptionKey_1.getSizedEncryptionKey)(key)), iv);
    const decrypt = Buffer.concat([decipher.update(encd), decipher.final()]);
    return decrypt.toString();
}
exports.decrypt = decrypt;
//# sourceMappingURL=decrypt.js.map