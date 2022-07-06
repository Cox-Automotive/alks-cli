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
        var server, params, alks, result, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, server_1.getServer)()];
                case 1:
                    server = _a.sent();
                    if (!server) {
                        throw new Error('Server URL is not configured. Please run: alks developer configure');
                    }
                    params = {
                        baseUrl: server,
                        userAgent: (0, getUserAgentString_1.getUserAgentString)(),
                    };
                    if (!isTokenProps(props)) return [3 /*break*/, 6];
                    alks = (0, alks_js_1.create)(params);
                    result = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, alks.getAccessToken({
                            refreshToken: props.token,
                        })];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    throw new Error("".concat(e_1.message, ". You can get a new refresh token by running 'alks developer login2fa'"), 
                    // This is valid JS, but typescript doesn't seem to think so yet. We should remove this once typescript supports the new Error constructors
                    // @ts-ignore
                    { cause: e_1 });
                case 5:
                    alks = alks.create(tslib_1.__assign(tslib_1.__assign({}, params), { accessToken: result.accessToken }));
                    return [3 /*break*/, 7];
                case 6:
                    // According to typescript, alks.js doesn't officially support username & password
                    alks = (0, alks_js_1.create)(tslib_1.__assign(tslib_1.__assign({}, params), { userid: props.userid, password: props.password }));
                    _a.label = 7;
                case 7: return [2 /*return*/, alks];
            }
        });
    });
}
exports.getAlks = getAlks;
//# sourceMappingURL=getAlks.js.map