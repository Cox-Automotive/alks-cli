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

var getMessageFromBadResponse = function(results){
    if(results.body){
        if(results.body.statusMessage){
            return results.body.statusMessage;
        }
    }

    return 'Bad response received, please check API URL.';
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
            return callback(new Error(getMessageFromBadResponse(results)));
        }

        callback(null, {
            accessKey:    results.body.accessKey,
            secretKey:    results.body.secretKey,
            sessionToken: results.body.sessionToken,
            consoleURL:   results.body.consoleURL,
            alksAccount:  account.alksAccount,
            alksRole:     account.alksRole
        }, account, password);
    });
};

exports.createIamKey = function(account, password, callback){
    var payload = _.extend({
        password: password,
        sessionTime: 1,
        account: account.alksAccount,
        role: account.alksRole
    }, account);

    request({
        url: account.server + '/getIAMKeys/',
        method: 'POST',
        json: payload
    }, function(err, results){
        if(err){
            return callback(err);
        }
        else if(results.statusCode !== 200){
            return callback(new Error(getMessageFromBadResponse(results)));
        }

        callback(null, {
            accessKey:    results.body.accessKey,
            secretKey:    results.body.secretKey,
            sessionToken: results.body.sessionToken,
            alksAccount:  account.alksAccount,
            alksRole:     account.alksRole
        }, account, password);
    });
};

exports.createIamRole = function(account, password, roleName, roleType, includeDefaultPolicies, callback){
    var payload = _.extend({
        password: password,
        account: account.alksAccount,
        role: account.alksRole,
        roleName: roleName,
        roleType: roleType,
        includeDefaultPolicy: includeDefaultPolicies ? '1' : '0'
    }, account);

    request({
        url: account.server + '/createRole/',
        method: 'POST',
        json: payload
    }, function(err, results){
        if(err){
            return callback(err);
        }
        else if(results.statusCode !== 200){
            return callback(new Error(getMessageFromBadResponse(results)));
        }

        callback(null, {
            accessKey:    results.body.accessKey,
            secretKey:    results.body.secretKey,
            responseMsg:  results.body.statusMessage,
            alksAccount:  account.alksAccount,
            alksRole:     account.alksRole
        }, account, password);
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
            return callback(new Error(getMessageFromBadResponse(results)));
        }

        var accounts = [];
        _.each(results.body.accountRoles, function(role, acct){
            accounts.push([acct, role[0]].join(ACCOUNT_SELECTION_DELIMITER));
        });

        accounts = _.sortBy(accounts, function(account){ return account; });

        callback(null, accounts);
    });
};

exports.getIamRoleTypes = function(server, userid, password, callback){
    request({
        url: server + '/getAWSRoleTypes/',
        method: 'POST',
        json: { userid: userid, password: password }
    }, function(err, results){
        if(err){
            return callback(err);
        }
        else if(results.statusCode !== 200){
            return callback(new Error(getMessageFromBadResponse(results)));
        }

        callback(null, JSON.parse(results.body.roleTypes));
    });
};