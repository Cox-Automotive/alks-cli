"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensitive = void 0;
function sensitive(input, showCharacters = 4) {
    if (input === undefined) {
        return undefined;
    }
    return input.substring(0, showCharacters) + '******';
}
exports.sensitive = sensitive;
//# sourceMappingURL=sensitive.js.map