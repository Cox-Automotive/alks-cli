"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMetadata = void 0;
const tslib_1 = require("tslib");
const getCollection_1 = require("./getCollection");
const log_1 = require("./log");
const db_1 = require("./db");
function saveMetadata(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('saving metadata');
        const md = yield (0, getCollection_1.getCollection)('metadata');
        md.removeDataOnly();
        md.insert(data);
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
exports.saveMetadata = saveMetadata;
//# sourceMappingURL=saveMetadata.js.map