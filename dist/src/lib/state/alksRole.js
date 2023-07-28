"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAlksRole = exports.getAlksRole = void 0;
const tslib_1 = require("tslib");
const log_1 = require("../log");
const developer_1 = require("./developer");
function getAlksRole() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const developer = yield (0, developer_1.getDeveloper)();
        if (developer.alksRole) {
            (0, log_1.log)('using stored alks role');
            return developer.alksRole;
        }
        return undefined;
    });
}
exports.getAlksRole = getAlksRole;
function setAlksRole(alksRole) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, developer_1.updateDeveloper)({ alksRole });
    });
}
exports.setAlksRole = setAlksRole;
//# sourceMappingURL=alksRole.js.map