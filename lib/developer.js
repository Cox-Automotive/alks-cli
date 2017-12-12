/*jslint node: true */
'use strict';

var _        = require('underscore'),
    async    = require('async'),
    loki     = require('lokijs'),
    clortho  = require('clortho').forService('alkscli'),
    netrc    = require('node-netrc'),
    path     = require('path'),
    alks     = require('alks-node'),
    utils    = require('./utils'),
    ua       = require('universal-analytics'),
    chmod    = require('chmod'),
    pkg      = require(path.join(__dirname, '../', 'package.json'));

var exports = module.exports = {};

var ALKS_USERID = 'alksuid',
    SERVICE     = 'alkscli',
    GA_ID       = 'UA-88747959-1';

var db      = new loki(utils.getDBFile()),
    visitor = null,
    delim   = ' :: ',
    logger  = 'developer',
    vAtSt   = null;

exports.getAccountDelim = function(){
    return delim;
};

exports.getVersionAtStart = function(){
    return vAtSt;
};

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

function getFavoritesCollection(callback){
    utils.log(null, logger, 'retreiving favorites collection');
    // have the DB load from disk
    db.loadDatabase({}, function(){
        // grab the developer collection
        var favorites = db.getCollection('favorites');
        // if its null this is a new run, create the collection
        if(favorites === null){
            favorites = db.addCollection('favorites');
        }

        try{
            callback(null, favorites);
        } catch(e){
            console.error('Error encountered during database favorites transaction! Swallowing to preserve file integrity.');
            console.error(e);
        }
    });
}

function getMetadataCollection(callback){
    utils.log(null, logger, 'retreiving metadata collection');
    // have the DB load from disk
    db.loadDatabase({}, function(){
        // grab the developer collection
        var metadata = db.getCollection('metadata');
        // if its null this is a new run, create the collection
        if(metadata === null){
            metadata = db.addCollection('metadata');
        }

        try{
            callback(null, metadata);
        } catch(e){
            console.error('Error encountered during database metadata transaction! Swallowing to preserve file integrity.');
            console.error(e);
        }
    });
}

exports.getPasswordFromKeystore = function(cb){
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

exports.storePassword = function(password, callback){
    utils.log(null, logger, 'storing password');
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

        chmod(utils.getFilePathInHome('.netrc'), utils.getOwnerRWOnlyPermission());

        callback(null, true);
    }
};

exports.removePassword = function(){
    utils.log(null, logger, 'removing password');
    if(utils.isPasswordSecurelyStorable()){
        return clortho.removeFromKeychain(ALKS_USERID);
    }
    else{
        netrc.update(SERVICE, {});
    }
};

exports.getPasswordFromPrompt = function (callback, text, currentPassword){
    utils.log(null, logger, 'getting password from prompt');
    utils.getStdErrPrompt()([{
        type: 'password',
        name: 'password',
        message: text ? text : 'Password',
        default: function(){
            return _.isEmpty(currentPassword) ? '' : currentPassword;
        },
        validate: function(val){
            return (!_.isEmpty(val)) ? true : 'Please enter a value for password.';
        }
    }]).then(function(answers){
        callback(null, utils.trim(answers['password']));
    });
};

exports.ensureConfigured = function(callback){
    exports.getDeveloper(function(err, developer){
        if(!vAtSt) vAtSt = developer.lastVersion;

        // validate we have a valid configuration
        if(_.isEmpty(developer.server)  ||
           _.isEmpty(developer.userid)){
            callback(new Error('ALKS CLI is not configured. Please run: alks developer configure'), developer);
        }
        else{
            callback();
        }
    });
};

exports.saveDeveloper = function(data, callback){
    utils.log(null, logger, 'saving developer');
    getDeveloperCollection(function(err, dev){
        dev.removeDataOnly();

        dev.insert({
            server: utils.trim(data.server),
            userid: utils.trim(data.userid),
            alksAccount: utils.trim(data.alksAccount),
            alksRole: utils.trim(data.alksRole),
            lastAcctUsed: data.lastAcctUsed, // dont trim, we need the space padding
            lastVersion: pkg.version,
            outputFormat: utils.trim(data.outputFormat)
        });

        // if they supplied a password and want to save then store it
        if(data.savePassword && !_.isEmpty(data.password)){
            exports.storePassword(data.password, function(err, saved){
                if(!saved){
                    utils.passwordSaveErrorHandler(err);
                }
            });
        }

        // otherwise clear any previously stored passwords if they said no
        if(!_.isUndefined(data.savePassword) && !data.savePassword){
            exports.removePassword();
        }

        db.save(function(err, data){
            if(_.isFunction(callback)) callback(err, data);
        });
    });
};

exports.getDeveloper = function(callback){
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
              lastVersion: data ? data.lastVersion : null,
              lastAcctUsed: data ? data.lastAcctUsed : null,
              outputFormat: data ? data.outputFormat : null
        };
        callback(null, resp);
    });
};

exports.saveFavorites = function(data, callback){
    utils.log(null, logger, 'saving favorites');
    getFavoritesCollection(function(err, fave){
        fave.removeDataOnly();

        fave.insert(data.accounts);

        db.save(function(err, data){
            if(_.isFunction(callback)) callback(err, data);
        });
    });
};

exports.getFavorites = function(callback){
    utils.log(null, logger, 'retreiving favorites');
    getFavoritesCollection(function(err, faves){
        if(err){
            return callback(err);
        }
        var data = faves.chain().data()[0];
        if(!data || !data.favorites) return callback(null, []);

        callback(null, { favorites: data.favorites });
    });
};

exports.saveMetadata = function(data, callback){
    utils.log(null, logger, 'saving metadata');
    getMetadataCollection(function(err, md){
        md.removeDataOnly();

        md.insert(data);

        db.save(function(err, data){
            if(_.isFunction(callback)) callback(err, data);
        });
    });
};

exports.getMetadata = function(callback){
    utils.log(null, logger, 'retreiving metadata');
    getMetadataCollection(function(err, md){
        if(err){
            return callback(err);
        }
        var data = md.chain().data()[0];
        if(!data) return callback(null, []);

        callback(null, data);
    });
};

exports.getALKSAccount = function(program, options, callback){
    utils.log(program, logger, 'retreiving alks account');
    var opts = _.extend({
        iamOnly: false,
        prompt: 'Please select an ALKS account/role',
        dontDefault: false,
        server: null,
        userid: null,
        filterFavorites: false
    }, options);

    async.waterfall([
        // get developer
        function(cb){
            exports.getDeveloper(cb);
        },
        // get password
        function(developer, cb){
            // setup defaults in case they are using this from `developer configure`
            if(!opts.server) opts.server = developer.server;
            if(!opts.userid) opts.userid = developer.userid;

            exports.getPassword(program, function(err, password){
                cb(err, developer, password);
            });
        },
        // load available account/roles
        function(developer, password, cb){
            alks.getAccounts(opts.server, opts.userid, password, { debug: program.verbose, ua: utils.getUA() }, function(err, alksAccounts){
                var indexedAlksAccounts = [];
                _.each(alksAccounts, function(alksAccount){
                    if(opts.iamOnly === true && alksAccount.iam === false) return;

                    alksAccount = [alksAccount.account, alksAccount.role].join(exports.getAccountDelim());
                    indexedAlksAccounts.push(alksAccount);
                });
                cb(err, developer, password, indexedAlksAccounts);
            });
        },
        // filter favorites
        function(developer, password, alksAccounts, cb){
            exports.getFavorites(function(err, favorites){
                if(err) return cb(err);

                // if they requested it filter the accounts to favorites
                if(opts.filterFavorites === true){
                    alksAccounts = _.filter(alksAccounts, function(acct){
                        return _.contains(favorites.favorites, acct);
                    });
                }
                // otherwise sort on favorites
                else{
                    var faves = [],
                        other = [];
                    _.each(alksAccounts, function(acct){
                        if(_.contains(favorites.favorites, acct)){
                            faves.push(acct);
                        }
                        else{
                            other.push(acct);
                        }
                    });

                    alksAccounts = faves.concat(other);
                }
                cb(null, developer, password, alksAccounts);
            });
        },
        // ask user which account/role
        function(developer, password, alksAccounts, cb){
            if(!alksAccounts.length){
                return cb(new Error('No accounts found.'));
            }

            var promptData = {
                    type: 'list',
                    name: 'alksAccount',
                    message: opts.prompt,
                    choices: alksAccounts,
                    pageSize: 15
            };

            if(!opts.dontDefault){
                promptData['default'] = developer.lastAcctUsed;
            }

            utils.getStdErrPrompt()([ promptData ]).then(function(answers){
                var acctStr     = answers.alksAccount,
                    data        = acctStr.split(exports.getAccountDelim()),
                    alksAccount = data[0],
                    alksRole    = data[1];

                developer.lastAcctUsed = acctStr; // remember what account they last used

                exports.saveDeveloper(developer, function(err, savedData){
                    // dont set these until we save or theyll overwrite the user's default account
                    developer.alksAccount = alksAccount;
                    developer.alksRole = alksRole;

                    cb(null, developer);
                });
            });
        },
    ], function(err, data){
        callback(err, data);
    });
};

exports.getPassword = function(program, callback){
    // first check password from CLI argument
    if(program && !_.isEmpty(program.password)){
        utils.log(program, logger, 'using password from CLI arg');
        return callback(null, program.password);
    }
    // then check for an environment variable
    else if(!_.isEmpty(process.env.ALKS_PASSWORD)){
        utils.log(program, logger, 'using password from environment varialbe');
        return callback(null, process.env.ALKS_PASSWORD);
    }
    // then check the keystore
    else{
        exports.getPasswordFromKeystore(function(password){
            if(!_.isEmpty(password)){
                utils.log(program, logger, 'using password from keystore');
                return callback(null, password);
            }
            else{
                // otherwise prompt the user (if we have program)
                utils.log(program, logger, 'no password found, prompting user');
                return program ? exports.getPasswordFromPrompt(callback) : callback(null);
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
        exports.getDeveloper(function(err, dev){
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