"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = void 0;
const tslib_1 = require("tslib");
const getCollection_1 = require("./getCollection");
const log_1 = require("./log");
function getMetadata() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('retreiving metadata');
        const md = yield (0, getCollection_1.getCollection)('metadata');
        const data = md.chain().data()[0];
        return data || [];
    });
}
exports.getMetadata = getMetadata;
//# sourceMappingURL=getMetadata.js.map