"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addKey = void 0;
var tslib_1 = require("tslib");
var encrypt_1 = require("./encrypt");
var getKeysCollection_1 = require("./getKeysCollection");
var isTokenAuth_1 = require("./isTokenAuth");
var db_1 = require("./db");
function addKey(accessKey, secretKey, sessionToken, alksAccount, alksRole, expires, auth, isIAM) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var enc, keys, db;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    enc = (0, isTokenAuth_1.isTokenAuth)(auth) ? auth.token : auth.password;
                    return [4 /*yield*/, (0, getKeysCollection_1.getKeysCollection)()];
                case 1:
                    keys = _a.sent();
                    keys.insert({
                        accessKey: (0, encrypt_1.encrypt)(accessKey, enc),
                        secretKey: (0, encrypt_1.encrypt)(secretKey, enc),
                        sessionToken: (0, encrypt_1.encrypt)(sessionToken, enc),
                        alksAccount: (0, encrypt_1.encrypt)(alksAccount, enc),
                        alksRole: (0, encrypt_1.encrypt)(alksRole, enc),
                        isIAM: isIAM,
                        expires: expires,
                    });
                    return [4 /*yield*/, (0, db_1.getDb)()];
                case 2:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            db.save(function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        })];
            }
        });
    });
}
exports.addKey = addKey;
//# sourceMappingURL=addKey.js.map