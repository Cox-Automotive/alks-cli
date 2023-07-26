"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserId = exports.getUserId = void 0;
const tslib_1 = require("tslib");
const developer_1 = require("./developer");
const program_1 = tslib_1.__importDefault(require("../program"));
const log_1 = require("../log");
const underscore_1 = require("underscore");
const USER_ID_ENV_VAR_NAME = 'ALKS_USERID';
function getUserId() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const userIdOption = program_1.default.opts().userid;
        if (userIdOption) {
            (0, log_1.log)('using userid from CLI arg');
            return userIdOption;
        }
        const userIdFromEnv = process.env[USER_ID_ENV_VAR_NAME];
        if (!(0, underscore_1.isEmpty)(userIdFromEnv)) {
            (0, log_1.log)('using userid from environment variable');
            return userIdFromEnv;
        }
        const developer = yield (0, developer_1.getDeveloper)();
        if (developer.userid) {
            (0, log_1.log)('using stored userid');
            return developer.userid;
        }
        return undefined;
    });
}
exports.getUserId = getUserId;
function setUserId(userId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, developer_1.updateDeveloper)({ userid: userId });
    });
}
exports.setUserId = setUserId;
//# sourceMappingURL=userId.js.map