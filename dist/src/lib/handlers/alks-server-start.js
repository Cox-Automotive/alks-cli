"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAlksServerStart = void 0;
const tslib_1 = require("tslib");
const cli_color_1 = tslib_1.__importDefault(require("cli-color"));
const child_process_1 = require("child_process");
const path_1 = tslib_1.__importDefault(require("path"));
const errorAndExit_1 = require("../errorAndExit");
const isOsx_1 = require("../isOsx");
const log_1 = require("../log");
const fs_1 = tslib_1.__importDefault(require("fs"));
function runServerDaemon() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.error(cli_color_1.default.white('Starting metadata server..'));
        // Dynamically import forever since it is an optional dependency
        (yield Promise.resolve().then(() => tslib_1.__importStar(require('forever')))).startDaemon(path_1.default.join(__dirname, '../metadata-server.js'), {
            uid: 'alks-metadata',
            root: path_1.default.join(__dirname, '../../../../'),
        });
        console.error(cli_color_1.default.white('Metadata server now listening on: 169.254.169.254'));
    });
}
function handleAlksServerStart(_options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            if (!(0, isOsx_1.isOsx)()) {
                (0, errorAndExit_1.errorAndExit)('The metadata server is only supported on OSX.');
            }
            (0, log_1.log)('Checking if forwarding daemon is already installed..');
            if (!fs_1.default.existsSync('/etc/pf.anchors/com.coxautodev.alks')) {
                console.error(cli_color_1.default.white('Installing metadata daemon rules. You may be prompted for your system password since this requires escalated privileges.'));
                const servicePath = path_1.default.join(__dirname, '../../../../service');
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
                yield runServerDaemon();
            }
            else {
                (0, log_1.log)('Daemon is already installed..');
                yield runServerDaemon();
            }
        }
        catch (er) {
            const e = er;
            (0, errorAndExit_1.errorAndExit)(e.message, e);
        }
    });
}
exports.handleAlksServerStart = handleAlksServerStart;
//# sourceMappingURL=alks-server-start.js.map