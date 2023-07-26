"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeys = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const isTokenAuth_1 = require("./isTokenAuth");
const underscore_1 = require("underscore");
const decrypt_1 = require("./decrypt");
const getKeysCollection_1 = require("./getKeysCollection");
const db_1 = require("./db");
function getKeys(auth, isIAM) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const keys = yield (0, getKeysCollection_1.getKeysCollection)();
        const now = (0, moment_1.default)();
        const enc = (0, isTokenAuth_1.isTokenAuth)(auth) ? auth.token : auth.password;
        // first delete any expired keys
        keys.removeWhere({ expires: { $lte: now.toDate() } });
        const db = yield (0, db_1.getDb)();
        return new Promise((resolve, reject) => {
            // save the db to prune expired keys, wait for transaction to complete
            db.save((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                // now get valid keys, decrypt their values and return
                const data = keys
                    .chain()
                    .find({ isIAM: { $eq: isIAM } })
                    .simplesort('expires')
                    .data();
                const dataOut = [];
                (0, underscore_1.each)(data, (keydata) => {
                    // try catch here since we upgraded encryption and previously encrypted sessions will fail to decrypt
                    try {
                        keydata.accessKey = (0, decrypt_1.decrypt)(keydata.accessKey, enc);
                        keydata.secretKey = (0, decrypt_1.decrypt)(keydata.secretKey, enc);
                        keydata.sessionToken = (0, decrypt_1.decrypt)(keydata.sessionToken, enc);
                        keydata.alksAccount = (0, decrypt_1.decrypt)(keydata.alksAccount, enc);
                        keydata.alksRole = (0, decrypt_1.decrypt)(keydata.alksRole, enc);
                        keydata.isIAM = isIAM;
                        dataOut.push(keydata);
                    }
                    catch (e) {
                        // console.warn('Error decrypting session data.', e.message);
                    }
                });
                resolve(dataOut);
            });
        });
    });
}
exports.getKeys = getKeys;
//# sourceMappingURL=getKeys.js.map