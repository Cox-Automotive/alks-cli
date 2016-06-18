#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

var path     = require('path'),
    clc      = require('cli-color'),
    path     = require('path'),
    _        = require('underscore'),
    program  = require('commander'),
    fs       = require('fs'),
    fuzzy    = require('fuzzy'),
    utils    = require('./utils'),
    pkg      = require(path.join(__dirname, '../', 'package.json'));

var config   = path.join((process.env.HOME || process.env.USERPROFILE), 'alks.env'),
    envVars  = [ 'SERVER', 'USERNAME', 'ACCOUNT', 'ROLE' ],
    haveVars = true,
    data     = [];

require('dotenv').load({ silent: true, path: config });
_.each(envVars, function(envVar){ if(_.isEmpty(process.env[envVar])){ haveVars = false; } });

if(!haveVars){
    utils.errorAndExit(
        'Missing required variables (' +
        envVars.join(', ') +
        '). Please ensure variables are in config file: ' +
        config);
}

program
    .command('keys', 'Manage ALKS Keys')
    .command('developer', 'Developer Information')
    .version(pkg.version);

function validateInvocation(){
    var commands         = _.map(program.commands, '_name'),
        requestedCommand = _.head(program.args);

    if(!program.args.length){
        return program.help();
    }
    else if(!_.includes(commands, requestedCommand)){
        var msg      = [requestedCommand, ' is not a valid ALKS command.'],
            suggests = fuzzy.filter(requestedCommand, commands),
            suggest  = suggests.map(function(sug){ return sug.string; });

        if(suggest.length){
            msg.push(clc.white(' Did you mean '));
            msg.push(clc.white.underline(suggest[0]));
            msg.push(clc.white('?'));
        }
        return utils.errorAndExit(msg.join(''));
    }
}

if(process.stdout.isTTY){
    console.error(clc.whiteBright.bold('ALKS v%s'), pkg.version);    
}

program.parse(process.argv);
validateInvocation();