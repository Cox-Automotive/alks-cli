/*jslint node: true */
'use strict';

const _ = require('underscore');
const _s = require('underscore.string');
const fuzzy = require('fuzzy');
const clc = require('cli-color');
const Table = require('cli-table3');
const path = require('path');
const os = require('os');
const fs = require('fs');
const chmod = require('chmod');
const inquirer = require('inquirer');
const config = require('../package.json');

let programCacher = null;
const accountRegex = /([0-9]*)(\/)(ALKS)([a-zA-Z]*)([- ]*)([a-zA-Z0-9_-]*)/g;

exports.errorAndExit = function errorAndExit(errorMsg, errorObj) {
    console.error(clc.red(errorMsg));
    if (errorObj) {
        console.error(clc.red(JSON.stringify(errorObj, null, 4)));
    }
    process.exit(1);
};

exports.deprecationWarning = function deprecationWarning(msg) {
    msg = `\nWarning: ${_.isEmpty(msg) ? 'This command is being deprecated.' : msg}`;
    console.error(clc.red.bold(msg));
};

exports.getDBFile = function getDBFile() {
    const path = process.env.ALKS_DB || exports.getFilePathInHome('alks.db');

    // if we have a db, chmod it
    if (fs.existsSync(path)) {
        chmod(path, exports.getOwnerRWOnlyPermission());
    }

    return path;
};

exports.isWindows = function isWindows() {
    const platform = process.env.PLATFORM || process.platform;
    return /^win/.test(platform);
};

exports.isOSX = function isOSX() {
    return 'darwin' === process.platform;
};

exports.getFilePathInHome = function getFilePathInHome(filename) {
    return path.join((process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH), filename);
};

exports.getOutputValues = function getOutputValues() {
    // if adding new output types be sure to update keys.js:getKeyOutput
    return [ 'env', 'json', 'docker', 'creds', 'idea', 'export', 'set', 'powershell', 'fishshell', 'terraformenv', 'terraformarg', 'aws' ];
};

exports.trim = function trim(str) {
    if (_.isEmpty(str)) {
        return str;
    }
    return _s(str).trim().value();
};

exports.obfuscate = function obfuscate(str) {
    if (_.isEmpty(str)) {
        return '';
    }

    const s1 = Math.floor(str.length * 0.3);
    const obfuscated = [str.substring(0, s1)];

    _.times(str.length - s1, () => {
        obfuscated.push('*');
    });

    return obfuscated.join('');
};

exports.addNewLineToEOF = function addNewLineToEOF(file) {
    try {
        fs.appendFileSync(file, os.EOL);
    } catch (err) {
        exports.errorAndExit('Error adding new line!', err);
    };
};

exports.showBorderedMessage = function showBorderedMessage(cols, msg) {
    const table = new Table({
        colWidths: [cols]
    });

    table.push([ msg ]);
    console.error(table.toString());
};

exports.subcommandSuggestion = function subcommandSuggestion(program, subcommand) {
    const commands = _.map(program.commands, '_name');
    const requestedCommand = _.head(program.args);

    if (program.args.length && !_.includes(commands, requestedCommand)) {
        const prefix = `alks ${subcommand}`;
        const msg = [prefix, requestedCommand, ' is not a valid ALKS command.'];
        const suggests = fuzzy.filter(requestedCommand, commands);
        const suggest = suggests.map((sug) => sug.string);

        if (suggest.length) {
            msg.push(clc.white(' Did you mean '));
            msg.push(clc.white.underline(prefix + suggest[0]));
            msg.push(clc.white('?'));
        }

        exports.errorAndExit(msg.join(''));
    }
};

exports.isPasswordSecurelyStorable = function isPasswordSecurelyStorable() {
    return exports.isOSX() || exports.isWindows();
};

exports.passwordSaveErrorHandler = function passwordSaveErrorHandler(err) {
    console.error(clc.red('Error saving password!'), err.message);

    if (exports.isWindows()) {
        console.error(clc.red('It looks like you\'re on Windows. This is most likely a script permission error. Please run: "Set-ExecutionPolicy -Scope CurrentUser remotesigned", press "Y" and try again.'));
    }
};

exports.isURL = function isURL(url) {
    const pattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

    return pattern.test(url) || 'Please enter a valid URL.';
};

exports.log = function log(program, section, msg) {
    if (program && !programCacher) programCacher = program; // so hacky!

    if (programCacher && programCacher.verbose) {
        console.error(clc.yellow([ '[', section, ']: ', msg ].join('')));
    }
};

exports.getOwnerRWOnlyPermission = function getOwnerRWOnlyPermission() {
    return {
        owner: { read: true, write: true, execute: false },
        group: { read: false, write: false, execute: false },
        others: { read: false, write: false, execute: false },
    };
};

exports.getBadAccountMessage = function getBadAccountMessage() {
    return 'Unable to generate session, please validate your account and role.\nYour account should look like "123456789/ALKSPowerUser - awsfoonp" and your role should look like "PowerUser".\nBe sure to wrap them in quotes.';
};

exports.getAccountRegex = function getAccountRegex() {
    return accountRegex;
};

exports.tryToExtractRole = function tryToExtractRole(account) {
    let match;
    while (match = accountRegex.exec(account)) {
        if (match && account.indexOf('ALKS_') === -1) { // ignore legacy accounts
            return match[4];
        }
    }
    return null;
};

exports.getUA = function getUA() {
    return `alks-cli/${config.version}`;
};

exports.getStdErrPrompt = function getStdErrPrompt() {
    return inquirer.createPromptModule({ output: process.stderr });
};

