"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSizedEncryptionKey = void 0;
var tslib_1 = require("tslib");
var left_pad_1 = tslib_1.__importDefault(require("left-pad"));
var ENC_LEN = 32;
function getSizedEncryptionKey(key) {
    // must be 256 bytes (32 characters)
    return left_pad_1.default(key, ENC_LEN, 0).substring(0, ENC_LEN);
}
exports.getSizedEncryptionKey = getSizedEncryptionKey;
//# sourceMappingURL=getSizedEncryptionKey.js.map