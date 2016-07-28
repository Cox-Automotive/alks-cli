/*jslint node: true */
'use strict';

var _       = require('underscore') ,
    request = require('request'),
    utils   = require('../lib/utils');

var exports = module.exports = {};

var ALKS_DURATIONS = [ 2, 6, 12, 18, 24, 36 ],
    ACCOUNT_SELECTION_DELIMITER  = ' :: ';

exports.getDurations = function(){
    return ALKS_DURATIONS;
};

exports.getAccountSelectorDelimiter = function(){
    return ACCOUNT_SELECTION_DELIMITER;
};

exports.createKey = function(account, password, duration, callback){
    var payload = _.extend({ 
        password: password, 
        sessionTime: duration,
        account: account.alksAccount,
        role: account.alksRole
    }, account); 

    request({
        url: account.server + '/getKeys/',
        method: 'POST',
        json: payload
    }, function(err, results){
        if(err){
            return callback(err);
        }
        else if(results.statusCode !== 200){
            return callback(new Error(results.body));
        }
    
        callback(null, {
            accessKey:    results.body.accessKey,
            secretKey:    results.body.secretKey,
            sessionToken: results.body.sessionToken
        }, password);
    });
};

exports.getAccounts = function(server, userid, password, callback){
    request({
        url: server + '/getAccounts/',
        method: 'POST',
        json: { userid: userid, password: password }
    }, function(err, results){
        if(err){
            return callback(err);
        }
        else if(results.statusCode !== 200){
            return callback(results.body.statusMessage);
        }

        var accounts = [];
        _.each(results.body.accountRoles, function(role, acct){
            accounts.push([acct, role[0]].join(ACCOUNT_SELECTION_DELIMITER));
        });

        callback(null, accounts);
    });
};