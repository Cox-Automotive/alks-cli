"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setServer = exports.getServer = void 0;
const tslib_1 = require("tslib");
const underscore_1 = require("underscore");
const log_1 = require("../log");
const developer_1 = require("./developer");
const SERVER_ENV_VAR_NAME = 'ALKS_SERVER';
function getServer() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const serverFromEnv = process.env[SERVER_ENV_VAR_NAME];
        if (!(0, underscore_1.isEmpty)(serverFromEnv)) {
            (0, log_1.log)('using server url from environment variable');
            return serverFromEnv;
        }
        const developer = yield (0, developer_1.getDeveloper)();
        if (developer.server) {
            (0, log_1.log)('using stored server url');
            return developer.server;
        }
        return undefined;
    });
}
exports.getServer = getServer;
function setServer(server) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, developer_1.updateDeveloper)({ server });
    });
}
exports.setServer = setServer;
//# sourceMappingURL=server.js.map