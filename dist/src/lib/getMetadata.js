"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = void 0;
var tslib_1 = require("tslib");
var getCollection_1 = require("./getCollection");
var log_1 = require("./log");
function getMetadata() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var md, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('retreiving metadata');
                    return [4 /*yield*/, getCollection_1.getCollection('metadata')];
                case 1:
                    md = _a.sent();
                    data = md.chain().data()[0];
                    return [2 /*return*/, data || []];
            }
        });
    });
}
exports.getMetadata = getMetadata;
//# sourceMappingURL=getMetadata.js.map