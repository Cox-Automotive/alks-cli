/*jslint node: true */
'use strict';

var _        = require('underscore'),
    _s       = require('underscore.string'),
    fuzzy    = require('fuzzy'),
    clc      = require('cli-color'),
    Table    = require('cli-table2'),
    path     = require('path'),
    os       = require('os'),
    fs       = require('fs'),
    throbber = require('cli-color/throbber'),
    npm      = require('npm-registry-client'),
    semVer   = require('semver'),
    chmod    = require('chmod');

var exports = module.exports = {};

var programCacher = null;

throbber = throbber(function(str){
  process.stdout.write(str);
}, 200);

exports.startThrobber = function(program){
    if(process.stdout.isTTY) throbber.start();
};

exports.stopThrobber = function(program){
    if(process.stdout.isTTY) throbber.stop();
};

var errorAndExit = exports.errorAndExit = function(errorMsg, errorObj, requestData){
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
    var path = getFilePathInHome('alks.db');

    // if we have a db, chmod it
    if(fs.existsSync(path)){
        chmod(path, {
            owner:  { read: true,  write: true,  execute: false },
            group:  { read: false, write: false, execute: false },
            others: { read: false, write: false, execute: false }
        });
    }

    return path;
};

exports.isWindows = function(){
    return /^win/.test(process.platform);
};

var getFilePathInHome = exports.getFilePathInHome = function(filename){
    return path.join((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE), filename);
};

exports.getOutputValues = function(){
    return [ 'env', 'json', 'docker', 'creds', 'idea' ];
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
        if(err) errorAndExit('Error adding new line!', err);
    });
};

var showBorderedMessage = exports.showBorderedMessage = function(cols, msg){
    var table = new Table({
        colWidths: [cols]
    });

    table.push([ msg ]);
    console.error(table.toString());
};

exports.checkForUpdate = function(callback){
    var pkg    = require(path.join(__dirname, '../', 'package.json')),
        myVer  = pkg.version,
        app    = pkg.name,
        noop   = function(){},
        client = new npm({ log: { verbose:noop, info:noop, http:noop } });

    client.get('https://registry.npmjs.org/'+app+'/latest', { timeout: 1000 }, function (error, data, raw, res){
        if(!error){
            var latestVer   = data.version,
                needsUpdate = semVer.gt(latestVer, myVer);

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

                showBorderedMessage(40, msg);
            }
        }
        if(_.isFunction(callback)) callback(null);
    });
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

        errorAndExit(msg.join(''));
    }
};

exports.isPasswordSecurelyStorable = function(){
    return !(process.platform === 'darwin' || process.platform === 'win32');
};

exports.passwordSaveErrorHandler = function(err){
    console.error(clc.red('Error saving password!'), err.message);

    if(process.platform === 'win32'){
        console.error(clc.red('It looks like you\'re on Windows. This is most likely a script permission error. Please run: "Set-ExecutionPolicy -Scope CurrentUser remotesigned", press "Y" and try again.'));
    }
};

exports.isURL = function(url){
    var pattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

    return pattern.test(url);
};

exports.log = function(program, section, msg){
    if(program && !programCacher) programCacher = program; // so hacky!

    if(programCacher && programCacher.verbose){
        console.error([ '[', section, ']: ', msg ].join(''));
    }
};