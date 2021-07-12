"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setServer = exports.getServer = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var log_1 = require("../log");
var developer_1 = require("./developer");
var SERVER_ENV_VAR_NAME = 'ALKS_SERVER';
function getServer() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var serverFromEnv, developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverFromEnv = process.env[SERVER_ENV_VAR_NAME];
                    if (!underscore_1.isEmpty(serverFromEnv)) {
                        log_1.log('using server url from environment variable');
                        return [2 /*return*/, serverFromEnv];
                    }
                    return [4 /*yield*/, developer_1.getDeveloper()];
                case 1:
                    developer = _a.sent();
                    if (developer.server) {
                        log_1.log('using stored server url');
                        return [2 /*return*/, developer.server];
                    }
                    throw new Error('Server URL is not configured. Please run: alks developer configure');
            }
        });
    });
}
exports.getServer = getServer;
function setServer(server) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, developer_1.updateDeveloper({ server: server })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setServer = setServer;
//# sourceMappingURL=server.js.map