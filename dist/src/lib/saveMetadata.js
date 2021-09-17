"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMetadata = void 0;
var tslib_1 = require("tslib");
var getCollection_1 = require("./getCollection");
var log_1 = require("./log");
var db_1 = require("./db");
function saveMetadata(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var md, db;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('saving metadata');
                    return [4 /*yield*/, getCollection_1.getCollection('metadata')];
                case 1:
                    md = _a.sent();
                    md.removeDataOnly();
                    md.insert(data);
                    return [4 /*yield*/, db_1.getDb()];
                case 2:
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
exports.saveMetadata = saveMetadata;
//# sourceMappingURL=saveMetadata.js.map