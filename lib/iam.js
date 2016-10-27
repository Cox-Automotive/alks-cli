var program   = require('commander'),
    clc       = require('cli-color'),
    _         = require('underscore'),
    async     = require('async'),
    config    = require('../package.json'),
    alks      = require('./alks-api'),
    Developer = require('./developer'),
    keys      = require('./keys'),
    utils     = require('./utils');

exports.getIAMKey = function(program, logger, hasAlksAcctRole, alksAccount, alksRole, cb){
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
                Developer.getALKSAccount(program, { iamOnly: true }, function(err, data){
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
            keys.getKeys(password, true, function(err, keys){
                utils.log(program, logger, 'got existing keys');
                callback(err, developer, password, alksAccount, alksRole, keys);
            });
        },
        // look for existing session
        function(developer, password, alksAccount, alksRole, existingKeys, callback){
            if(existingKeys.length){
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

            // generate a new key/session
            utils.log(program, logger, 'calling api to generate new keys/session');
            console.error(clc.white.underline([ 'Creating new session in', alksAccount, alksRole ].join(' ')));

            var data = _.extend(developer, { alksAccount: alksAccount, alksRole: alksRole });
            alks.createIamKey(data, password, function(err, key){
                if(!err){
                    utils.log(program, logger, 'storing key: ' + JSON.stringify(key));
                    keys.addKey(key.accessKey, key.secretKey, key.sessionToken,
                                key.alksAccount, key.alksRole, key.expires.toDate(), password, true);
                }

                callback(err, key, developer, password);
            });
        }
    ], cb);
};