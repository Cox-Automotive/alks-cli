"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForUpdate = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = require("cli-color");
var npm_registry_client_1 = tslib_1.__importDefault(require("npm-registry-client"));
var semver_1 = require("semver");
var package_json_1 = require("../../package.json");
var path_1 = tslib_1.__importDefault(require("path"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var log_1 = require("./log");
var showBorderedMessage_1 = require("./showBorderedMessage");
var lastVersion_1 = require("./state/lastVersion");
function noop() { }
function getChangeLog() {
    var file = path_1.default.join(__dirname, '../../', 'changelog.txt');
    return fs_1.default.readFileSync(file, 'utf8');
}
function checkForUpdate() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.race([
                        checkForUpdateInternal(),
                        // Force a timeout of 1 second
                        new Promise(function (resolve) {
                            setTimeout(function () {
                                log_1.log('check for update timed out. Skipping...');
                                resolve(undefined);
                            }, 1000);
                        }),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkForUpdate = checkForUpdate;
function checkForUpdateInternal() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var currentVersion, app, client, data, latestVersion, needsUpdate, msg, lastVersion;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log('checking for update...');
                    currentVersion = package_json_1.version;
                    app = package_json_1.name;
                    client = new npm_registry_client_1.default({ log: { verbose: noop, info: noop, http: noop } });
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            client.get("https://registry.npmjs.org/" + app + "/latest", { timeout: 1000 }, function (error, data) {
                                if (error) {
                                    reject(error);
                                }
                                else {
                                    resolve(data);
                                }
                            });
                        })];
                case 1:
                    data = _a.sent();
                    latestVersion = data.version;
                    needsUpdate = semver_1.gt(latestVersion, currentVersion);
                    log_1.log('needs update? ' + (needsUpdate ? 'yes' : 'no'));
                    if (!needsUpdate) return [3 /*break*/, 2];
                    msg = [
                        cli_color_1.white('Update available '),
                        cli_color_1.blue(currentVersion),
                        cli_color_1.white(' → '),
                        cli_color_1.green(latestVersion + '\n'),
                        cli_color_1.white('Run: '),
                        cli_color_1.green('npm i -g ' + app),
                        cli_color_1.white(' to update'),
                    ].join('');
                    showBorderedMessage_1.showBorderedMessage(40, msg);
                    return [3 /*break*/, 5];
                case 2: return [4 /*yield*/, lastVersion_1.getLastVersion()];
                case 3:
                    lastVersion = _a.sent();
                    if (!semver_1.gt(currentVersion, lastVersion)) return [3 /*break*/, 5];
                    log_1.log('user updated, updating db with version');
                    // give them release notes
                    showBorderedMessage_1.showBorderedMessage(110, cli_color_1.white(getChangeLog()));
                    // update the state to reflect that the last version run is the current version
                    log_1.log('db');
                    return [4 /*yield*/, lastVersion_1.setLastVersion(currentVersion)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=checkForUpdate.js.map