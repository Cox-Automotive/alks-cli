"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackActivity = void 0;
var tslib_1 = require("tslib");
var log_1 = require("./log");
var universal_analytics_1 = tslib_1.__importDefault(require("universal-analytics"));
var getDeveloper_1 = require("./getDeveloper");
var visitor = null;
var GA_ID = 'UA-88747959-1';
function trackActivity(logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dev;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!visitor) return [3 /*break*/, 2];
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 1:
                    dev = _a.sent();
                    log_1.log(null, logger, 'creating tracker for: ' + dev.userid);
                    visitor = universal_analytics_1.default(GA_ID, String(dev.userid), {
                        https: true,
                        strictCidFormat: false,
                    });
                    _a.label = 2;
                case 2:
                    log_1.log(null, logger, 'tracking activity: ' + logger);
                    visitor.event('activity', logger).send();
                    return [2 /*return*/];
            }
        });
    });
}
exports.trackActivity = trackActivity;
//# sourceMappingURL=tractActivity.js.map