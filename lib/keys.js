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
    var cipher  = crypto.createCipher(ALGORITHM, key.toString('binary')),
        crypted = cipher.update(text, CHARSET, ENCODING);

    crypted += cipher.final(ENCODING);

    return crypted;
}

function decrypt(text, key){
    if(_.isEmpty(text)) return '';
    
    var decipher = crypto.createDecipher(ALGORITHM, key.toString('binary')),
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

function updateCreds(key, profile, force){
    var credFile    = utils.getFilePathInHome('.aws/credentials'),
        propIni     = ini.createInstance(),
        awsCreds    = propIni.decode({ file: credFile, charset: 'us-ascii' }),
        section     = profile || 'default';

    if(_.has(awsCreds.sections, section) && !force){
        utils.errorAndExit('\nThe ' + section + ' profile already exists in AWS credentials. Please pass -f to force overwrite.');
    }

    propIni.addData({
        aws_access_key_id: key.accessKey,
        aws_secret_access_key: key.secretKey,
        aws_session_token: key.sessionToken
    }, section);

    propIni.encode({ file: credFile, charset: 'us-ascii' });

    // propIni doesnt add a new line, so running aws configure will cause issues
    utils.addNewLineToEOF(credFile);
    utils.addNewLineToEOF(credFile);
}

exports.addKey = function(accessKey, secretKey, sessionToken, alksAccount, expires, password, callback){
    getKeysCollection(function(err, keys){
        keys.insert({ 
            accessKey:    encrypt(accessKey, password),
            secretKey:    encrypt(secretKey, password),
            sessionToken: encrypt(sessionToken, password),
            alksAccount:  encrypt(alksAccount, password),
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
        keys.removeWhere({ expires : { '$lte': now } });
        db.save();

        // now get valid keys, decrypt their values and return
        var data = keys
                    .chain()
                    // .find({ expires : { '$gt': new Date().getTime() } })
                    .simplesort('expires')
                    .data();
        
        _.each(data, function(keydata, i){
            keydata.accessKey    = decrypt(keydata.accessKey, password);
            keydata.secretKey    = decrypt(keydata.secretKey, password);
            keydata.sessionToken = decrypt(keydata.sessionToken, password);
            keydata.alksAccount  = decrypt(keydata.alksAccount, password);
        });

        callback(null, data);
    });    
};

exports.getKeyOutput = function(format, key, profile, force){
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
        var cmd = utils.isWindows() ? 'SET' : 'export';
        return [
            cmd, ' AWS_ACCESS_KEY_ID=', key.accessKey, ' && ',
            cmd, ' AWS_SECRET_ACCESS_KEY=', key.secretKey, ' && ',
            cmd, ' AWS_SESSION_TOKEN=', key.sessionToken
        ].join('');
    }
    else if(format === 'creds'){
        updateCreds(key, profile, force);
        var msg = ['Your AWS credentials file has been updated'];
        if(profile){
            msg.push(' with the named profile: ');
            msg.push(profile);
        }

        return msg.join('');
    }
    else{
        return JSON.stringify(key, null, 4);
    }
};