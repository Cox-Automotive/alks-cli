"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeveloper = exports.getDeveloper = void 0;
const tslib_1 = require("tslib");
const log_1 = require("../log");
const trim_1 = require("../trim");
const getCollection_1 = require("../getCollection");
const db_1 = require("../db");
function getDeveloper() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const collection = yield (0, getCollection_1.getCollection)('account');
        const developerConfigs = collection.chain().data();
        const developer = developerConfigs.length > 0 ? developerConfigs[0] : {};
        return developer;
    });
}
exports.getDeveloper = getDeveloper;
function updateDeveloper(newDeveloper) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('saving developer');
        const collection = yield (0, getCollection_1.getCollection)('account');
        collection.removeDataOnly();
        const developer = yield getDeveloper();
        if (newDeveloper.server) {
            developer.server = (0, trim_1.trim)(newDeveloper.server);
        }
        if (newDeveloper.userid) {
            developer.userid = (0, trim_1.trim)(newDeveloper.userid);
        }
        if (newDeveloper.alksAccount) {
            developer.alksAccount = (0, trim_1.trim)(newDeveloper.alksAccount);
        }
        if (newDeveloper.alksRole) {
            developer.alksRole = (0, trim_1.trim)(newDeveloper.alksRole);
        }
        if (newDeveloper.lastVersion) {
            developer.lastVersion = newDeveloper.lastVersion;
        }
        if (newDeveloper.outputFormat) {
            developer.outputFormat = (0, trim_1.trim)(newDeveloper.outputFormat);
        }
        // We have to remove the LokiJS metadata fields so LokiJS won't complain that we're trying to insert an object that exists already
        // @ts-ignore
        delete developer.meta;
        // @ts-ignore
        delete developer.$loki;
        (0, log_1.log)(`saving ${JSON.stringify(developer)}`);
        // LokiJS complains if we try to simply update or simply insert, and the project has been abandoned so upsert isn't coming soon
        // TODO ^on that note, let's remove LokiJS - BW
        collection.clear();
        collection.insert(developer);
        const db = yield (0, db_1.getDb)();
        return new Promise((resolve, reject) => {
            db.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    });
}
exports.updateDeveloper = updateDeveloper;
//# sourceMappingURL=developer.js.map