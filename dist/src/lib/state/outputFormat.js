"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOutputFormat = exports.getOutputFormat = void 0;
var tslib_1 = require("tslib");
var developer_1 = require("./developer");
var log_1 = require("../log");
function getOutputFormat() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    if (developer.outputFormat) {
                        log_1.log('using stored output format');
                        return [2 /*return*/, developer.outputFormat];
                    }
                    throw new Error('ALKS CLI is not configured. Please run: alks developer configure');
            }
        });
    });
}
exports.getOutputFormat = getOutputFormat;
function setOutputFormat(outputFormat) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.updateDeveloper({ outputFormat: outputFormat })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setOutputFormat = setOutputFormat;
//# sourceMappingURL=outputFormat.js.map