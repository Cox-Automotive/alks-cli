"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeveloper = exports.getDeveloper = void 0;
var tslib_1 = require("tslib");
var log_1 = require("../log");
var trim_1 = require("../trim");
var getCollection_1 = require("../getCollection");
var db_1 = require("../db");
function getDeveloper() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var collection, developerConfigs, developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCollection_1.getCollection('account')];
                case 1:
                    collection = _a.sent();
                    developerConfigs = collection.chain().data();
                    developer = developerConfigs.length > 0 ? developerConfigs[0] : {};
                    return [2 /*return*/, developer];
            }
        });
    });
}
exports.getDeveloper = getDeveloper;
function updateDeveloper(newDeveloper) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var collection, developer, db;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('saving developer');
                    return [4 /*yield*/, getCollection_1.getCollection('account')];
                case 1:
                    collection = _a.sent();
                    collection.removeDataOnly();
                    return [4 /*yield*/, getDeveloper()];
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
                    // We have to remove the LokiJS metadata fields so LokiJS won't complain that we're trying to insert an object that exists already
                    // @ts-ignore
                    delete developer.meta;
                    // @ts-ignore
                    delete developer.$loki;
                    log_1.log("saving " + JSON.stringify(developer));
                    // LokiJS complains if we try to simply update or simply insert, and the project has been abandoned so upsert isn't coming soon
                    // TODO ^on that note, let's remove LokiJS - BW
                    collection.clear();
                    collection.insert(developer);
                    return [4 /*yield*/, db_1.getDb()];
                case 3:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            db.save(function (err) {
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
exports.updateDeveloper = updateDeveloper;
//# sourceMappingURL=developer.js.map