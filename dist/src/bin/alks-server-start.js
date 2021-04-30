#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
process.title = 'ALKS';
var commander_1 = tslib_1.__importDefault(require("commander"));
var cli_color_1 = tslib_1.__importDefault(require("cli-color"));
var forever_1 = tslib_1.__importDefault(require("forever"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var child_process_1 = require("child_process");
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var errorAndExit_1 = require("../lib/errorAndExit");
var log_1 = require("../lib/log");
var isOsx_1 = require("../lib/isOsx");
commander_1.default
    .version(package_json_1.default.version)
    .description('starts the metadata server')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);
var logger = 'server-start';
if (!isOsx_1.isOsx()) {
    errorAndExit_1.errorAndExit('The metadata server is only supported on OSX.');
}
function runServerDaemon() {
    console.error(cli_color_1.default.white('Starting metadata server..'));
    forever_1.default.startDaemon(path_1.default.join(__dirname, '../lib') + '/metadata-server.js', {
        uid: 'alks-metadata',
        root: path_1.default.join(__dirname, '../'),
    });
    console.error(cli_color_1.default.white('Metadata server now listening on: 169.254.169.254'));
}
log_1.log(commander_1.default, logger, 'Checking if forwarding daemon is already installed..');
if (!fs_1.default.existsSync('/etc/pf.anchors/com.coxautodev.alks')) {
    console.error(cli_color_1.default.white('Installing metadata daemon rules. You may be prompted for your system password since this requires escalated privileges.'));
    var servicePath_1 = path_1.default.join(__dirname, '../service');
    (function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                try {
                    log_1.log(commander_1.default, logger, 'Adding pf.anchor');
                    child_process_1.execSync('sudo cp ' + servicePath_1 + '/com.coxautodev.alks /etc/pf.anchors/');
                    log_1.log(commander_1.default, logger, 'Adding launch daemon');
                    child_process_1.execSync('sudo cp ' +
                        servicePath_1 +
                        '/com.coxautodev.alks.Ec2MetaDataFirewall.plist /Library/LaunchDaemons/');
                    log_1.log(commander_1.default, logger, 'Loading launch daemon');
                    child_process_1.execSync('sudo launchctl load -w /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist');
                }
                catch (err) {
                    console.log(cli_color_1.default.red('Error installing metadata daemon.'), err);
                }
                console.log(cli_color_1.default.white('Successfully installed metadata daemon.'));
                runServerDaemon();
                return [2 /*return*/];
            });
        });
    })().catch(function (err) { return errorAndExit_1.errorAndExit(err.message, err); });
}
else {
    log_1.log(commander_1.default, logger, 'Daemon is already installed..');
    runServerDaemon();
}
//# sourceMappingURL=alks-server-start.js.map