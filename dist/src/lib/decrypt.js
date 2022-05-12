"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = void 0;
var crypto_1 = require("crypto");
var underscore_1 = require("underscore");
var getSizedEncryptionKey_1 = require("./getSizedEncryptionKey");
var ENCODING = 'hex';
var ALGORITHM = 'aes-256-cbc';
var PART_CHAR = ':';
function decrypt(text, key) {
    if ((0, underscore_1.isEmpty)(text)) {
        return '';
    }
    var parts = text.split(PART_CHAR);
    // Warning: if parts is empty, parts.shift() returns undefined and breaks Buffer.from(...)
    var iv = Buffer.from(parts.shift(), ENCODING);
    var encd = Buffer.from(parts.join(PART_CHAR), ENCODING);
    var decipher = (0, crypto_1.createDecipheriv)(ALGORITHM, Buffer.from((0, getSizedEncryptionKey_1.getSizedEncryptionKey)(key)), iv);
    var decrypt = Buffer.concat([decipher.update(encd), decipher.final()]);
    return decrypt.toString();
}
exports.decrypt = decrypt;
//# sourceMappingURL=decrypt.js.map