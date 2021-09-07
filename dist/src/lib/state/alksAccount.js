"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAlksAccount = exports.getAlksAccount = void 0;
var tslib_1 = require("tslib");
var log_1 = require("../log");
var developer_1 = require("./developer");
function getAlksAccount() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    if (developer.alksAccount) {
                        log_1.log('using stored alks account');
                        return [2 /*return*/, developer.alksAccount];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.getAlksAccount = getAlksAccount;
function setAlksAccount(alksAccount) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.updateDeveloper({ alksAccount: alksAccount })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setAlksAccount = setAlksAccount;
//# sourceMappingURL=alksAccount.js.map