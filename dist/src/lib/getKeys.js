"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeys = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var isTokenAuth_1 = require("./isTokenAuth");
var underscore_1 = require("underscore");
var decrypt_1 = require("./decrypt");
var getKeysCollection_1 = require("./getKeysCollection");
var db_1 = require("./db");
function getKeys(auth, isIAM) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keys, now, enc, db;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, getKeysCollection_1.getKeysCollection)()];
                case 1:
                    keys = _a.sent();
                    now = (0, moment_1.default)();
                    enc = (0, isTokenAuth_1.isTokenAuth)(auth) ? auth.token : auth.password;
                    // first delete any expired keys
                    keys.removeWhere({ expires: { $lte: now.toDate() } });
                    return [4 /*yield*/, (0, db_1.getDb)()];
                case 2:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            // save the db to prune expired keys, wait for transaction to complete
                            db.save(function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                // now get valid keys, decrypt their values and return
                                var data = keys
                                    .chain()
                                    .find({ isIAM: { $eq: isIAM } })
                                    .simplesort('expires')
                                    .data();
                                var dataOut = [];
                                (0, underscore_1.each)(data, function (keydata) {
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
                        })];
            }
        });
    });
}
exports.getKeys = getKeys;
//# sourceMappingURL=getKeys.js.map