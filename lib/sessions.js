var program    = require('commander'),
    clc        = require('cli-color'),
    async      = require('async'),
    _          = require('underscore'),
    alks       = require('alks-node'),
    config     = require('../package.json'),
    utils      = require('../lib/utils'),
    keys       = require('../lib/keys'),
    Developer  = require('../lib/developer');

exports.getSessionKey = function(program, logger, hasAlksAcctRole, alksAccount, alksRole, iamOnly, forceNewSession, cb){
    async.waterfall([
        // check to be sure were configured
        function(callback){
            Developer.ensureConfigured(callback);
        },
        // get developer
        function(callback){
            utils.log(program, logger, 'getting developer');
            Developer.getDeveloper(callback);
        },
        // get password
        function(developer, callback){
            utils.log(program, logger, 'getting password');
            Developer.getPassword(program, function(err, password){
                callback(err, developer, password);
            });
        },
        // get alks account
        function(developer, password, callback){
            // set password so they dont get prompted again
            program.password = password;

            // only lookup alks account if they didnt provide
            if(!hasAlksAcctRole){
                utils.log(program, logger, 'getting accounts');
                var opts = {};

                if(iamOnly) opts.iamOnly = true;

                Developer.getALKSAccount(program, opts, function(err, data){
                    if(err) callback(err);
                    else callback(null, developer, password, data.alksAccount, data.alksRole);
                });
            }
            else{
                utils.log(program, logger, 'using provided account/role');
                callback(null, developer, password, alksAccount, alksRole);
            }
        },
        // now retrieve existing keys
        function(developer, password, alksAccount, alksRole, callback){
            utils.log(program, logger, 'getting existing keys');
            keys.getKeys(password, false, function(err, keys){
                callback(null, developer, password, alksAccount, alksRole, keys);
            });
        },
        // look for existing session
        function(developer, password, alksAccount, alksRole, existingKeys, callback){
            if(existingKeys.length && !forceNewSession){
                utils.log(program, logger, 'filtering keys by account/role - ' + alksAccount + ' - ' + alksRole);

                // filter keys for the selected alks account/role
                var keyCriteria = { alksAccount: alksAccount, alksRole: alksRole },
                // filter, sort by expiration, grab last key to expire
                    selectedKey = _.last(_.sortBy(_.where(existingKeys, keyCriteria), 'expires'));

                if(selectedKey){
                    utils.log(program, logger, 'found existing valid key');
                    console.error(clc.white.underline([ 'Resuming existing session in', alksAccount, alksRole ].join(' ')));
                    return callback(null, selectedKey, developer, password);
                }
            }

            var duration = _.last(alks.getDurations());

            // generate a new key/session
            if(forceNewSession){
                utils.log(program, logger, 'forcing a new session');
            }
            utils.log(program, logger, 'calling api to generate new keys/session for ' + duration + ' hours');
            console.error(clc.white.underline([ 'Creating new session in', alksAccount, alksRole ].join(' ')));

            var data = _.extend(developer, { alksAccount: alksAccount, alksRole: alksRole });
            alks.createKey(data, password, duration, function(err, key){
                if(!err){
                    // store session data in DB
                    utils.log(program, logger, 'storing key: ' + JSON.stringify(key));
                    keys.addKey(key.accessKey, key.secretKey, key.sessionToken,
                                key.alksAccount, key.alksRole, key.expires.toDate(), password, false);
                }
                else if(err.message.indexOf('please check API URL') !== -1){
                    err = new Error(utils.getBadAccountMessage());
                }

                callback(err, key, developer, password);
            });
        }
    ], cb);
};