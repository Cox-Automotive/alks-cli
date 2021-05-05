"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMetadata = void 0;
var tslib_1 = require("tslib");
var getDbFile_1 = require("./getDbFile");
var lokijs_1 = tslib_1.__importDefault(require("lokijs"));
var getCollection_1 = require("./getCollection");
var log_1 = require("./log");
var db = new lokijs_1.default(getDbFile_1.getDbFile());
function saveMetadata(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var md;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('saving metadata');
                    return [4 /*yield*/, getCollection_1.getCollection('metadata')];
                case 1:
                    md = _a.sent();
                    md.removeDataOnly();
                    md.insert(data);
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