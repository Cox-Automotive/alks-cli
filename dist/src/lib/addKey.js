"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addKey = void 0;
const tslib_1 = require("tslib");
const encrypt_1 = require("./encrypt");
const getKeysCollection_1 = require("./getKeysCollection");
const isTokenAuth_1 = require("./isTokenAuth");
const db_1 = require("./db");
function addKey(accessKey, secretKey, sessionToken, alksAccount, alksRole, expires, auth, isIAM) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const enc = (0, isTokenAuth_1.isTokenAuth)(auth) ? auth.token : auth.password;
        const keys = yield (0, getKeysCollection_1.getKeysCollection)();
        keys.insert({
            accessKey: (0, encrypt_1.encrypt)(accessKey, enc),
            secretKey: (0, encrypt_1.encrypt)(secretKey, enc),
            sessionToken: (0, encrypt_1.encrypt)(sessionToken, enc),
            alksAccount: (0, encrypt_1.encrypt)(alksAccount, enc),
            alksRole: (0, encrypt_1.encrypt)(alksRole, enc),
            isIAM,
            expires,
        });
        const db = yield (0, db_1.getDb)();
        return new Promise((resolve, reject) => {
            db.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    });
}
exports.addKey = addKey;
//# sourceMappingURL=addKey.js.map