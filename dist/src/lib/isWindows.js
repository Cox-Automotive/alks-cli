"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWindows = void 0;
function isWindows() {
    const platform = process.env.PLATFORM || process.platform;
    return /^win/.test(platform);
}
exports.isWindows = isWindows;
//# sourceMappingURL=isWindows.js.map