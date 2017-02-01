/*jslint node: true */
'use strict';

var prompt   = require('prompt'),
    _        = require('underscore'),
    async    = require('async'),
    loki     = require('lokijs'),
    clortho  = require('clortho').forService('alkscli'),
    netrc    = require('node-netrc'),
    inquirer = require('inquirer'),
    semVer   = require('semver'),
    path     = require('path'),
    clc      = require('cli-color'),
    alks     = require('alks-node'),
    utils    = require('./utils'),
    fs       = require('fs'),
    ua       = require('universal-analytics'),
    pkg      = require(path.join(__dirname, '../', 'package.json'));

var exports = module.exports = {};

var ALKS_USERID = 'alksuid',
    SERVICE     = 'alkscli',
    GA_ID       = 'UA-88747959-1';

var db      = new loki(utils.getDBFile()),
    visitor = null,
    logger  = 'developer';

function getDeveloperCollection(callback){
    // have the DB load from disk
    db.loadDatabase({}, function(){
        // grab the developer collection
        var developer = db.getCollection('account');
        // if its null this is a new run, create the collection
        if(developer === null){
            developer = db.addCollection('account');
        }

        try{
            callback(null, developer);
        } catch(e){
            console.error('Error encountered during database developer transaction! Swallowing to preserve file integrity.');
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

function getChangeLog(){
    var file     = path.join(__dirname, '../', 'changelog.txt'),
        contents = fs.readFileSync(file, 'utf8');

    return contents;
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
    getDeveloper(function(err, developer){
        // validate we have a valid configuration
        if(_.isEmpty(developer.server)  ||
           _.isEmpty(developer.userid)  ||
           _.isEmpty(developer.alksAccount) ||
           _.isEmpty(developer.alksRole)){
            callback(new Error('ALKS CLI is not configured. Please run: alks developer configure'), developer);
        }
        else{
            // since this is the first func to always get called check for update
            var currentVersion = pkg.version,
                lastRunVerion  = developer.lastVersion;

            // if they dont have a last version, set to current and save
            if(!lastRunVerion){
                developer.lastVersion = lastRunVerion = currentVersion;
                saveDeveloper(developer);
            }

            // check if they just updated
            if(semVer.gt(currentVersion, lastRunVerion)){
                // give them release notes
                utils.showBorderedMessage(90, clc.white(getChangeLog()));

                // save the last version
                developer.lastVersion = currentVersion;
                saveDeveloper(developer);
            }

            callback(null);
        }
    });
};

var saveDeveloper = exports.saveDeveloper = function(data, callback){
    getDeveloperCollection(function(err, dev){
        dev.removeDataOnly();

        dev.insert({
            server: utils.trim(data.server),
            userid: utils.trim(data.userid),
            alksAccount: utils.trim(data.alksAccount),
            alksRole: utils.trim(data.alksRole),
            lastVersion: pkg.version
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

var getDeveloper = exports.getDeveloper = function(callback){
    getDeveloperCollection(function(err, devs){
        if(err){
            return callback(err);
        }
        var data = devs.chain().data()[0];
        var resp = {
              server: data ? data.server : null,
              userid: data ? data.userid : null,
              alksAccount: data ? data.alksAccount : null,
              alksRole: data ? data.alksRole : null,
              lastVersion: data ? data.lastVersion : null
        };
        callback(null, resp);
    });
};

exports.getALKSAccount = function(program, options, callback){
    var opts = _.extend({
        iamOnly: false
    }, options);

    async.waterfall([
        // get developer
        function(cb){
            getDeveloper(cb);
        },
        // get password
        function(developer, cb){
            getPassword(program, function(err, password){
                cb(err, developer, password);
            });
        },
        // load available account/roles
        function(developer, password, cb){
            alks.getAccounts(developer.server, developer.userid, password, { filters: { iamOnly: opts.iamOnly } }, function(err, alksAccounts){
                var indexedAlksAccounts = [];

                _.each(alksAccounts, function(alksAccount, i){
                    var idx = (i+1) + ') '
                    if(i < 10) idx = ' ' + idx;
                    alksAccount = idx + alksAccount;
                    indexedAlksAccounts.push(alksAccount);
                });
                cb(err, developer, password, indexedAlksAccounts);
            });
        },
        // ask user which account/role
        function(developer, password, alksAccounts, cb){
            if(!alksAccounts.length){
                return cb(new Error('No accounts found.'));
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

                developer.alksAccount = alksAccount;
                developer.alksRole = alksRole;

                cb(null, developer);
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

exports.trackActivity = function(activity){
    var onComplete = function(){
        utils.log(null, logger, 'tracking activity: ' + activity);
        visitor.event('activity', activity).send();
    };

    if(!visitor){
        getDeveloper(function(err, dev){
            if(err){ return; }

            utils.log(null, logger, 'creating tracker for: ' + dev.userid);
            visitor = ua(GA_ID, dev.userid, { https: true, strictCidFormat: false }),
            onComplete();
        });
    }
    else{
        onComplete();
    }
};