/*jslint node: true */
'use strict';

var prompt  = require('prompt'),
    _       = require('underscore'),
    loki    = require('lokijs'),
    clortho = require('clortho').forService('alkscli'),
    utils   = require('./utils');

var exports = module.exports = {};

var db = new loki(utils.getDBFile());

var ALKS_USERID = 'alksuid';

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

function getPasswordFromKeystore(cb){
    clortho.getFromKeychain(ALKS_USERID)
        .then(function(data){
            if(data){
                cb(data.password);
            }
            else{
                cb(null);
            }
        })
        .catch(function(err){
            cb(null);
        });
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
           _.isEmpty(account.alksAccount) ||
           _.isEmpty(account.alksRole)){
            callback(new Error('ALKS CLI is not configured. Please run: alks developer configure'), account);
        }
        else{
            callback(null);
        }
    });
};

exports.saveAccount = function(data, callback){
    getAccountCollection(function(err, accounts){
        accounts.removeDataOnly();

        accounts.insert({
            server: utils.trim(data.server),
            userid: utils.trim(data.userid),
            alksAccount: utils.trim(data.alksAccount),
            alksRole: utils.trim(data.alksRole)
        });

        if(data.savePassword && !_.isEmpty(data.password)){
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
              alksAccount: data ? data.alksAccount : null,
              alksRole: data ? data.alksRole : null
        };
        callback(null, resp);
    });
};

var storePassword = exports.storePassword = function(password){
    return clortho.saveToKeychain(ALKS_USERID, password);
};

exports.removePassword = function(){
    return clortho.removeFromKeychain(ALKS_USERID);
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
    else{
        getPasswordFromKeystore(function(password){
            if(!_.isEmpty(password)) return callback(null, password);
            else{
                // otherwise prompt the user (if we have program)
                return program ? getPasswordFromPrompt(callback) : callback(null);
            }
        });
    }
};