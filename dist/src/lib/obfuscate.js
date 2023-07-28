"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obfuscate = void 0;
const underscore_1 = require("underscore");
function obfuscate(str) {
    if ((0, underscore_1.isEmpty)(str)) {
        return '';
    }
    const s1 = Math.floor(str.length * 0.3);
    const obfuscated = [str.substring(0, s1)];
    (0, underscore_1.times)(str.length - s1, () => {
        obfuscated.push('*');
    });
    return obfuscated.join('');
}
exports.obfuscate = obfuscate;
//# sourceMappingURL=obfuscate.js.map