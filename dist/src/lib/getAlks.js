"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlks = void 0;
const tslib_1 = require("tslib");
const alks_js_1 = require("alks.js");
const getUserAgentString_1 = require("./getUserAgentString");
const server_1 = require("./state/server");
const log_1 = require("./log");
const node_fetch_commonjs_1 = tslib_1.__importDefault(require("node-fetch-commonjs"));
function isTokenProps(props) {
    return !!props.token;
}
const loggingFetch = (url, body) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, node_fetch_commonjs_1.default)(url, body);
    const json = (yield response.json());
    (0, log_1.log)(`alks.js call to ${url} status "${json.statusMessage}" with requestId: ${json.requestId}`);
    response.json = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return json; });
    return response;
});
/**
 * Gets a preconfigured alks.js object
 */
function getAlks(props) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const server = yield (0, server_1.getServer)();
        if (!server) {
            throw new Error('Server URL is not configured. Please run: alks developer configure');
        }
        const params = {
            baseUrl: server,
            userAgent: (0, getUserAgentString_1.getUserAgentString)(),
            _fetch: loggingFetch,
        };
        let alks;
        if (isTokenProps(props)) {
            alks = (0, alks_js_1.create)(params);
            let result;
            try {
                result = yield alks.getAccessToken({
                    refreshToken: props.token,
                });
            }
            catch (e) {
                throw new Error(`${e.message}. You can get a new refresh token by running 'alks developer login2fa'`, 
                // This is valid JS, but typescript doesn't seem to think so yet. We should remove this once typescript supports the new Error constructors
                // @ts-ignore
                { cause: e });
            }
            alks = alks.create(Object.assign(Object.assign({}, params), { accessToken: result.accessToken }));
        }
        else {
            // According to typescript, alks.js doesn't officially support username & password
            alks = (0, alks_js_1.create)(Object.assign(Object.assign({}, params), { userid: props.userid, password: props.password }));
        }
        return alks;
    });
}
exports.getAlks = getAlks;
//# sourceMappingURL=getAlks.js.map