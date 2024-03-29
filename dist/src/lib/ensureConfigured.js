"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureConfigured = void 0;
const tslib_1 = require("tslib");
const getAuth_1 = require("./getAuth");
const developer_1 = require("./state/developer");
const server_1 = require("./state/server");
function ensureConfigured() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // validate we have a valid configuration
        // Note that we're explicitly checking the developer object instead of calling getServer and getUserId to ensure the developer object is configured
        const developer = yield (0, developer_1.getDeveloper)();
        if (!developer.server || !developer.userid) {
            return;
        }
        // If developer is not configured, ensure we at least have required variables configured
        if (!(yield getAuthButDontThrow()) || !(yield (0, server_1.getServer)())) {
            throw new Error('ALKS CLI is not configured. Please run: `alks developer configure` or set the environment variables ALKS_USERID and ALKS_SERVER');
        }
    });
}
exports.ensureConfigured = ensureConfigured;
// TODO: make getAuth simply return Auth or undefined so we don't have to do this
function getAuthButDontThrow() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, getAuth_1.getAuth)();
        }
        catch (_a) {
            return undefined;
        }
    });
}
//# sourceMappingURL=ensureConfigured.js.map