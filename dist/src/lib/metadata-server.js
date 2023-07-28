"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const express_list_endpoints_1 = tslib_1.__importDefault(require("express-list-endpoints"));
const getMetadata_js_1 = require("./getMetadata.js");
const getIamKey_js_1 = require("./getIamKey.js");
const app = (0, express_1.default)();
function generateResponse(key) {
    return {
        Code: 'Success',
        LastUpdated: new Date().toISOString(),
        Type: 'AWS-HMAC',
        AccessKeyId: key.accessKey,
        SecretAccessKey: key.secretKey,
        Token: key.sessionToken,
        Expiration: new Date(key.expires).toISOString(),
        ALKSIsIAM: key.isIAM,
        ALKSAccount: key.alksAccount,
        ALKSRole: key.alksRole,
    };
}
app.get('/', (_req, resp) => {
    resp.json((0, express_list_endpoints_1.default)(app));
});
app.get('/latest/dynamic/instance-identity/document', (_req, resp) => {
    resp.json({
        region: 'us-east-1',
    });
});
app.get([
    '/latest/meta-data/iam/security-credentials',
    '/latest/meta-data/iam/security-credentials/',
], (_req, resp) => {
    resp.end('alks');
});
app.get('/latest/meta-data/iam/security-credentials/*', (_req, resp) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const metadata = yield (0, getMetadata_js_1.getMetadata)();
    const key = yield (0, getIamKey_js_1.getIamKey)(metadata.alksAccount, metadata.alksRole, false, false, metadata.isIam);
    resp.json(generateResponse(key));
}));
app.listen(45000, '127.0.0.1', () => {
    console.log('Metadata server listening on port 45000');
});
//# sourceMappingURL=metadata-server.js.map