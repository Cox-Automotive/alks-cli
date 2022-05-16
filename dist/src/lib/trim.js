"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = void 0;
var underscore_1 = require("underscore");
function trim(str) {
    if ((0, underscore_1.isEmpty)(str)) {
        return str;
    }
    return String(str).trim();
}
exports.trim = trim;
//# sourceMappingURL=trim.js.map