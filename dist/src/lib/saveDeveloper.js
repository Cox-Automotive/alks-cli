"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDeveloper = void 0;
var tslib_1 = require("tslib");
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var log_1 = require("../lib/log");
var trim_1 = require("../lib/trim");
var getCollection_1 = require("./getCollection");
var db_1 = require("./db");
function saveDeveloper(developer) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var collection;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('saving developer');
                    return [4 /*yield*/, getCollection_1.getCollection('account')];
                case 1:
                    collection = _a.sent();
                    collection.removeDataOnly();
                    collection.insert({
                        server: developer.server && trim_1.trim(developer.server),
                        userid: developer.userid && trim_1.trim(developer.userid),
                        alksAccount: developer.alksAccount && trim_1.trim(developer.alksAccount),
                        alksRole: developer.alksRole && trim_1.trim(developer.alksRole),
                        lastVersion: package_json_1.default.version,
                        outputFormat: developer.outputFormat && trim_1.trim(developer.outputFormat),
                    });
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            db_1.getDb().save(function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        })];
            }
        });
    });
}
exports.saveDeveloper = saveDeveloper;
//# sourceMappingURL=saveDeveloper.js.map