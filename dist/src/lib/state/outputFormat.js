"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOutputFormat = exports.getOutputFormat = void 0;
const tslib_1 = require("tslib");
const developer_1 = require("./developer");
const log_1 = require("../log");
function getOutputFormat() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const developer = yield (0, developer_1.getDeveloper)();
        if (developer.outputFormat) {
            (0, log_1.log)('using stored output format');
            return developer.outputFormat;
        }
        return 'env';
    });
}
exports.getOutputFormat = getOutputFormat;
function setOutputFormat(outputFormat) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, developer_1.updateDeveloper)({ outputFormat });
    });
}
exports.setOutputFormat = setOutputFormat;
//# sourceMappingURL=outputFormat.js.map