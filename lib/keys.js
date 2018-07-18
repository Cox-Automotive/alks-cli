/*jslint node: true */
'use strict';

var loki   = require('lokijs'),
    _      = require('underscore'),
    moment = require('moment'),
    fs     = require('fs'),
    crypto = require('crypto'),
    ini    = require('prop-ini'),
    clc    = require('cli-color'),
    lp     = require('left-pad'),
    utils  = require('./utils');

var exports = module.exports = {};

var db = new loki(utils.getDBFile());

var ALGORITHM = 'aes-256-cbc',
    ENCODING  = 'hex',
    PART_CHAR = ':',
    IV_LEN    = 16,
    ENC_LEN   = 32;

function getSizedEncryptionKey(key){
    // must be 256 bytes (32 characters)
    return lp(key, ENC_LEN, 0).substring(0, ENC_LEN);
}

function encrypt(text, key){
    if(_.isEmpty(text)) text = '';

    var iv     = crypto.randomBytes(IV_LEN),
        cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(getSizedEncryptionKey(key)), iv),
        encd   = cipher.update(text);

    encd = Buffer.concat([encd, cipher.final()]);

    return [iv.toString(ENCODING), encd.toString(ENCODING)].join(PART_CHAR);
}

function decrypt(text, key){
    if(_.isEmpty(text)) return '';

    var parts    = text.split(PART_CHAR),
        iv       = Buffer.from(parts.shift(), ENCODING),
        encd     = Buffer.from(parts.join(PART_CHAR), ENCODING),
        decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(getSizedEncryptionKey(key)), iv),
        decrypt  = decipher.update(encd);

    decrypt = Buffer.concat([decrypt, decipher.final()]);

    return decrypt.toString();
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
      if(!fs.existsSync(credPath)) {
          fs.mkdirSync(credPath);
      }
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

        var dataOut = [];
        _.each(data, function(keydata, i){
            // try catch here since we upgraded encryption and previously encrypted sessions will fail to decrypt
            try{
                keydata.accessKey    = decrypt(keydata.accessKey, password);
                keydata.secretKey    = decrypt(keydata.secretKey, password);
                keydata.sessionToken = decrypt(keydata.sessionToken, password);
                keydata.alksAccount  = decrypt(keydata.alksAccount, password);
                keydata.alksRole     = decrypt(keydata.alksRole, password);
                keydata.isIAM        = isIAM;
                dataOut.push(keydata);
            } catch(e){
                // console.warn('Error decrypting session data.', e.message);
            }
        });

        callback(null, dataOut);
    });
};

// if adding new output types be sure to update utils.js:getOutputValues
exports.getKeyOutput = function(format, key, profile, force){
    // strip un-needed data
    _.each([ 'meta', '$loki', 'isIAM', 'alksAccount', 'alksRole' ], function(attr){
        delete key[attr];
    });

    var keyExpires = moment(key.expires).format();

    if(format === 'docker'){
        return [
            ' -e AWS_ACCESS_KEY_ID=', key.accessKey,
            ' -e AWS_SECRET_ACCESS_KEY=', key.secretKey,
            ' -e AWS_SESSION_TOKEN=', key.sessionToken,
            ' -e AWS_SESSION_EXPIRES=', keyExpires
        ].join('');
    }
    else if(format === 'terraform'){
        return [
            ' -e ALKS_ACCESS_KEY_ID=', key.accessKey,
            ' -e ALKS_SECRET_ACCESS_KEY=', key.secretKey,
            ' -e ALKS_SESSION_TOKEN=', key.sessionToken,
            ' -e ALKS_SESSION_EXPIRES=', keyExpires
        ].join('');
    }
    else if(format === 'json'){
        return JSON.stringify(key, null, 4);
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
            'AWS_SESSION_TOKEN='+ key.sessionToken,
            'AWS_SESSION_EXPIRES='+ keyExpires
        ].join('\n');
    }
    else if(format === 'powershell'){
        return [
            '$env:AWS_ACCESS_KEY_ID, $env:AWS_SECRET_ACCESS_KEY, ',
            '$env:AWS_SESSION_TOKEN, $env:AWS_SESSION_EXPIRES = ',
            '"', key.accessKey, '","', key.secretKey, '","',
            key.sessionToken, '","', keyExpires, '"'
        ].join('');
    }
    else if(format === 'fishshell'){
      return [
        "set -xg AWS_ACCESS_KEY_ID '", key.accessKey, "'; and ",
        "set -xg AWS_SECRET_ACCESS_KEY '", key.secretKey, "'; and ",
        "set -xg AWS_SESSION_TOKEN '", key.sessionToken, "'; and ",
        "set -xg AWS_SESSION_EXPIRES '", keyExpires, "';"
      ].join('');
    }
    else if(format === 'export' || format === 'set'){
        var cmd = format === 'export' ? 'export' : 'SET';

        return [
            cmd, ' AWS_ACCESS_KEY_ID=', key.accessKey, ' && ',
            cmd, ' AWS_SECRET_ACCESS_KEY=', key.secretKey, ' && ',
            cmd, ' AWS_SESSION_TOKEN=', key.sessionToken,  ' && ',
            cmd, ' AWS_SESSION_EXPIRES=', keyExpires
        ].join('');        
    }
    else{
        var cmd = utils.isWindows() ? 'SET' : 'export';

        return [
            cmd, ' AWS_ACCESS_KEY_ID=', key.accessKey, ' && ',
            cmd, ' AWS_SECRET_ACCESS_KEY=', key.secretKey, ' && ',
            cmd, ' AWS_SESSION_TOKEN=', key.sessionToken,  ' && ',
            cmd, ' AWS_SESSION_EXPIRES=', keyExpires
        ].join('');
    }
};
