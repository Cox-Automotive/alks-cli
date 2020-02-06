/*jslint node: true */
'use strict';

var _        = require('underscore'),
    _s       = require('underscore.string'),
    fuzzy    = require('fuzzy'),
    exec     = require('child_process').exec,
    clc      = require('cli-color'),
    Table    = require('cli-table3'),
    path     = require('path'),
    os       = require('os'),
    fs       = require('fs'),
    npm      = require('npm-registry-client'),
    semVer   = require('semver'),
    chmod    = require('chmod'),
    inquirer = require('inquirer');

var exports = module.exports = {};

var programCacher = null,
    logger        = 'utils',
    accountRegex  = /([0-9]*)(\/)(ALKS)([a-zA-Z]*)([- ]*)([a-zA-Z0-9_-]*)/g;

function getChangeLog(){
    var file     = path.join(__dirname, '../', 'changelog.txt'),
        contents = fs.readFileSync(file, 'utf8');

    return contents;
}

exports.errorAndExit = function(errorMsg, errorObj){
    console.error(clc.red(errorMsg));
    if(errorObj){
        console.error(clc.red(JSON.stringify(errorObj, null, 4)));
    }
    process.exit(1);
};

exports.deprecationWarning = function(msg){
    msg = '\nWarning: ' + (_.isEmpty(msg) ? 'This command is being deprecated.' : msg);
    console.error(clc.red.bold(msg));
};

exports.getDBFile = function(){
    var path = process.env.ALKS_DB || exports.getFilePathInHome('alks.db');

    // if we have a db, chmod it
    if(fs.existsSync(path)){
        chmod(path, exports.getOwnerRWOnlyPermission());
    }

    return path;
};

exports.isWindows = function(){
    var platform = (process.env.PLATFORM) ? process.env.PLATFORM : process.platform;
    return /^win/.test(platform);
};

exports.isOSX = function(){
    return 'darwin' === process.platform;
};

exports.getFilePathInHome = function(filename){
    return path.join((process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH), filename);
};

exports.getOutputValues = function(){
    // if adding new output types be sure to update keys.js:getKeyOutput
    return [ 'env', 'json', 'docker', 'creds', 'idea', 'export', 'set', 'powershell', 'fishshell', 'terraformenv', 'terraformarg', 'aws' ];
};

exports.trim = function(str){
    if(_.isEmpty(str)) return str;

    return _s(str).trim().value();
};

exports.obfuscate = function(str){
    if(_.isEmpty(str)) return '';

    var s1 = Math.floor(str.length * 0.3),
        obfuscated = [str.substring(0, s1)];

    _.times(str.length - s1, function(){
        obfuscated.push('*');
    });

    return obfuscated.join('');
};

exports.addNewLineToEOF = function(file){
    fs.appendFile(file, os.EOL, function(err){
        if(err) exports.errorAndExit('Error adding new line!', err);
    });
};

exports.showBorderedMessage = function(cols, msg){
    var table = new Table({
        colWidths: [cols]
    });

    table.push([ msg ]);
    console.error(table.toString());
};

exports.subcommandSuggestion = function(program, subcommand){
    var commands         = _.map(program.commands, '_name'),
        requestedCommand = _.head(program.args);

    if(program.args.length && !_.includes(commands, requestedCommand)){
        var prefix   = ['alks', subcommand, ''].join(' '),
            msg      = [prefix, requestedCommand, ' is not a valid ALKS command.'],
            suggests = fuzzy.filter(requestedCommand, commands),
            suggest  = suggests.map(function(sug){ return sug.string; });

        if(suggest.length){
            msg.push(clc.white(' Did you mean '));
            msg.push(clc.white.underline(prefix + suggest[0]));
            msg.push(clc.white('?'));
        }

        exports.errorAndExit(msg.join(''));
    }
};

exports.isPasswordSecurelyStorable = function(){
    return exports.isOSX() || exports.isWindows();
};

exports.passwordSaveErrorHandler = function(err){
    console.error(clc.red('Error saving password!'), err.message);

    if(exports.isWindows()){
        console.error(clc.red('It looks like you\'re on Windows. This is most likely a script permission error. Please run: "Set-ExecutionPolicy -Scope CurrentUser remotesigned", press "Y" and try again.'));
    }
};

exports.isURL = function(url){
    var pattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

    if(pattern.test(url)){
        return true;
    }
    else{
        return 'Please enter a valid URL.';
    }
};

exports.log = function(program, section, msg){
    if(program && !programCacher) programCacher = program; // so hacky!

    if(programCacher && programCacher.verbose){
        console.error(clc.yellow([ '[', section, ']: ', msg ].join('')));
    }
};

exports.getOwnerRWOnlyPermission = function(){
    return {
        owner:  { read: true,  write: true,  execute: false },
        group:  { read: false, write: false, execute: false },
        others: { read: false, write: false, execute: false }
    };
};

exports.getBadAccountMessage = function(){
    return 'Unable to generate session, please validate your account and role.\nYour account should look like "123456789/ALKSPowerUser - awsfoonp" and your role should look like "PowerUser".\nBe sure to wrap them in quotes.';
};

exports.getAccountRegex = function(){
    return accountRegex;
};

exports.tryToExtractRole = function(account){
    var match;
    while(match = accountRegex.exec(account)){
        if(match && account.indexOf('ALKS_') === -1){ // ignore legacy accounts
            return match[4];
        }
    }

    return null;
};

exports.getUA = function(){
    return 'alks-cli';
};

exports.getStdErrPrompt = function(){
    return inquirer.createPromptModule({ output: process.stderr });
};

exports.checkForUpdate = function(callback){
    var pkg    = require(path.join(__dirname, '../', 'package.json')),
        myVer  = pkg.version,
        app    = pkg.name,
        noop   = function(){},
        noCB   = false,
        client = new npm({ log: { verbose:noop, info:noop, http:noop } });

    client.get('https://registry.npmjs.org/'+app+'/latest', { timeout: 1000 }, function (error, data){
        if(!error){
            var latestVer   = data.version,
                needsUpdate = semVer.gt(latestVer, myVer);

            if(!_.isFunction(callback)) callback = noop;

            exports.log(null, logger, 'needs update? ' + (needsUpdate ? 'yes' : 'no'));
            if(needsUpdate){
                var msg = [
                    clc.white('Update available '),
                    clc.blue(myVer),
                    clc.white(' → '),
                    clc.green(latestVer + '\n'),
                    clc.white('Run: '),
                    clc.green('npm i -g ' + app),
                    clc.white(' to update')
                ].join('');

                exports.showBorderedMessage(40, msg);
            }
            else{
                var Dev = require('./developer.js'), // stupid cyclic dependency!
                    currentVersion = pkg.version,
                    lastRunVerion  = Dev.getVersionAtStart();

                // check if they just updated
                if(lastRunVerion !== null && semVer.gt(currentVersion, lastRunVerion)){
                    exports.log(null, logger, 'user updated, updating db with version');
                    // give them release notes
                    exports.showBorderedMessage(110, clc.white(getChangeLog()));

                    // save the last version
                    noCB = true;
                    Dev.getDeveloper(function(err, developer){
                        exports.log(null, logger, 'db');
                        developer.lastVersion = currentVersion;
                        Dev.saveDeveloper(developer, callback);
                    });
                }
            }
        }
        if(!noCB) callback(null);
    });
};
