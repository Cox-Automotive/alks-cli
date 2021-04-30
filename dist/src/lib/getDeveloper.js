"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeveloper = void 0;
var tslib_1 = require("tslib");
var getCollection_1 = require("./getCollection");
function getDeveloper() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var collection, developerConfigs, developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCollection_1.getCollection('account')];
                case 1:
                    collection = _a.sent();
                    developerConfigs = collection.chain().data();
                    if (developerConfigs.length === 0) {
                        throw new Error('Developer not configured. Please run `alks developer configure`');
                    }
                    developer = developerConfigs[0];
                    if (process.env.ALKS_SERVER) {
                        developer.server = process.env.ALKS_SERVER;
                    }
                    if (process.env.ALKS_USERID) {
                        developer.userid = process.env.ALKS_USERID;
                    }
                    return [2 /*return*/, developer];
            }
        });
    });
}
exports.getDeveloper = getDeveloper;
//# sourceMappingURL=getDeveloper.js.map