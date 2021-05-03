"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksServerStart = void 0;
var tslib_1 = require("tslib");
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var child_process_1 = require("child_process");
var path_1 = tslib_1.__importDefault(require("path"));
var errorAndExit_1 = require("../errorAndExit");
var isOsx_1 = require("../isOsx");
var forever_1 = tslib_1.__importDefault(require("forever"));
var log_1 = require("../log");
var fs_1 = tslib_1.__importDefault(require("fs"));
function runServerDaemon() {
    console.error(cli_color_1.default.white('Starting metadata server..'));
    forever_1.default.startDaemon(path_1.default.join(__dirname, '../lib') + '/metadata-server.js', {
        uid: 'alks-metadata',
        root: path_1.default.join(__dirname, '../'),
    });
    console.error(cli_color_1.default.white('Metadata server now listening on: 169.254.169.254'));
}
function handleAlksServerStart(_options, program) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var logger, servicePath;
        return tslib_1.__generator(this, function (_a) {
            try {
                logger = 'server-start';
                if (!isOsx_1.isOsx()) {
                    errorAndExit_1.errorAndExit('The metadata server is only supported on OSX.');
                }
                log_1.log(program, logger, 'Checking if forwarding daemon is already installed..');
                if (!fs_1.default.existsSync('/etc/pf.anchors/com.coxautodev.alks')) {
                    console.error(cli_color_1.default.white('Installing metadata daemon rules. You may be prompted for your system password since this requires escalated privileges.'));
                    servicePath = path_1.default.join(__dirname, '../service');
                    try {
                        log_1.log(program, logger, 'Adding pf.anchor');
                        child_process_1.execSync('sudo cp ' + servicePath + '/com.coxautodev.alks /etc/pf.anchors/');
                        log_1.log(program, logger, 'Adding launch daemon');
                        child_process_1.execSync('sudo cp ' +
                            servicePath +
                            '/com.coxautodev.alks.Ec2MetaDataFirewall.plist /Library/LaunchDaemons/');
                        log_1.log(program, logger, 'Loading launch daemon');
                        child_process_1.execSync('sudo launchctl load -w /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist');
                    }
                    catch (err) {
                        console.log(cli_color_1.default.red('Error installing metadata daemon.'), err);
                    }
                    console.log(cli_color_1.default.white('Successfully installed metadata daemon.'));
                    runServerDaemon();
                }
                else {
                    log_1.log(program, logger, 'Daemon is already installed..');
                    runServerDaemon();
                }
            }
            catch (err) {
                errorAndExit_1.errorAndExit(err.message, err);
            }
            return [2 /*return*/];
        });
    });
}
exports.handleAlksServerStart = handleAlksServerStart;
//# sourceMappingURL=alks-server-start.js.map