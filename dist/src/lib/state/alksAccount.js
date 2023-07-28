"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAlksAccount = exports.getAlksAccount = void 0;
const tslib_1 = require("tslib");
const log_1 = require("../log");
const developer_1 = require("./developer");
function getAlksAccount() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const developer = yield (0, developer_1.getDeveloper)();
        if (developer.alksAccount) {
            (0, log_1.log)('using stored alks account');
            return developer.alksAccount;
        }
        return undefined;
    });
}
exports.getAlksAccount = getAlksAccount;
function setAlksAccount(alksAccount) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, developer_1.updateDeveloper)({ alksAccount });
    });
}
exports.setAlksAccount = setAlksAccount;
//# sourceMappingURL=alksAccount.js.map