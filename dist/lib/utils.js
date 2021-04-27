/*jslint node: true */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStdErrPrompt = exports.getUA = exports.tryToExtractRole = exports.getAccountRegex = exports.getBadAccountMessage = exports.getOwnerRWOnlyPermission = exports.log = exports.isURL = exports.passwordSaveErrorHandler = exports.isPasswordSecurelyStorable = exports.subcommandSuggestion = exports.showBorderedMessage = exports.addNewLineToEOF = exports.obfuscate = exports.trim = exports.getOutputValues = exports.getFilePathInHome = exports.isOSX = exports.isWindows = exports.getDBFile = exports.deprecationWarning = exports.errorAndExit = void 0;
var tslib_1 = require("tslib");
var underscore_1 = require("underscore");
var fuzzy_1 = require("fuzzy");
var cli_color_1 = require("cli-color");
var cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
var path_1 = require("path");
var os_1 = require("os");
var fs_1 = require("fs");
var chmod_1 = tslib_1.__importDefault(require("chmod"));
var inquirer_1 = require("inquirer");
var package_json_1 = require("../package.json");
var programCacher;
var accountRegex = /([0-9]*)(\/)(ALKS)([a-zA-Z]*)([- ]*)([a-zA-Z0-9_-]*)/g;
function errorAndExit(errorMsg, errorObj) {
    console.error(cli_color_1.red(errorMsg));
    if (errorObj) {
        console.error(cli_color_1.red(JSON.stringify(errorObj, null, 4)));
    }
    process.exit(1);
}
exports.errorAndExit = errorAndExit;
function deprecationWarning(msg) {
    msg = "\nWarning: " + (underscore_1.isEmpty(msg) ? 'This command is being deprecated.' : msg);
    console.error(cli_color_1.red.bold(msg));
}
exports.deprecationWarning = deprecationWarning;
function getDBFile() {
    var path = process.env.ALKS_DB || getFilePathInHome('alks.db');
    // if we have a db, chmod it
    if (fs_1.existsSync(path)) {
        chmod_1.default(path, getOwnerRWOnlyPermission());
    }
    return path;
}
exports.getDBFile = getDBFile;
function isWindows() {
    var platform = process.env.PLATFORM || process.platform;
    return /^win/.test(platform);
}
exports.isWindows = isWindows;
function isOSX() {
    return 'darwin' === process.platform;
}
exports.isOSX = isOSX;
function getFilePathInHome(filename) {
    return path_1.join(process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH || '', filename);
}
exports.getFilePathInHome = getFilePathInHome;
function getOutputValues() {
    // if adding new output types be sure to update keys.js:getKeyOutput
    return [
        'env',
        'json',
        'docker',
        'creds',
        'idea',
        'export',
        'set',
        'powershell',
        'fishshell',
        'terraformenv',
        'terraformarg',
        'aws',
    ];
}
exports.getOutputValues = getOutputValues;
function trim(str) {
    if (underscore_1.isEmpty(str)) {
        return str;
    }
    return String(str).trim();
}
exports.trim = trim;
function obfuscate(str) {
    if (underscore_1.isEmpty(str)) {
        return '';
    }
    var s1 = Math.floor(str.length * 0.3);
    var obfuscated = [str.substring(0, s1)];
    underscore_1.times(str.length - s1, function () {
        obfuscated.push('*');
    });
    return obfuscated.join('');
}
exports.obfuscate = obfuscate;
function addNewLineToEOF(file) {
    try {
        fs_1.appendFileSync(file, os_1.EOL);
    }
    catch (err) {
        errorAndExit('Error adding new line!', err);
    }
}
exports.addNewLineToEOF = addNewLineToEOF;
function showBorderedMessage(cols, msg) {
    var table = new cli_table3_1.default({
        colWidths: [cols],
    });
    table.push([msg]);
    console.error(table.toString());
}
exports.showBorderedMessage = showBorderedMessage;
function subcommandSuggestion(program, subCommand) {
    var commands = underscore_1.map(program.commands, '_name');
    if (program.args.length && !underscore_1.includes(commands, subCommand)) {
        var prefix = "alks " + subCommand;
        var msg = [prefix, subCommand, ' is not a valid ALKS command.'];
        var suggests = fuzzy_1.filter(subCommand, commands);
        var suggest = suggests.map(function (sug) { return sug.string; });
        if (suggest.length) {
            msg.push(cli_color_1.white(' Did you mean '));
            msg.push(cli_color_1.white.underline(prefix + suggest[0]));
            msg.push(cli_color_1.white('?'));
        }
        errorAndExit(msg.join(''));
    }
}
exports.subcommandSuggestion = subcommandSuggestion;
function isPasswordSecurelyStorable() {
    return isOSX() || isWindows();
}
exports.isPasswordSecurelyStorable = isPasswordSecurelyStorable;
function passwordSaveErrorHandler(err) {
    console.error(cli_color_1.red('Error saving password!'), err.message);
    if (isWindows()) {
        console.error(cli_color_1.red('It looks like you\'re on Windows. This is most likely a script permission error. Please run: "Set-ExecutionPolicy -Scope CurrentUser remotesigned", press "Y" and try again.'));
    }
}
exports.passwordSaveErrorHandler = passwordSaveErrorHandler;
function isURL(url) {
    var pattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    return pattern.test(url) || 'Please enter a valid URL.';
}
exports.isURL = isURL;
function log(program, section, msg) {
    if (program && !programCacher)
        programCacher = program; // so hacky!
    if (programCacher && programCacher.verbose) {
        console.error(cli_color_1.yellow(['[', section, ']: ', msg].join('')));
    }
}
exports.log = log;
function getOwnerRWOnlyPermission() {
    return {
        owner: { read: true, write: true, execute: false },
        group: { read: false, write: false, execute: false },
        others: { read: false, write: false, execute: false },
    };
}
exports.getOwnerRWOnlyPermission = getOwnerRWOnlyPermission;
function getBadAccountMessage() {
    return 'Unable to generate session, please validate your account and role.\nYour account should look like "123456789/ALKSPowerUser - awsfoonp" and your role should look like "PowerUser".\nBe sure to wrap them in quotes.';
}
exports.getBadAccountMessage = getBadAccountMessage;
function getAccountRegex() {
    return accountRegex;
}
exports.getAccountRegex = getAccountRegex;
function tryToExtractRole(account) {
    var match;
    while ((match = accountRegex.exec(account))) {
        if (match && account.indexOf('ALKS_') === -1) {
            // ignore legacy accounts
            return match[4];
        }
    }
    return undefined;
}
exports.tryToExtractRole = tryToExtractRole;
function getUA() {
    return "alks-cli/" + package_json_1.version;
}
exports.getUA = getUA;
function getStdErrPrompt() {
    return inquirer_1.createPromptModule({ output: process.stderr });
}
exports.getStdErrPrompt = getStdErrPrompt;
//# sourceMappingURL=utils.js.map