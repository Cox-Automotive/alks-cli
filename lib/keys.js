/*jslint node: true */
'use strict';

var loki   = require('lokijs'),
    _      = require('underscore'),
    moment = require('moment'),
    crypto = require('crypto'),
    ini    = require('prop-ini'),
    utils  = require('./utils');

var exports = module.exports = {};

var db = new loki(utils.getDBFile());

var ALGORITHM = 'aes-256-ctr',
    CHARSET   = 'utf8',
    ENCODING  = 'hex';

function encrypt(text, key){
    var cipher  = crypto.createCipher(ALGORITHM, key),
        crypted = cipher.update(text, CHARSET, ENCODING);

    crypted += cipher.final(ENCODING);

    return crypted;
}

function decrypt(text, key){
    var decipher = crypto.createDecipher(ALGORITHM, key),
        decryptd = decipher.update(text, ENCODING, CHARSET);

    decryptd += decipher.final(CHARSET);

    return decryptd;
}

function getKeysCollection(callback){
    // have the DB load from disk
    db.loadDatabase({}, function(){
        // grab the keys collection
        var keys = db.getCollection('keys');
        // if its null this is a new run, create the collection
        if(keys === null){
            keys = db.addCollection('keys', { indices: ['expires'] });
        }

        callback(null, keys);
    });
}

function updateCreds(key, force){
    var credFile    = utils.getFilePathInHome('.aws/credentials'),
        propIni     = ini.createInstance(),
        awsCreds    = propIni.decode({ file: credFile }),
        section     = 'default';

    if(_.has(awsCreds.sections, section) && !force){
        utils.errorAndExit(section + ' already exists in AWS credentials. Please pass -f to force overwrite.');
    }
    
    propIni.addData(key.accessKey, section, 'aws_access_key_id');
    propIni.addData(key.secretKey, section, 'aws_secret_access_key');
    propIni.addData(key.sessionToken, section, 'aws_session_token');
    
    propIni.encode({ file: credFile });
}

exports.addKey = function(accessKey, secretKey, sessionToken, expires, password, callback){
    getKeysCollection(function(err, keys){
        keys.insert({ 
            accessKey:    encrypt(accessKey, password),
            secretKey:    encrypt(secretKey, password),
            sessionToken: encrypt(sessionToken, password),
            expires:      expires.getTime()
        });

        db.save(function(err, data){
            if(_.isFunction(callback)) callback(null);
        });
    });
};

exports.getKeys = function(password, callback){
    getKeysCollection(function(err, keys){
        var now = new Date().getTime();

        // first delete any expired keys
        keys.removeWhere({ expires : { '$lte': now } })
        db.save();

        // now get valid keys, decrypt their values and return
        var data = keys
                    .chain()
                    // .find({ expires : { '$gt': new Date().getTime() } })
                    .simplesort('expires')
                    .data();
        
        _.each(data, function(keydata, i){
            keydata.accessKey = decrypt(keydata.accessKey, password);
            keydata.secretKey = decrypt(keydata.secretKey, password);
            keydata.sessionToken = decrypt(keydata.sessionToken, password);
        });

        callback(null, data);
    });    
};

exports.getKeyOutput = function(format, key, force){
    // strip un-needed data
    _.each(['meta', '$loki', 'expires'], function(attr){
        delete key[attr];
    });

    if(format === 'docker'){
        return [
            ' -e AWS_ACCESS_KEY_ID=', key.accessKey,
            ' -e AWS_SECRET_ACCESS_KEY=', key.secretKey,
            ' -e AWS_SESSION_TOKEN=', key.sessionToken
        ].join('');
    }
    else if(format === 'env'){
        var cmd = utils.isWindows() ? 'SET' : 'export'
        return [
            cmd, ' AWS_ACCESS_KEY_ID=', key.accessKey, ' && ',
            cmd, ' AWS_SECRET_ACCESS_KEY=', key.secretKey, ' && ',
            cmd, ' AWS_SESSION_TOKEN=', key.sessionToken
        ].join('');
    }
    else if(format === 'creds'){
        updateCreds(key, force);
        return 'Your AWS credentials file has been updated.'
    }
    else{
        return JSON.stringify(key, null, 4);
    }
};