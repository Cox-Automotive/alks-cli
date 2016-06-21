/*jslint node: true */
'use strict';

var loki   = require('lokijs'),
    _      = require('underscore'),
    moment = require('moment'),
    utils  = require('./utils');

var exports = module.exports = {};

var db = new loki(utils.getFilePathInHome('alks.db')),
    FORMAT = 'MMMM Do YYYY, h:mm:ss a';

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

exports.addKey = function(accessKey, secretKey, sessionToken, expires, callback){
    getKeysCollection(function(err, keys){
        keys.insert({ 
            accessKey:    accessKey,
            secretKey:    secretKey,
            sessionToken: sessionToken,
            expires:      expires.getTime()
        });

        db.save(function(err, data){
            if(_.isFunction(callback)) callback(null);
        });
    });
};

exports.getKeys = function(callback){
    getKeysCollection(function(err, keys){
        var now = new Date().getTime();

        // first delete any expired keys
        keys.removeWhere({ expires : { '$lte': now } })
        db.save();

        // now return all the valid keys
        callback(null,
            keys
            .chain()
            // .find({ expires : { '$gt': new Date().getTime() } })
            .simplesort('expires')
            .data()
        );
    });    
};

exports.getKeyOutput = function(format, key){
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
    else{
        return JSON.stringify(key, null, 4);
    }
};