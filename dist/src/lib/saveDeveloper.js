"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDeveloper = void 0;
var tslib_1 = require("tslib");
var log_1 = require("../lib/log");
var trim_1 = require("../lib/trim");
var getCollection_1 = require("./getCollection");
var db_1 = require("./db");
var getDeveloper_1 = require("./getDeveloper");
function saveDeveloper(newDeveloper) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var collection, developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('saving developer');
                    return [4 /*yield*/, getCollection_1.getCollection('account')];
                case 1:
                    collection = _a.sent();
                    collection.removeDataOnly();
                    return [4 /*yield*/, getDeveloper_1.getDeveloper()];
                case 2:
                    developer = _a.sent();
                    if (newDeveloper.server) {
                        developer.server = trim_1.trim(newDeveloper.server);
                    }
                    if (newDeveloper.userid) {
                        developer.userid = trim_1.trim(newDeveloper.userid);
                    }
                    if (newDeveloper.alksAccount) {
                        developer.alksAccount = trim_1.trim(newDeveloper.alksAccount);
                    }
                    if (newDeveloper.alksRole) {
                        developer.alksRole = trim_1.trim(newDeveloper.alksRole);
                    }
                    if (newDeveloper.lastVersion) {
                        developer.lastVersion = newDeveloper.lastVersion;
                    }
                    if (newDeveloper.outputFormat) {
                        developer.outputFormat = trim_1.trim(newDeveloper.outputFormat);
                    }
                    collection.insert(developer);
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