"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretFromStdin = void 0;
var tslib_1 = require("tslib");
var input = '';
function getSecretFromStdin() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            if (!process.stdin.isTTY) {
                return [2 /*return*/, undefined];
            }
            // use already-read input on consecutive calls
            if (input.length > 0) {
                return [2 /*return*/, input];
            }
            return [2 /*return*/, new Promise(function (resolve) {
                    process.stdin.on('data', function (data) {
                        input += data;
                    });
                    process.stdin.on('end', function () {
                        resolve(input.trim());
                    });
                })];
        });
    });
}
exports.getSecretFromStdin = getSecretFromStdin;
//# sourceMappingURL=getSecretFromStdin.js.map