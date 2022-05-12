"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obfuscate = void 0;
var underscore_1 = require("underscore");
function obfuscate(str) {
    if ((0, underscore_1.isEmpty)(str)) {
        return '';
    }
    var s1 = Math.floor(str.length * 0.3);
    var obfuscated = [str.substring(0, s1)];
    (0, underscore_1.times)(str.length - s1, function () {
        obfuscated.push('*');
    });
    return obfuscated.join('');
}
exports.obfuscate = obfuscate;
//# sourceMappingURL=obfuscate.js.map