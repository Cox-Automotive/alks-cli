"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryToExtractRole = void 0;
var getAccountRegex_1 = require("./getAccountRegex");
function tryToExtractRole(account) {
    var match;
    while ((match = getAccountRegex_1.getAccountRegex().exec(account))) {
        if (match && account.indexOf('ALKS_') === -1) {
            // ignore legacy accounts
            return match[4];
        }
    }
    return undefined;
}
exports.tryToExtractRole = tryToExtractRole;
//# sourceMappingURL=tryToExtractRole.js.map