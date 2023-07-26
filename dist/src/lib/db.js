"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
const tslib_1 = require("tslib");
const getDbFile_1 = require("./getDbFile");
const lokijs_1 = tslib_1.__importDefault(require("lokijs"));
let db;
function getDb() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!db) {
            db = new lokijs_1.default(yield (0, getDbFile_1.getDbFile)());
        }
        return db;
    });
}
exports.getDb = getDb;
//# sourceMappingURL=db.js.map