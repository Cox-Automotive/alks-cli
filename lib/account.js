/*jslint node: true */
'use strict';

var prompt = require('prompt'),
    _      = require('underscore'),
    utils  = require('./utils');

var exports = module.exports = {};

exports.getPassword = function(program, callback){
    // first check password from CLI argument
    if(!_.isEmpty(program.password)){
        return callback(null, program.password);
    }
    // then check for an environment variable
    else if(!_.isEmpty(process.env.ALKS_PASSWORD)){
        return callback(null, process.env.ALKS_PASSWORD);
    }
    // otherwise prompt the user
    else{
        prompt.start();
        prompt.message = '';
        prompt.get([{
            name: 'password',
            description: 'Password for ' + utils.getConfig().ALKS_USERID,
            hidden: true,
            required: true
        }], function(err, result){
            if(err){
                callback(err);
            }
            else{
                callback(null, result.password);
            }
        });
    }
};