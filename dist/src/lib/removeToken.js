"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeToken = void 0;
const tslib_1 = require("tslib");
const log_1 = require("./log");
const getKeytar_1 = require("./getKeytar");
const SERVICE = 'alkscli';
const ALKS_TOKEN = 'alkstoken';
function removeToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)('removing token');
        const keytar = yield (0, getKeytar_1.getKeytar)();
        keytar.deletePassword(SERVICE, ALKS_TOKEN);
    });
}
exports.removeToken = removeToken;
//# sourceMappingURL=removeToken.js.map