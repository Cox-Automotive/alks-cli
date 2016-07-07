/*jslint node: true */
'use strict';

var prompt = require('prompt'),
    _      = require('underscore'),
    keytar = require('keytar'),
    loki   = require('lokijs'),
    utils  = require('./utils');

var exports = module.exports = {};

var db = new loki(utils.getDBFile());

var SERVICE_NAME = 'alkscli';

function getAccountCollection(callback){
    // have the DB load from disk
    db.loadDatabase({}, function(){
        // grab the account collection
        var account = db.getCollection('account');
        // if its null this is a new run, create the collection
        if(account === null){
            console.log('recreating account collection')
            account = db.addCollection('account');
        }

        callback(null, account);
    });
}

function getPasswordFromKeystore(){
    return keytar.getPassword(
        SERVICE_NAME,
        utils.getConfig().ALKS_USERID
    );
}

var getPasswordFromPrompt = exports.getPasswordFromPrompt = function (callback, text, optional){
    prompt.start();
    prompt.message = '';
    prompt.get([{
        name: 'password',
        description: text ? text : 'Password for ' + utils.getConfig().ALKS_USERID,
        hidden: true,
        replace: '*',
        required: optional ? false : true
    }], function(err, result){
        if(err){
            callback(err);
        }
        else{
            callback(null, result.password);
        }
    });
};

exports.saveAccount = function(data, callback){
    getAccountCollection(function(err, accounts){
        accounts.removeDataOnly();

        accounts.insert({
            server: data.server,
            userid: data.userid,
            account: data.account,
            role: data.role
        });

        db.save(function(err, data){
            if(_.isFunction(callback)) callback(err, data);
        });

        if(data.password){
            storePassword(data.password);
        }
    });
};

exports.getAccount = function(callback){
    getAccountCollection(function(err, accounts){
        if(err){
            return callback(err);
        }
        var data = accounts.chain().data()[0];
        var resp = {
              server: data.server,
              userid: data.userid,
              account: data.account,
              role: data.role
        };
        callback(null, resp);
    });    
};

var storePassword = exports.storePassword = function(password){
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