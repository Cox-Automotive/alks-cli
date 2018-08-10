#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

var program   = require('commander'),
    clc       = require('cli-color'),
    _         = require('underscore'),
    alks      = require('alks-node'),
    config    = require('../package.json'),
    utils     = require('../lib/utils'),
    Developer = require('../lib/developer');

program
    .version(config.version)
    .description('exchanges 2FA token for access token')
    .option('-v, --verbose', 'be verbose')
    .parse(process.argv);

var logger = 'dev-login-2fa';

Developer.getPasswordFromPrompt(function(err, fatoken){
    utils.log(program, logger, 'exchanging 2FA token for access token');
    
    utils.log(program, logger, 'loading developer');
    Developer.getDeveloper(function(err, data){
        alks.twoFAToAccessToken(data, fatoken, { debug: program.verbose, ua: utils.getUA() }, function(err, data){
            if(err){
                return utils.errorAndExit(err);
            }

            console.log('data is', data);
        });
    });


    utils.log(program, logger, 'checking for updates');
    utils.checkForUpdate();
    Developer.trackActivity(logger);
}, '2FA Token');