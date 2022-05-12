"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksServerStart = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var child_process_1 = require("child_process");
var path_1 = tslib_1.__importDefault(require("path"));
var errorAndExit_1 = require("../errorAndExit");
var isOsx_1 = require("../isOsx");
var log_1 = require("../log");
var fs_1 = tslib_1.__importDefault(require("fs"));
function runServerDaemon() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.error(cli_color_1.default.white('Starting metadata server..'));
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('forever')); })];
                case 1:
                    // Dynamically import forever since it is an optional dependency
                    (_a.sent()).startDaemon(path_1.default.join(__dirname, '../lib') + '/metadata-server.js', {
                        uid: 'alks-metadata',
                        root: path_1.default.join(__dirname, '../'),
                    });
                    console.error(cli_color_1.default.white('Metadata server now listening on: 169.254.169.254'));
                    return [2 /*return*/];
            }
        });
    });
}
function handleAlksServerStart(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var servicePath, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!(0, isOsx_1.isOsx)()) {
                        (0, errorAndExit_1.errorAndExit)('The metadata server is only supported on OSX.');
                    }
                    (0, log_1.log)('Checking if forwarding daemon is already installed..');
                    if (!!fs_1.default.existsSync('/etc/pf.anchors/com.coxautodev.alks')) return [3 /*break*/, 2];
                    console.error(cli_color_1.default.white('Installing metadata daemon rules. You may be prompted for your system password since this requires escalated privileges.'));
                    servicePath = path_1.default.join(__dirname, '../service');
                    try {
                        (0, log_1.log)('Adding pf.anchor');
                        (0, child_process_1.execSync)('sudo cp ' + servicePath + '/com.coxautodev.alks /etc/pf.anchors/');
                        (0, log_1.log)('Adding launch daemon');
                        (0, child_process_1.execSync)('sudo cp ' +
                            servicePath +
                            '/com.coxautodev.alks.Ec2MetaDataFirewall.plist /Library/LaunchDaemons/');
                        (0, log_1.log)('Loading launch daemon');
                        (0, child_process_1.execSync)('sudo launchctl load -w /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist');
                    }
                    catch (err) {
                        console.log(cli_color_1.default.red('Error installing metadata daemon.'), err);
                    }
                    console.log(cli_color_1.default.white('Successfully installed metadata daemon.'));
                    return [4 /*yield*/, runServerDaemon()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    (0, log_1.log)('Daemon is already installed..');
                    return [4 /*yield*/, runServerDaemon()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    (0, errorAndExit_1.errorAndExit)(err_1.message, err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.handleAlksServerStart = handleAlksServerStart;
//# sourceMappingURL=alks-server-start.js.map