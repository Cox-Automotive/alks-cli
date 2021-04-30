"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlks = void 0;
var tslib_1 = require("tslib");
var alks_js_1 = require("alks.js");
var getUserAgentString_1 = require("./getUserAgentString");
function isTokenProps(props) {
    return !!props.token;
}
/**
 * Gets a preconfigured alks.js object
 */
function getAlks(props) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var baseUrl, params, alks, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseUrl = props.baseUrl;
                    params = {
                        baseUrl: baseUrl,
                        userAgent: getUserAgentString_1.getUserAgentString(),
                    };
                    if (!isTokenProps(props)) return [3 /*break*/, 2];
                    alks = alks_js_1.create(params);
                    return [4 /*yield*/, alks.getAccessToken({
                            refreshToken: props.token,
                        })];
                case 1:
                    result = _a.sent();
                    alks = alks.create(tslib_1.__assign(tslib_1.__assign({}, props), { accessToken: result.accessToken }));
                    return [3 /*break*/, 3];
                case 2:
                    // According to typescript, alks.js doesn't officially support username & password
                    alks = alks_js_1.create(tslib_1.__assign(tslib_1.__assign({}, params), { userid: props.userid, password: props.password }));
                    _a.label = 3;
                case 3: return [2 /*return*/, alks];
            }
        });
    });
}
exports.getAlks = getAlks;
//# sourceMappingURL=getAlks.js.map