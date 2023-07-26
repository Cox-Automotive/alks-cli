"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLastVersion = exports.getLastVersion = void 0;
const tslib_1 = require("tslib");
const developer_1 = require("./developer");
const package_json_1 = require("../../../package.json");
const log_1 = require("../log");
function getLastVersion() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const developer = yield (0, developer_1.getDeveloper)();
        if (developer.lastVersion) {
            (0, log_1.log)('using stored last version');
            return developer.lastVersion;
        }
        // Since this function is primarily used by checkForUpdate, just return the current version if this is the first time we're running the CLI so it doesn't show us what's new
        return package_json_1.version;
    });
}
exports.getLastVersion = getLastVersion;
function setLastVersion(lastVersion) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, developer_1.updateDeveloper)({ lastVersion });
    });
}
exports.setLastVersion = setLastVersion;
//# sourceMappingURL=lastVersion.js.map