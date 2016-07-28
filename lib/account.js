/*jslint node: true */
'use strict';

var prompt = require('prompt'),
    _      = require('underscore'),
    keytar = require('keytar'),
    loki   = require('lokijs'),
    utils  = require('./utils');

var exports = module.exports = {};

var db = new loki(utils.getDBFile());

var SERVICE_NAME = 'alkscli',
    ALKS_USERID  = 'alksuid';

function getAccountCollection(callback){
    // have the DB load from disk
    db.loadDatabase({}, function(){
        // grab the account collection
        var account = db.getCollection('account');
        // if its null this is a new run, create the collection
        if(account === null){
            account = db.addCollection('account');
        }

        callback(null, account);
    });
}

function getPasswordFromKeystore(){
    return keytar.getPassword(
        SERVICE_NAME,
        ALKS_USERID
    );
}

var getPasswordFromPrompt = exports.getPasswordFromPrompt = function (callback, text, optional){
    prompt.start();
    prompt.message = '';
    prompt.get([{
        name: 'password',
        description: text ? text : 'Password',
        hidden: true,
        replace: '*',
        required: optional ? false : true
    }], function(err, result){
        if(err){
            callback(err);
        }
        else{
            callback(null, utils.trim(result.password));
        }
    });
};

exports.ensureConfigured = function(callback){
    getAccount(function(err, account){
        if(_.isEmpty(account.server)  || 
           _.isEmpty(account.userid)  ||
           _.isEmpty(account.account) ||
           _.isEmpty(account.role)){
            callback('boom', account);
        }
        else{
            callback(null, account);
        }
    });
};

exports.saveAccount = function(data, callback){
    getAccountCollection(function(err, accounts){
        accounts.removeDataOnly();

        accounts.insert({
            server: utils.trim(data.server),
            userid: utils.trim(data.userid),
            account: utils.trim(data.account),
            role: utils.trim(data.role)
        });

        if(data.password){
            storePassword(data.password);
        }

        db.save(function(err, data){
            if(_.isFunction(callback)) callback(err, data);
        });
    });
};

var getAccount = exports.getAccount = function(callback){
    getAccountCollection(function(err, accounts){
        if(err){
            return callback(err);
        }
        var data = accounts.chain().data()[0];
        var resp = {
              server: data ? data.server : null,
              userid: data ? data.userid : null,
              account: data ? data.account : null,
              role: data ? data.role : null
        };
        callback(null, resp);
    });    
};

var storePassword = exports.storePassword = function(password){
    return keytar.replacePassword(
        SERVICE_NAME,
        ALKS_USERID,
        password
    );
};

exports.removePassword = function(){
    return keytar.deletePassword(
        SERVICE_NAME,
        ALKS_USERID
    );
};

exports.getPassword = function(program, callback){
    // first check password from CLI argument
    if(program && !_.isEmpty(program.password)){
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
    // otherwise prompt the user (if we have program)
    else{
        return program ? getPasswordFromPrompt(callback) : callback(null);
    }
};