"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserId = exports.getUserId = void 0;
var tslib_1 = require("tslib");
var developer_1 = require("./developer");
var program_1 = tslib_1.__importDefault(require("../program"));
var log_1 = require("../log");
var underscore_1 = require("underscore");
var USER_ID_ENV_VAR_NAME = 'ALKS_USERID';
function getUserId() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var userIdOption, userIdFromEnv, developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userIdOption = program_1.default.opts().userid;
                    if (userIdOption) {
                        (0, log_1.log)('using userid from CLI arg');
                        return [2 /*return*/, userIdOption];
                    }
                    userIdFromEnv = process.env[USER_ID_ENV_VAR_NAME];
                    if (!(0, underscore_1.isEmpty)(userIdFromEnv)) {
                        (0, log_1.log)('using userid from environment variable');
                        return [2 /*return*/, userIdFromEnv];
                    }
                    return [4 /*yield*/, (0, developer_1.getDeveloper)()];
                case 1:
                    developer = _a.sent();
                    if (developer.userid) {
                        (0, log_1.log)('using stored userid');
                        return [2 /*return*/, developer.userid];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.getUserId = getUserId;
function setUserId(userId) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, developer_1.updateDeveloper)({ userid: userId })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setUserId = setUserId;
//# sourceMappingURL=userId.js.map