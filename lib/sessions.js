/*jslint node: true */
'use strict';

const clc = require('cli-color');
const _ = require('underscore');
const Alks = require('./alks');
const utils = require('../lib/utils');
const keys = require('./keys');
const Developer = require('./developer');
const moment = require('moment');

exports.getSessionKey = async function getSessionKey(
  program,
  logger,
  alksAccount,
  alksRole,
  iamOnly,
  forceNewSession,
  filterFavorites
) {
  await Developer.ensureConfigured();

  utils.log(program, logger, 'getting developer');
  const developer = await Developer.getDeveloper();

  utils.log(program, logger, 'getting auth');
  const auth = await Developer.getAuth(program);

  // set password so they dont get prompted again
  program.auth = auth;

  // only lookup alks account if they didnt provide
  if (_.isEmpty(alksAccount) || _.isEmpty(alksRole)) {
    utils.log(program, logger, 'getting accounts');
    const opts = {};

    if (iamOnly) opts.iamOnly = true;
    if (filterFavorites) opts.filterFavorites = true;

    ({ alksAccount, alksRole } = await Developer.getALKSAccount(program, opts));
  } else {
    utils.log(program, logger, 'using provided account/role');
  }

  utils.log(program, logger, 'getting existing keys');
  const existingKeys = await keys.getKeys(auth, false);

  if (existingKeys.length && !forceNewSession) {
    utils.log(
      program,
      logger,
      'filtering keys by account/role - ' + alksAccount + ' - ' + alksRole
    );

    // filter keys for the selected alks account/role
    const keyCriteria = { alksAccount, alksRole };
    // filter, sort by expiration, grab last key to expire
    const selectedKey = _.last(
      _.sortBy(_.where(existingKeys, keyCriteria), 'expires')
    );

    if (selectedKey) {
      utils.log(program, logger, 'found existing valid key');
      console.error(
        clc.white.underline(
          ['Resuming existing session in', alksAccount, alksRole].join(' ')
        )
      );
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

  utils.log(
    program,
    logger,
    'calling api to generate new keys/session for ' + duration + ' hours'
  );
  console.error(
    clc.white.underline(
      ['Creating new session in', alksAccount, alksRole].join(' ')
    )
  );

  let key;
  try {
    key = await alks.getKeys({
      account: alksAccount,
      role: alksRole,
      sessionTime: duration,
    });
  } catch (e) {
    throw new Error(utils.getBadAccountMessage());
  }
  key.expires = moment().add(duration, 'hours');

  utils.log(program, logger, 'storing key: ' + JSON.stringify(key));
  keys.addKey(
    key.accessKey,
    key.secretKey,
    key.sessionToken,
    alksAccount,
    alksRole,
    key.expires,
    auth,
    true
  );

  return key;
};
