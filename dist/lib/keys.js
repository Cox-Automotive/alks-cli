/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyOutput = exports.getKeys = exports.addKey = void 0;
var tslib_1 = require("tslib");
var lokijs_1 = tslib_1.__importDefault(require("lokijs"));
var underscore_1 = require("underscore");
var moment_1 = tslib_1.__importDefault(require("moment"));
var fs_1 = require("fs");
var crypto_1 = require("crypto");
var prop_ini_1 = require("prop-ini");
var cli_color_1 = require("cli-color");
var left_pad_1 = tslib_1.__importDefault(require("left-pad"));
var utils_1 = require("./utils");
var db = new lokijs_1.default(utils_1.getDBFile());
var ALGORITHM = 'aes-256-cbc';
var ENCODING = 'hex';
var PART_CHAR = ':';
var IV_LEN = 16;
var ENC_LEN = 32;
function getSizedEncryptionKey(key) {
    // must be 256 bytes (32 characters)
    return left_pad_1.default(key, ENC_LEN, 0).substring(0, ENC_LEN);
}
function encrypt(text, key) {
    if (underscore_1.isEmpty(text)) {
        text = '';
    }
    var iv = crypto_1.randomBytes(IV_LEN);
    var cipher = crypto_1.createCipheriv(ALGORITHM, Buffer.from(getSizedEncryptionKey(key)), iv);
    var encd = Buffer.concat([cipher.update(text), cipher.final()]);
    return [iv.toString(ENCODING), encd.toString(ENCODING)].join(PART_CHAR);
}
function decrypt(text, key) {
    if (underscore_1.isEmpty(text)) {
        return '';
    }
    var parts = text.split(PART_CHAR);
    // Warning: if parts is empty, parts.shift() returns undefined and breaks Buffer.from(...)
    var iv = Buffer.from(parts.shift(), ENCODING);
    var encd = Buffer.from(parts.join(PART_CHAR), ENCODING);
    var decipher = crypto_1.createDecipheriv(ALGORITHM, Buffer.from(getSizedEncryptionKey(key)), iv);
    var decrypt = Buffer.concat([decipher.update(encd), decipher.final()]);
    return decrypt.toString();
}
function getKeysCollection() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    // have the DB load from disk
                    db.loadDatabase({}, function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        // grab the keys collection (if its null this is a new run, create the collection)
                        var keys = db.getCollection('keys') ||
                            db.addCollection('keys', { indices: ['expires'] });
                        resolve(keys);
                    });
                })];
        });
    });
}
function updateCreds(key, profile, force) {
    var credPath = utils_1.getFilePathInHome('.aws');
    var credFile = credPath + '/credentials';
    // in case the user never ran `aws configure`..
    if (!fs_1.existsSync(credFile)) {
        if (!fs_1.existsSync(credPath)) {
            fs_1.mkdirSync(credPath);
        }
        fs_1.closeSync(fs_1.openSync(credFile, 'w'));
    }
    var propIni = prop_ini_1.createInstance();
    var awsCreds = propIni.decode({ file: credFile });
    var section = profile || 'default';
    var accessKey = 'aws_access_key_id';
    var secretKey = 'aws_secret_access_key';
    var sessToken = 'aws_session_token';
    if (underscore_1.has(awsCreds.sections, section)) {
        if (force) {
            // overwrite only the relevant keys and leave the rest of the section untouched
            propIni.addData(key.accessKey, section, accessKey);
            propIni.addData(key.secretKey, section, secretKey);
            propIni.addData(key.sessionToken, section, sessToken);
        }
        else {
            return false;
        }
    }
    else {
        // add brand new section
        var data = {
            accessKey: key.accessKey,
            secretKey: key.secretKey,
            sessToken: key.sessionToken,
        };
        propIni.addData(data, section);
    }
    propIni.encode({ file: credFile });
    // propIni doesnt add a new line, so running aws configure will cause issues
    utils_1.addNewLineToEOF(credFile);
    return true;
}
function addKey(accessKey, secretKey, sessionToken, alksAccount, alksRole, expires, auth, isIAM) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var enc, keys;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    enc = auth.token || auth.password;
                    return [4 /*yield*/, getKeysCollection()];
                case 1:
                    keys = _a.sent();
                    keys.insert({
                        accessKey: encrypt(accessKey, enc),
                        secretKey: encrypt(secretKey, enc),
                        sessionToken: encrypt(sessionToken, enc),
                        alksAccount: encrypt(alksAccount, enc),
                        alksRole: encrypt(alksRole, enc),
                        isIAM: isIAM,
                        expires: expires.toDate(),
                    });
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
function getKeys(auth, isIAM) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var keys, now, enc;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getKeysCollection()];
                case 1:
                    keys = _a.sent();
                    now = moment_1.default();
                    enc = auth.token || auth.password;
                    // first delete any expired keys
                    keys.removeWhere({ expires: { $lte: now.toDate() } });
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
                                underscore_1.each(data, function (keydata) {
                                    // try catch here since we upgraded encryption and previously encrypted sessions will fail to decrypt
                                    try {
                                        keydata.accessKey = decrypt(keydata.accessKey, enc);
                                        keydata.secretKey = decrypt(keydata.secretKey, enc);
                                        keydata.sessionToken = decrypt(keydata.sessionToken, enc);
                                        keydata.alksAccount = decrypt(keydata.alksAccount, enc);
                                        keydata.alksRole = decrypt(keydata.alksRole, enc);
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
// if adding new output types be sure to update utils.js:getOutputValues
function getKeyOutput(format, key, profile, force) {
    // strip un-needed data
    ['meta', '$loki', 'isIAM', 'alksAccount', 'alksRole'].forEach(function (attr) {
        delete key[attr];
    });
    var keyExpires = moment_1.default(key.expires).format();
    switch (format) {
        case 'docker': {
            return "-e AWS_ACCESS_KEY_ID=" + key.accessKey + " -e AWS_SECRET_ACCESS_KEY=" + key.secretKey + " -e AWS_SESSION_TOKEN= " + key.sessionToken + " -e AWS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'terraformarg': {
            return "-e ALKS_ACCESS_KEY_ID=" + key.accessKey + " -e ALKS_SECRET_ACCESS_KEY=" + key.secretKey + " -e ALKS_SESSION_TOKEN=" + key.sessionToken + " -e ALKS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'tarraformenv': {
            var cmd = utils_1.isWindows() ? 'SET' : 'export';
            return cmd + " ALKS_ACCESS_KEY_ID=" + key.accessKey + " && " + cmd + " ALKS_SECRET_ACCESS_KEY=" + key.secretKey + " && " + cmd + " ALKS_SESSION_TOKEN=" + key.sessionToken + " && " + cmd + " ALKS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'json': {
            return JSON.stringify(key, null, 4);
        }
        case 'creds': {
            if (updateCreds(key, profile, force)) {
                var msg = 'Your AWS credentials file has been updated';
                if (profile) {
                    msg += " with the named profile: " + profile;
                }
                return msg;
            }
            else {
                return cli_color_1.red("The " + profile + " profile already exists in AWS credentials. Please pass -f to force overwrite.");
            }
        }
        case 'idea': {
            return "AWS_ACCESS_KEY_ID=" + key.accessKey + "\nAWS_SECRET_ACCESS_KEY=" + key.secretKey + "\nAWS_SESSION_TOKEN=" + key.sessionToken + "\nAWS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'powershell': {
            return "$env:AWS_ACCESS_KEY_ID, $env:AWS_SECRET_ACCESS_KEY, $env:AWS_SESSION_TOKEN, $env:AWS_SESSION_EXPIRES = \"" + key.accessKey + "\",\"" + key.secretKey + "\",\"" + key.sessionToken + "\",\"" + keyExpires + "\"";
        }
        case 'fishshell': {
            return "set -xg AWS_ACCESS_KEY_ID '" + key.accessKey + "'; and set -xg AWS_SECRET_ACCESS_KEY '" + key.secretKey + "'; and set -xg AWS_SESSION_TOKEN '" + key.sessionToken + "'; and set -xg AWS_SESSION_EXPIRES '" + keyExpires + "';";
        }
        case 'export': // fall through to case 'set'
        case 'set': {
            var cmd = format === 'export' ? 'export' : 'SET';
            return cmd + " AWS_ACCESS_KEY_ID=" + key.accessKey + " && " + cmd + " AWS_SECRET_ACCESS_KEY=" + key.secretKey + " && " + cmd + " AWS_SESSION_TOKEN=" + key.sessionToken + " && " + cmd + " AWS_SESSION_EXPIRES=" + keyExpires;
        }
        case 'aws': {
            return JSON.stringify({
                Version: 1,
                AccessKeyId: key.accessKey,
                SecretAccessKey: key.secretKey,
                SessionToken: key.sessionToken,
                Expiration: moment_1.default(key.expires).toISOString(),
            });
        }
        default: {
            var cmd = utils_1.isWindows() ? 'SET' : 'export';
            return cmd + " AWS_ACCESS_KEY_ID=" + key.accessKey + " && " + cmd + " AWS_SECRET_ACCESS_KEY=" + key.secretKey + " && " + cmd + " AWS_SESSION_TOKEN=" + key.sessionToken + " && " + cmd + " AWS_SESSION_EXPIRES=" + keyExpires;
        }
    }
}
exports.getKeyOutput = getKeyOutput;
//# sourceMappingURL=keys.js.map