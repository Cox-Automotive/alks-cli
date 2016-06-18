/*jslint node: true */
'use strict';

var _        = require('underscore'),
    clc      = require('cli-color'),
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
        server: process.env.SERVER,
        username: process.env.USERNAME,
        account: process.env.ACCOUNT,
        role: process.env.ROLE
    };
};
