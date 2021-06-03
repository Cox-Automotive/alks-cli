"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordSecurelyStorable = void 0;
var isOsx_1 = require("./isOsx");
var isWindows_1 = require("./isWindows");
function isPasswordSecurelyStorable() {
    return isOsx_1.isOsx() || isWindows_1.isWindows();
}
exports.isPasswordSecurelyStorable = isPasswordSecurelyStorable;
//# sourceMappingURL=isPasswordSecurelyStorable.js.map