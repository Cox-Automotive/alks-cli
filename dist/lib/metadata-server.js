#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var developer_js_1 = require("./developer.js");
var iam_js_1 = require("./iam.js");
var sessions_js_1 = require("./sessions.js");
var express_list_endpoints_1 = tslib_1.__importDefault(require("express-list-endpoints"));
var app = express_1.default();
var logger = 'metadata-server';
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
app.get('/', function (_req, resp) {
    resp.json(express_list_endpoints_1.default(app));
});
app.get('/latest/dynamic/instance-identity/document', function (_req, resp) {
    resp.json({
        region: 'us-east-1',
    });
});
app.get([
    '/latest/meta-data/iam/security-credentials',
    '/latest/meta-data/iam/security-credentials/',
], function (_req, resp) {
    resp.end('alks');
});
app.get('/latest/meta-data/iam/security-credentials/*', function (_req, resp) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var metadata, key, key;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, developer_js_1.getMetadata()];
            case 1:
                metadata = _a.sent();
                if (!metadata.isIAM) return [3 /*break*/, 3];
                return [4 /*yield*/, iam_js_1.getIAMKey({}, logger, metadata.alksAccount, metadata.alksRole, false, false)];
            case 2:
                key = (_a.sent()).key;
                resp.json(generateResponse(key));
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, sessions_js_1.getSessionKey({}, logger, metadata.alksAccount, metadata.alksRole, false, false, false)];
            case 4:
                key = _a.sent();
                resp.json(generateResponse(key));
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
app.listen(45000, '127.0.0.1', function () {
    console.log('Metadata server listening on port 45000');
});
//# sourceMappingURL=metadata-server.js.map