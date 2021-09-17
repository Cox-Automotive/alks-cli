"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlks = void 0;
var tslib_1 = require("tslib");
var alks_js_1 = require("alks.js");
var getUserAgentString_1 = require("./getUserAgentString");
var server_1 = require("./state/server");
function isTokenProps(props) {
    return !!props.token;
}
/**
 * Gets a preconfigured alks.js object
 */
function getAlks(props) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var server, params, alks, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, server_1.getServer()];
                case 1:
                    server = _a.sent();
                    if (!server) {
                        throw new Error('Server URL is not configured. Please run: alks developer configure');
                    }
                    params = {
                        baseUrl: server,
                        userAgent: getUserAgentString_1.getUserAgentString(),
                    };
                    if (!isTokenProps(props)) return [3 /*break*/, 3];
                    alks = alks_js_1.create(params);
                    return [4 /*yield*/, alks.getAccessToken({
                            refreshToken: props.token,
                        })];
                case 2:
                    result = _a.sent();
                    alks = alks.create(tslib_1.__assign(tslib_1.__assign({}, params), { accessToken: result.accessToken }));
                    return [3 /*break*/, 4];
                case 3:
                    // According to typescript, alks.js doesn't officially support username & password
                    alks = alks_js_1.create(tslib_1.__assign(tslib_1.__assign({}, params), { userid: props.userid, password: props.password }));
                    _a.label = 4;
                case 4: return [2 /*return*/, alks];
            }
        });
    });
}
exports.getAlks = getAlks;
//# sourceMappingURL=getAlks.js.map