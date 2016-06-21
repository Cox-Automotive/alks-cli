/*jslint node: true */
'use strict';

var prompt = require('prompt'),
    _      = require('underscore'),
    keytar = require('keytar'),
    utils  = require('./utils');

var exports = module.exports = {};

var SERVICE_NAME = 'alkscli';

function getPasswordFromKeystore(){
    return keytar.getPassword(
        SERVICE_NAME,
        utils.getConfig().ALKS_USERID
    );
}

function getPasswordFromPrompt(callback){
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

exports.storePassword = function(password){
    return keytar.replacePassword(
        SERVICE_NAME,
        utils.getConfig().ALKS_USERID,
        password
    );
};

exports.removePassword = function(){
    return keytar.deletePassword(
        SERVICE_NAME,
        utils.getConfig().ALKS_USERID
    );
};

exports.getPassword = function(program, callback){
    // first check password from CLI argument
    if(!_.isEmpty(program.password)){
        return callback(null, program.password);
    }
    // then check for an environment variable
    else if(!_.isEmpty(process.env.ALKS_PASSWORD)){
        return callback(null, process.env.ALKS_PASSWORD);
    }
    // then check the keystore
    else if(!_.isEmpty(getPasswordFromKeystore())){
        return callback(null, getPasswordFromKeystore());
    }
    // otherwise prompt the user
    else{
        return getPasswordFromPrompt(callback);
    }
};

exports.getPasswordFromPrompt = getPasswordFromPrompt;