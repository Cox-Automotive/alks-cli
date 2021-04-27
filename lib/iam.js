const clc = require('cli-color');
const _ = require('underscore');
const Alks = require('./alks');
const Developer = require('./developer');
const keys = require('./keys');
const utils = require('./utils');
const moment = require('moment');

exports.getIAMKey = async function getIAMKey(program, logger, alksAccount, alksRole, forceNewSession, filterFavorites) {
    await Developer.ensureConfigured();

    utils.log(program, logger, 'getting developer');
    const developer = await Developer.getDeveloper();

    utils.log(program, logger, 'getting auth');
    const auth = await Developer.getAuth(program);

    // set auth so they dont get prompted again
    program.auth = auth;

    // only lookup alks account if they didnt provide
    if (_.isEmpty(alksAccount) || _.isEmpty(alksRole)) {
        utils.log(program, logger, 'getting accounts');
        ({ alksAccount, alksRole } = await Developer.getALKSAccount(program, { iamOnly: true, filterFavorites: filterFavorites }));
    } else {
        utils.log(program, logger, 'using provided account/role');
    }

    utils.log(program, logger, 'getting existing keys');
    const existingKeys = await keys.getKeys(auth, true);
    utils.log(program, logger, 'got existing keys');

    if (existingKeys.length && !forceNewSession) {
        utils.log(program, logger, 'filtering keys by account/role - ' + alksAccount + ' - ' + alksRole);

        // filter keys for the selected alks account/role
        const keyCriteria = { alksAccount: alksAccount, alksRole: alksRole };
        // filter, sort by expiration, grab last key to expire
        const selectedKey = _.last(_.sortBy(_.where(existingKeys, keyCriteria), 'expires'));

        if (selectedKey) {
            utils.log(program, logger, 'found existing valid key');
            console.error(clc.white.underline([ 'Resuming existing session in', alksAccount, alksRole ].join(' ')));
            return selectedKey;
        }
    }

    // generate a new key/session
    if (forceNewSession) {
        utils.log(program, logger, 'forcing a new session');
    }

    const alks = await Alks.getAlks({
        baseUrl: developer.server,
        token: auth.token,
        userid: developer.userid,
        password: auth.password,
    });

    const loginRole = await alks.getLoginRole({                        
        accountId: alksAccount.slice(0, 12),
        role: alksRole,
    });

    const duration = Math.min(loginRole.maxKeyDuration, 12);

    console.error(clc.white.underline([ 'Creating new session in', alksAccount, alksRole ].join(' ')));

    let key;
    try {
        key = await alks.getIAMKeys({
            account: alksAccount,
            role: alksRole,
            sessionTime: duration,
        });
    } catch (e) {
        throw new Error(utils.getBadAccountMessage());
    }
    key.expires = moment().add(duration, 'hours');

    utils.log(program, logger, 'storing key: ' + JSON.stringify(key));
    keys.addKey(key.accessKey, key.secretKey, key.sessionToken,
                alksAccount, alksRole, key.expires, auth, true);

    return key;
};

exports.getIAMAccount = async function getIAMAccount(program, logger, alksAccount, alksRole, filterFavorites) {
    await Developer.ensureConfigured();

    utils.log(program, logger, 'getting developer');
    const developer = await Developer.getDeveloper();

    utils.log(program, logger, 'getting auth');
    const auth = await Developer.getAuth(program);

    // set auth so they dont get prompted again
    program.auth = auth;

    // only lookup alks account if they didnt provide
    if(_.isEmpty(alksAccount) || _.isEmpty(alksRole)){
        utils.log(program, logger, 'getting accounts');
        ({ alksAccount, alksRole } = await Developer.getALKSAccount(program, { iamOnly: true, filterFavorites: filterFavorites }));
    }
    else{
        utils.log(program, logger, 'using provided account/role' + alksAccount + ' ' + alksRole);
    }

    return {
        developer,
        auth,
        account: alksAccount,
        role: alksRole,
    }
};
