"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
var crypto_1 = require("crypto");
var underscore_1 = require("underscore");
var getSizedEncryptionKey_1 = require("./getSizedEncryptionKey");
var IV_LEN = 16;
var ENCODING = 'hex';
var ALGORITHM = 'aes-256-cbc';
var PART_CHAR = ':';
function encrypt(text, key) {
    if ((0, underscore_1.isEmpty)(text)) {
        text = '';
    }
    var iv = (0, crypto_1.randomBytes)(IV_LEN);
    var cipher = (0, crypto_1.createCipheriv)(ALGORITHM, Buffer.from((0, getSizedEncryptionKey_1.getSizedEncryptionKey)(key)), iv);
    var encd = Buffer.concat([cipher.update(text), cipher.final()]);
    return [iv.toString(ENCODING), encd.toString(ENCODING)].join(PART_CHAR);
}
exports.encrypt = encrypt;
//# sourceMappingURL=encrypt.js.map