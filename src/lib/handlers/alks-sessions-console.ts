import _ from 'underscore';
import commander, { OptionValues } from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { Key } from '../../model/keys';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getIamKey } from '../getIamKey';
import { getUserAgentString } from '../getUserAgentString';
import { log } from '../log';
import { tryToExtractRole } from '../tryToExtractRole';
import open from 'open';
import { getAlksAccount } from '../state/alksAccount';
import { getAlksRole } from '../state/alksRole';
import clc from 'cli-color';
import axios from 'axios';

const AWS_SIGNIN_URL = 'https://signin.aws.amazon.com/federation';
const AWS_CONSOLE_URL = 'https://console.aws.amazon.com/';
const DEFAULT_UA = 'alks-cli';
const SANITIZE_FIELDS = [
  'password',
  'refreshToken',
  'accessToken',
  'accessKey',
  'secretKey',
  'sessionToken',
];

function sanitizeData(data: any) {
  const cleansed: Record<string, any> = {};
  _.each(data, function (val, field) {
    cleansed[field] = _.contains(SANITIZE_FIELDS, field) ? '********' : val;
  });
  return cleansed;
}

export async function handleAlksSessionsConsole(
  options: commander.OptionValues
) {
  let alksAccount = options.account;
  let alksRole = options.role;
  const forceNewSession = options.newSession;
  const useDefaultAcct = options.default;
  const filterFaves = options.favorites || false;

  // Validation for ChangeAPI options
  const hasCiid = !!options.ciid;
  const hasActivityType = !!options.activityType;
  const hasDescription = !!options.description;
  const hasChgNumber = !!options.chgNumber;

  if (hasChgNumber) {
    // If chg-number is provided, do not require the other three
    if (hasCiid || hasActivityType || hasDescription) {
      errorAndExit(
        'Do not provide --ciid, --activity-type, or --description when using --chg-number.'
      );
    }
  } else if (hasCiid || hasActivityType || hasDescription) {
    // If any of the three is provided, all must be present
    if (!(hasCiid && hasActivityType && hasDescription)) {
      errorAndExit(
        'If any of --ciid, --activity-type, or --description is provided, all three must be specified.'
      );
    }
  }

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log('trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (useDefaultAcct) {
      alksAccount = await getAlksAccount();
      alksRole = await getAlksRole();
      if (!alksAccount || !alksRole) {
        errorAndExit('Unable to load default account!');
      }
    }

    let key: Key;
    try {
      key = await getIamKey(
        alksAccount,
        alksRole,
        forceNewSession,
        filterFaves,
        isUndefined(options.iam) ? false : true
      );
    } catch (err) {
      errorAndExit(err as Error);
    }

    log('calling aws to generate 15min console URL');

    const url = await generateConsoleUrl(key, options);

    if (options.url) {
      console.log(url);
    } else {
      const opts = !isEmpty(options.openWith) ? { app: options.openWith } : {};
      console.error(`Opening ${clc.underline(url)} in the browser...`);
      try {
        await Promise.race([
          open(url, {
            ...opts,
            newInstance: true,
          }),
          new Promise((_, rej) => {
            setTimeout(() => rej(), 5000);
          }), // timeout after 5 seconds
        ]);
      } catch (err) {
        console.error(`Failed to open ${url}`);
        console.error('Please open the url in the browser of your choice');
      }

      await checkForUpdate();
      await new Promise((resolve) => setTimeout(resolve, 3000)); // needed for if browser is still open
    }
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}

async function generateConsoleUrl(
  key: Key,
  options: OptionValues
): Promise<string> {
  const payload = {
    sessionId: key.accessKey,
    sessionKey: key.secretKey,
    sessionToken: key.sessionToken,
  };

  const optionsLocal = _.extend(
    {
      debug: false,
      ua: getUserAgentString() ?? DEFAULT_UA,
    },
    options
  );

  const urlParms = `?Action=getSigninToken&SessionType=json&Session=${encodeURIComponent(
    JSON.stringify(payload)
  )}`;
  const endpoint = AWS_SIGNIN_URL + urlParms;

  log(
    `api:generateConsoleUrl, generating console url at endpoint: ${endpoint}, ${optionsLocal}`
  );
  log(
    `api:generateConsoleUrl, with data: ${JSON.stringify(
      sanitizeData(payload),
      null,
      4
    )}, ${optionsLocal}`
  );
  log(`ua, ${optionsLocal.ua}, ${optionsLocal}`);

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(endpoint, {
        headers: { 'User-Agent': optionsLocal.ua },
      });

      if (response.status !== 200) {
        return reject(new Error(response.data));
      }

      const returnedData = response.data;

      if (!_.isEmpty(returnedData.SigninToken)) {
        const consoleUrl = [
          AWS_SIGNIN_URL,
          '?Action=login',
          '&Destination=',
          encodeURIComponent(AWS_CONSOLE_URL),
          '&SigninToken=',
          encodeURIComponent(returnedData.SigninToken),
        ].join('');

        return resolve(consoleUrl);
      } else {
        console.log(response.data);
        return reject(new Error('AWS didn’t return signin token!'));
      }
    } catch (err) {
      return reject(err);
    }
  });
}
