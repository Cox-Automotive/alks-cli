"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksIam = void 0;
var tslib_1 = require("tslib");
var subcommandSuggestion_1 = require("../subcommandSuggestion");
function handleAlksIam(program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            subcommandSuggestion_1.subcommandSuggestion(program, 'iam');
            return [2 /*return*/];
        });
    });
}
exports.handleAlksIam = handleAlksIam;
//# sourceMappingURL=alks-iam.js.map