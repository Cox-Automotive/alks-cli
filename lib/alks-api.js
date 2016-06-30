/*jslint node: true */
'use strict';

var _       = require('underscore') ,
    request = require('request'),
    utils   = require('../lib/utils');

var exports = module.exports = {};

var ALKS_DURATIONS = [ 2, 6, 12, 18, 24, 36 ];

exports.getDurations = function(){
    return ALKS_DURATIONS;
};

exports.createKey = function(password, duration, callback){
    var payload = _.extend(
        {
            password: password,
            sessionTime: duration
        },
        utils.getConfigForRequest()
    );

    request({
        url: utils.getConfig().ALKS_SERVER + '/getKeys/',
        method: 'POST',
        json: payload
    }, function(err, results){
        if(err){
            return callback(err);
        }
        else if(results.statusCode !== 200){
            return callback(results.body.statusMessage);
        }
        
        callback(null, {
            accessKey:    results.body.accessKey,
            secretKey:    results.body.secretKey,
            sessionToken: results.body.sessionToken
        }, password);
    });    
};