"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountRegex = void 0;
var accountRegex = /([0-9]*)(\/)(ALKS)([a-zA-Z]*)([- ]*)([a-zA-Z0-9_-]*)/g;
function getAccountRegex() {
    return accountRegex;
}
exports.getAccountRegex = getAccountRegex;
//# sourceMappingURL=getAccountRegex.js.map