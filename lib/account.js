/*jslint node: true */
'use strict';

var prompt   = require('prompt'),
    _        = require('underscore'),
    async    = require('async'),
    loki     = require('lokijs'),
    clortho  = require('clortho').forService('alkscli'),
    netrc    = require('node-netrc'),
    inquirer = require('inquirer'),
    alks     = require('./alks-api'),
    utils    = require('./utils');

var exports = module.exports = {};

var db = new loki(utils.getDBFile());

var ALKS_USERID = 'alksuid',
    SERVICE     = 'alkscli'

function getAccountCollection(callback){
    // have the DB load from disk
    db.loadDatabase({}, function(){
        // grab the account collection
        var account = db.getCollection('account');
        // if its null this is a new run, create the collection
        if(account === null){
            account = db.addCollection('account');
        }

        try{
            callback(null, account);
        } catch(e){
            console.error('Error encountered during database accounts transaction! Swallowing to preserve file integrity.');
            console.error(e);
        }
    });
}

function getPasswordFromKeystore(cb){
    if(utils.isPasswordSecurelyStorable()){
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
            }
        );
    }
    else{
        var auth = netrc(SERVICE);
        if(!_.isEmpty(auth.password)){
            cb(auth.password);
        }
        else{
            cb(null);
        }
    }
}

var storePassword = exports.storePassword = function(password, callback){
    if(utils.isPasswordSecurelyStorable()){
        return clortho.saveToKeychain(ALKS_USERID, password)
            .then(function(){
                callback(null, true);
            })
            .catch(function(e){
                callback(e, false);
            }
        );
    }
    else{
        netrc.update(SERVICE, {
            login: ALKS_USERID,
            password: password
        });

        callback(null, true);
    }
};

exports.removePassword = function(){
    if(utils.isPasswordSecurelyStorable()){
        return clortho.removeFromKeychain(ALKS_USERID);
    }
    else{
        netrc.update(SERVICE, {});
    }
};

var getPasswordFromPrompt = exports.getPasswordFromPrompt = function (callback, text){
    prompt.start();
    prompt.message = '';

    prompt.get([{
        name: 'password',
        description: text ? text : 'Password',
        hidden: true,
        replace: '*',
        required: true
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
            storePassword(data.password, function(err, saved){
                if(!saved){
                    utils.passwordSaveErrorHandler(err);
                }
            });
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

exports.getALKSAccount = function(program, autoSelectById, callback){
    async.waterfall([
        // get account
        function(cb){
            getAccount(cb);
        },
        // get password
        function(account, cb){
            getPassword(program, function(err, password){
                cb(err, account, password);
            });
        },
        // load available account/roles
        function(account, password, cb){
            alks.getAccounts(account.server, account.userid, password, function(err, alksAccounts){
                var indexedAlksAccounts = [];

                _.each(alksAccounts, function(alksAccount, i){
                    var idx = (i+1) + ') '
                    if(i < 10) idx = ' ' + idx;
                    alksAccount = idx + alksAccount;
                    indexedAlksAccounts.push(alksAccount);
                });
                cb(err, account, password, indexedAlksAccounts);
            });
        },
        // ask user which account/role (if autoSelect not provided)
        function(account, password, alksAccounts, cb){
            if(autoSelectById !== null){
                if(autoSelectById <= alksAccounts.length-1){
                    var data = alksAccounts[autoSelectById].substring(4).split(alks.getAccountSelectorDelimiter()),
                        alksAccount = data[0],
                        alksRole = data[1];

                    account.alksAccount = alksAccount;
                    account.alksRole = alksRole;
                    account.password = password;

                    return cb(null, account);

                }
                else{
                    return callback(new Error('Provided auto select ID out of bounds! Use 1-' + alksAccounts.length));
                }
            }

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'alksAccount',
                    message: 'Please select an ALKS account/role',
                    choices: alksAccounts
                }
            ]).then(function(answers){
                var data = answers.alksAccount.substring(4).split(alks.getAccountSelectorDelimiter()),
                    alksAccount = data[0],
                    alksRole = data[1];

                account.account = alksAccount;
                account.role = alksRole;

                cb(null, account);
            });
        },
    ], function(err, data){
        callback(err, data);
    });
};

var getPassword = exports.getPassword = function(program, callback){
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