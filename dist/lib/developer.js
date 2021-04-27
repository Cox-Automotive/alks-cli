/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackActivity = exports.getPassword = exports.getAuth = exports.getALKSAccount = exports.getMetadata = exports.saveMetadata = exports.getFavorites = exports.saveFavorites = exports.getDeveloper = exports.saveDeveloper = exports.ensureConfigured = exports.getToken = exports.removeToken = exports.storeToken = exports.getPasswordFromPrompt = exports.removePassword = exports.storePassword = exports.getPasswordFromKeystore = exports.getVersionAtStart = exports.getAccountDelim = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var lokijs_1 = tslib_1.__importDefault(require("lokijs"));
var clortho_1 = tslib_1.__importDefault(require("clortho"));
var node_netrc_1 = tslib_1.__importStar(require("node-netrc"));
var alks_1 = require("./alks");
var utils_1 = require("./utils");
var universal_analytics_1 = tslib_1.__importDefault(require("universal-analytics"));
var chmod_1 = tslib_1.__importDefault(require("chmod"));
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var clortho = clortho_1.default.forService('alkscli');
var ALKS_USERID = 'alksuid';
var ALKS_TOKEN = 'alkstoken';
var SERVICE = 'alkscli';
var SERVICETKN = 'alksclitoken';
var GA_ID = 'UA-88747959-1';
var db = new lokijs_1.default(utils_1.getDBFile());
var visitor = null;
var delim = ' :: ';
var logger = 'developer';
var vAtSt = null;
function getAccountDelim() {
    return delim;
}
exports.getAccountDelim = getAccountDelim;
function getVersionAtStart() {
    return vAtSt;
}
exports.getVersionAtStart = getVersionAtStart;
function getCollection(name) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.loadDatabase({}, function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        var collection = db.getCollection(name) || db.addCollection(name);
                        resolve(collection);
                    });
                })];
        });
    });
}
function getPasswordFromKeystore() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var data, e_1, auth;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!utils_1.isPasswordSecurelyStorable()) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, clortho.getFromKeychain(ALKS_USERID)];
                case 2:
                    data = _a.sent();
                    if (data) {
                        return [2 /*return*/, data.password];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [3 /*break*/, 6];
                case 5:
                    auth = node_netrc_1.default(SERVICE);
                    if (!underscore_1.isEmpty(auth.password)) {
                        return [2 /*return*/, auth.password];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getPasswordFromKeystore = getPasswordFromKeystore;
function storePassword(password) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(null, logger, 'storing password');
                    if (!utils_1.isPasswordSecurelyStorable()) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, clortho.saveToKeychain(ALKS_USERID, password)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/, true];
                case 5:
                    node_netrc_1.update(SERVICE, {
                        login: ALKS_USERID,
                        password: password,
                    });
                    chmod_1.default(utils_1.getFilePathInHome('.netrc'), utils_1.getOwnerRWOnlyPermission());
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.storePassword = storePassword;
function removePassword() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            utils_1.log(null, logger, 'removing password');
            if (utils_1.isPasswordSecurelyStorable()) {
                return [2 /*return*/, clortho.removeFromKeychain(ALKS_USERID)];
            }
            else {
                node_netrc_1.update(SERVICE, {});
            }
            return [2 /*return*/];
        });
    });
}
exports.removePassword = removePassword;
function getPasswordFromPrompt(text, currentPassword) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var answers;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(null, logger, 'getting password from prompt');
                    return [4 /*yield*/, utils_1.getStdErrPrompt()([
                            {
                                type: 'password',
                                name: 'password',
                                message: text ? text : 'Password',
                                default: function () {
                                    return underscore_1.isEmpty(currentPassword) ? '' : currentPassword;
                                },
                                validate: function (val) {
                                    return !underscore_1.isEmpty(val) ? true : 'Please enter a value for password.';
                                },
                            },
                        ])];
                case 1:
                    answers = _a.sent();
                    return [2 /*return*/, utils_1.trim(answers.password)];
            }
        });
    });
}
exports.getPasswordFromPrompt = getPasswordFromPrompt;
function storeToken(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(null, logger, 'storing token');
                    if (!utils_1.isPasswordSecurelyStorable()) return [3 /*break*/, 2];
                    return [4 /*yield*/, clortho.saveToKeychain(ALKS_TOKEN, token)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    node_netrc_1.update(SERVICETKN, {
                        password: token,
                    });
                    chmod_1.default(utils_1.getFilePathInHome('.netrc'), utils_1.getOwnerRWOnlyPermission());
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.storeToken = storeToken;
function removeToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            utils_1.log(null, logger, 'removing token');
            if (utils_1.isPasswordSecurelyStorable()) {
                return [2 /*return*/, clortho.removeFromKeychain(ALKS_TOKEN)];
            }
            else {
                node_netrc_1.update(SERVICETKN, {});
            }
            return [2 /*return*/];
        });
    });
}
exports.removeToken = removeToken;
function getToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var data, e_3, auth;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!utils_1.isPasswordSecurelyStorable()) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, clortho.getFromKeychain(ALKS_TOKEN)];
                case 2:
                    data = _a.sent();
                    if (data) {
                        return [2 /*return*/, data.password];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [3 /*break*/, 6];
                case 5:
                    auth = node_netrc_1.default(SERVICETKN);
                    if (!underscore_1.isEmpty(auth.password)) {
                        return [2 /*return*/, auth.password];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getToken = getToken;
function ensureConfigured() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var developer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDeveloper()];
                case 1:
                    developer = _a.sent();
                    if (!vAtSt)
                        vAtSt = developer.lastVersion;
                    // validate we have a valid configuration
                    if (underscore_1.isEmpty(developer.server) || underscore_1.isEmpty(developer.userid)) {
                        throw new Error('ALKS CLI is not configured. Please run: alks developer configure');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.ensureConfigured = ensureConfigured;
function saveDeveloper(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dev, e_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(null, logger, 'saving developer');
                    return [4 /*yield*/, getCollection('account')];
                case 1:
                    dev = _a.sent();
                    dev.removeDataOnly();
                    dev.insert({
                        server: utils_1.trim(data.server),
                        userid: utils_1.trim(data.userid),
                        alksAccount: utils_1.trim(data.alksAccount),
                        alksRole: utils_1.trim(data.alksRole),
                        lastAcctUsed: data.lastAcctUsed,
                        lastVersion: package_json_1.default.version,
                        outputFormat: utils_1.trim(data.outputFormat),
                    });
                    if (!(data.savePassword && !underscore_1.isEmpty(data.password))) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, storePassword(data.password)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    utils_1.passwordSaveErrorHandler(e_4);
                    return [3 /*break*/, 5];
                case 5:
                    if (!(!underscore_1.isUndefined(data.savePassword) && !data.savePassword)) return [3 /*break*/, 7];
                    return [4 /*yield*/, removePassword()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, new Promise(function (resolve, reject) {
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
exports.saveDeveloper = saveDeveloper;
function getDeveloper() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dev, data, resp;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCollection('account')];
                case 1:
                    dev = _a.sent();
                    data = dev.chain().data()[0];
                    resp = {
                        server: data ? data.server : null,
                        userid: data ? data.userid : null,
                        alksAccount: data ? data.alksAccount : null,
                        alksRole: data ? data.alksRole : null,
                        lastVersion: data ? data.lastVersion : null,
                        lastAcctUsed: data ? data.lastAcctUsed : null,
                        outputFormat: data ? data.outputFormat : null,
                    };
                    if (process.env.ALKS_SERVER) {
                        resp.server = process.env.ALKS_SERVER;
                    }
                    if (process.env.ALKS_USERID) {
                        resp.userid = process.env.ALKS_USERID;
                    }
                    return [2 /*return*/, resp];
            }
        });
    });
}
exports.getDeveloper = getDeveloper;
function saveFavorites(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var favorites;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(null, logger, 'saving favorites');
                    return [4 /*yield*/, getCollection('favorites')];
                case 1:
                    favorites = _a.sent();
                    favorites.removeDataOnly();
                    favorites.insert(data.accounts);
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
exports.saveFavorites = saveFavorites;
function getFavorites() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var favorites, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(null, logger, 'retreiving favorites');
                    return [4 /*yield*/, getCollection('favorites')];
                case 1:
                    favorites = _a.sent();
                    data = favorites.chain().data()[0];
                    if (data && data.favorites) {
                        return [2 /*return*/, data.favorites];
                    }
                    else {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getFavorites = getFavorites;
function saveMetadata(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var md;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(null, logger, 'saving metadata');
                    return [4 /*yield*/, getCollection('metadata')];
                case 1:
                    md = _a.sent();
                    md.removeDataOnly();
                    md.insert(data);
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
exports.saveMetadata = saveMetadata;
function getMetadata() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var md, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(null, logger, 'retreiving metadata');
                    return [4 /*yield*/, getCollection('metadata')];
                case 1:
                    md = _a.sent();
                    data = md.chain().data()[0];
                    return [2 /*return*/, data || []];
            }
        });
    });
}
exports.getMetadata = getMetadata;
function getALKSAccount(program, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var opts, developer, auth, alks, alksAccounts, favorites, indexedAlksAccounts, promptData, answers, acctStr, data, alksAccount, alksRole;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils_1.log(program, logger, 'retreiving alks account');
                    opts = underscore_1.extend({
                        iamOnly: false,
                        prompt: 'Please select an ALKS account/role',
                        dontDefault: false,
                        server: null,
                        userid: null,
                        filterFavorites: false,
                    }, options);
                    return [4 /*yield*/, getDeveloper()];
                case 1:
                    developer = _a.sent();
                    // setup defaults in case they are using this from `developer configure`
                    if (!opts.server)
                        opts.server = developer.server;
                    if (!opts.userid)
                        opts.userid = developer.userid;
                    return [4 /*yield*/, getAuth(program)];
                case 2:
                    auth = _a.sent();
                    return [4 /*yield*/, alks_1.getAlks({
                            baseUrl: opts.server,
                            token: auth.token,
                            userid: opts.userid,
                            password: auth.password,
                        })];
                case 3:
                    alks = _a.sent();
                    return [4 /*yield*/, alks.getAccounts()];
                case 4:
                    alksAccounts = _a.sent();
                    return [4 /*yield*/, getFavorites()];
                case 5:
                    favorites = _a.sent();
                    indexedAlksAccounts = alksAccounts
                        .filter(function (alksAccount) { return !opts.iamOnly || alksAccount.iamKeyActive; }) // Filter out non-iam-active accounts if iamOnly flag is passed
                        .filter(function (alksAccount) { return !opts.filterFavorites || favorites.contains(alksAccount); }) // Filter out non-favorites if filterFavorites flag is passed
                        .sort(function (a, b) { return favorites.includes(b) - favorites.includes(a); }) // Move favorites to the front of the list, non-favorites to the back
                        .map(function (alksAccount) {
                        return [alksAccount.account, alksAccount.role].join(getAccountDelim());
                    });
                    if (!indexedAlksAccounts.length) {
                        throw new Error('No accounts found.');
                    }
                    promptData = {
                        type: 'list',
                        name: 'alksAccount',
                        message: opts.prompt,
                        choices: indexedAlksAccounts,
                        pageSize: 15,
                    };
                    if (!opts.dontDefault) {
                        promptData.default = developer.lastAcctUsed;
                    }
                    return [4 /*yield*/, utils_1.getStdErrPrompt()([promptData])];
                case 6:
                    answers = _a.sent();
                    acctStr = answers.alksAccount;
                    data = acctStr.split(getAccountDelim());
                    alksAccount = data[0];
                    alksRole = data[1];
                    developer.lastAcctUsed = acctStr; // remember what account they last used
                    return [4 /*yield*/, saveDeveloper(developer)];
                case 7:
                    _a.sent();
                    // dont set these until we save or theyll overwrite the user's default account
                    developer.alksAccount = alksAccount;
                    developer.alksRole = alksRole;
                    return [2 /*return*/, developer];
            }
        });
    });
}
exports.getALKSAccount = getALKSAccount;
function getAuth(program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var auth, token, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    auth = {
                        token: null,
                        password: null,
                    };
                    if (program.auth) {
                        utils_1.log(program, logger, 'using cached auth object');
                        return [2 /*return*/, program.auth];
                    }
                    utils_1.log(program, logger, 'checking for access token');
                    return [4 /*yield*/, getToken()];
                case 1:
                    token = _b.sent();
                    if (!token) return [3 /*break*/, 2];
                    auth.token = token;
                    return [2 /*return*/, auth];
                case 2:
                    utils_1.log(program, logger, 'no access token found, falling back to password');
                    _a = auth;
                    return [4 /*yield*/, getPassword(program)];
                case 3:
                    _a.password = _b.sent();
                    return [2 /*return*/, auth];
            }
        });
    });
}
exports.getAuth = getAuth;
function getPassword(program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var password;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(program && !underscore_1.isEmpty(program.password))) return [3 /*break*/, 1];
                    // first check password from CLI argument
                    utils_1.log(program, logger, 'using password from CLI arg');
                    return [2 /*return*/, program.password];
                case 1:
                    if (!!underscore_1.isEmpty(process.env.ALKS_PASSWORD)) return [3 /*break*/, 2];
                    // then check for an environment variable
                    utils_1.log(program, logger, 'using password from environment variable');
                    return [2 /*return*/, process.env.ALKS_PASSWORD];
                case 2: return [4 /*yield*/, getPasswordFromKeystore()];
                case 3:
                    password = _a.sent();
                    if (!underscore_1.isEmpty(password)) {
                        utils_1.log(program, logger, 'using password from keystore');
                        return [2 /*return*/, password];
                    }
                    else {
                        // otherwise prompt the user (if we have program)
                        utils_1.log(program, logger, 'no password found, prompting user');
                        return [2 /*return*/, program ? getPasswordFromPrompt() : null];
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getPassword = getPassword;
function trackActivity(activity) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dev;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!visitor) return [3 /*break*/, 2];
                    return [4 /*yield*/, getDeveloper()];
                case 1:
                    dev = _a.sent();
                    utils_1.log(null, logger, 'creating tracker for: ' + dev.userid);
                    visitor = universal_analytics_1.default(GA_ID, dev.userid, { https: true, strictCidFormat: false });
                    _a.label = 2;
                case 2:
                    utils_1.log(null, logger, 'tracking activity: ' + activity);
                    visitor.event('activity', activity).send();
                    return [2 /*return*/];
            }
        });
    });
}
exports.trackActivity = trackActivity;
//# sourceMappingURL=developer.js.map