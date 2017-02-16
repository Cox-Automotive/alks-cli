/*jslint node: true */
'use strict';

var loki   = require('lokijs'),
    _      = require('underscore'),
    moment = require('moment'),
    fs     = require('fs'),
    crypto = require('crypto'),
    ini    = require('prop-ini'),
    clc    = require('cli-color'),
    utils  = require('./utils');

var exports = module.exports = {};

var db = new loki(utils.getDBFile());

var ALGORITHM = 'aes-256-ctr',
    CHARSET   = 'utf8',
    ENCODING  = 'hex';

function encrypt(text, key){
    if(_.isEmpty(text)) text = '';

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

        try{
            callback(null, keys);
        } catch(e){
            console.error('Error encountered during database keys transaction! Swallowing to preserve file integrity.');
            console.error(e);
        }
    });
}

function updateCreds(key, profile, force){
    var credPath = utils.getFilePathInHome('.aws'),
        credFile = credPath + '/credentials';

    // in case the user never ran `aws configure`..
    if(!fs.existsSync(credFile)){
        fs.mkdirSync(credPath);
        fs.closeSync(fs.openSync(credFile, 'w'));
    }

    var propIni     = ini.createInstance(),
        awsCreds    = propIni.decode({ file: credFile  }),
        section     = profile || 'default',
        accessKey   = 'aws_access_key_id',
        secretKey   = 'aws_secret_access_key',
        sessToken   = 'aws_session_token';

    if(_.has(awsCreds.sections, section)){
        if(force){
            // overwrite only the relevant keys and leave the rest of the section untouched
            propIni.addData(key.accessKey, section, accessKey);
            propIni.addData(key.secretKey, section, secretKey);
            propIni.addData(key.sessionToken, section, sessToken);
        }
        else{
            return false;
        }
    }
    else{
        // add brand new section
        var data = {};
        data[accessKey] = key.accessKey;
        data[secretKey] = key.secretKey;
        data[sessToken] = key.sessionToken;

        propIni.addData(data, section);
    }

    propIni.encode({ file: credFile  });

    // propIni doesnt add a new line, so running aws configure will cause issues
    utils.addNewLineToEOF(credFile);

    return true;
}

exports.addKey = function(accessKey, secretKey, sessionToken, alksAccount, alksRole, expires, password, isIAM, callback){
    getKeysCollection(function(err, keys){
        keys.insert({
            accessKey:    encrypt(accessKey, password),
            secretKey:    encrypt(secretKey, password),
            sessionToken: encrypt(sessionToken, password),
            alksAccount:  encrypt(alksAccount, password),
            alksRole:     encrypt(alksRole, password),
            isIAM:        isIAM,
            expires:      expires.getTime()
        });

        db.save(function(err, data){
            if(_.isFunction(callback)) callback(null);
        });
    });
};

exports.getKeys = function(password, isIAM, callback){
    getKeysCollection(function(err, keys){
        var now = new Date().getTime();

        // first delete any expired keys
        keys.removeWhere({ expires : { '$lte': now } });
        db.save();

        // now get valid keys, decrypt their values and return
        var data = keys
                    .chain()
                    .find({ isIAM : { '$eq': isIAM } })
                    .simplesort('expires')
                    .data();

        _.each(data, function(keydata, i){
            keydata.accessKey    = decrypt(keydata.accessKey, password);
            keydata.secretKey    = decrypt(keydata.secretKey, password);
            keydata.sessionToken = decrypt(keydata.sessionToken, password);
            keydata.alksAccount  = decrypt(keydata.alksAccount, password);
            keydata.alksRole     = decrypt(keydata.alksRole, password);
        });

        callback(null, data);
    });
};

exports.getKeyOutput = function(format, key, profile, force){
    // strip un-needed data
    _.each([ 'meta', '$loki', 'expires', 'alksAccount', 'alksRole' ], function(attr){
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
        if(updateCreds(key, profile, force)){
            var msg = ['Your AWS credentials file has been updated'];
            if(profile){
                msg.push(' with the named profile: ');
                msg.push(profile);
            }

            return msg.join('');
        }
        else{
            return clc.red('The ' + profile + ' profile already exists in AWS credentials. Please pass -f to force overwrite.');
        }
    }
    else if(format === 'idea'){
        return [
            'AWS_ACCESS_KEY_ID='+key.accessKey,
            'AWS_SECRET_ACCESS_KEY='+ key.secretKey,
            'AWS_SESSION_TOKEN='+ key.sessionToken
        ].join('\n');
    }
    else{
        return JSON.stringify(key, null, 4);
    }
};