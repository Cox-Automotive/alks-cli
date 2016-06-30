/*jslint node: true */
'use strict';

var _        = require('underscore'),
    clc      = require('cli-color'),
    path     = require('path'),
    throbber = require('cli-color/throbber');

var exports = module.exports = {};

throbber = throbber(function(str){
  process.stdout.write(str);
}, 200);

exports.startThrobber = function(program){
    if(process.stdout.isTTY) throbber.start();
};

exports.stopThrobber = function(program){
    if(process.stdout.isTTY) throbber.stop();
};

exports.errorAndExit = function(errorMsg, errorObj, requestData){
    console.error(clc.red(errorMsg));
    if(errorObj){
        console.error(clc.red(JSON.stringify(errorObj, null, 4)));
    }
    process.exit(1);
};

exports.getConfig = function(){
    return {
        ALKS_SERVER: process.env.ALKS_SERVER,
        ALKS_USERID: process.env.ALKS_USERID,
        ALKS_ACCOUNT: process.env.ALKS_ACCOUNT,
        ALKS_ROLE: process.env.ALKS_ROLE
    };
};

exports.getConfigForRequest = function(){
    return {
        userid: process.env.ALKS_USERID,
        account: process.env.ALKS_ACCOUNT,
        role: process.env.ALKS_ROLE
    };
};

exports.isWindows = function(){
    return /^win/.test(process.platform);
};

exports.getFilePathInHome = function(filename){
    return path.join((process.env.HOME || process.env.USERPROFILE), filename)
};

exports.getOutputValues = function(){
    return [ 'json', 'env', 'docker', 'creds' ];
};