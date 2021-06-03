"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
var tslib_1 = require("tslib");
var getDbFile_1 = require("./getDbFile");
var lokijs_1 = tslib_1.__importDefault(require("lokijs"));
var db = new lokijs_1.default(getDbFile_1.getDbFile());
function getDb() {
    return db;
}
exports.getDb = getDb;
//# sourceMappingURL=db.js.map