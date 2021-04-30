"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var getDeveloper_1 = require("./getDeveloper");
var getUserIdFromPrompt_1 = require("./getUserIdFromPrompt");
var log_1 = require("./log");
var logger = 'developer';
function getUserId(cliOptions, prompt) {
    if (prompt === void 0) { prompt = true; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer, userid;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(cliOptions === null || cliOptions === void 0 ? void 0 : cliOptions.userid)) return [3 /*break*/, 1];
                    // first check userid from CLI argument
                    log_1.log(cliOptions, logger, 'using userid from CLI arg');
                    return [2 /*return*/, cliOptions.userid];
                case 1:
                    if (!!underscore_1.isEmpty(process.env.ALKS_USERID)) return [3 /*break*/, 2];
                    // then check for an environment variable
                    log_1.log(cliOptions, logger, 'using userid from environment variable');
                    return [2 /*return*/, process.env.ALKS_USERID];
                case 2: return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 3:
                    developer = _a.sent();
                    userid = developer.userid;
                    if (!underscore_1.isEmpty(userid)) {
                        log_1.log(cliOptions, logger, 'using stored userid');
                        return [2 /*return*/, userid];
                    }
                    else if (prompt) {
                        // otherwise prompt the user (if we have program)
                        log_1.log(cliOptions, logger, 'no userid found, prompting user');
                        return [2 /*return*/, cliOptions ? getUserIdFromPrompt_1.getUserIdFromPrompt() : null];
                    }
                    else {
                        throw new Error('No userid was configured');
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getUserId = getUserId;
//# sourceMappingURL=getUserId.js.map