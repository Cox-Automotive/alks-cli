import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { Key } from '../../model/keys';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getIamKey } from '../getIamKey';
import { getUserAgentString } from '../getUserAgentString';
import { log } from '../log';
import { tryToExtractRole } from '../tryToExtractRole';
import alksNode from 'alks-node';
import open from 'open';
import { getAlksAccount } from '../state/alksAccount';
import { getAlksRole } from '../state/alksRole';
import clc from 'cli-color';

export async function handleAlksSessionsConsole(
  options: commander.OptionValues
) {
  let alksAccount = options.account;
  let alksRole = options.role;
  const forceNewSession = options.newSession;
  const useDefaultAcct = options.default;
  const filterFaves = options.favorites || false;

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

    const url = await new Promise((resolve) => {
      alksNode.generateConsoleUrl(
        key,
        { debug: options.verbose, ua: getUserAgentString() },
        (err: Error, consoleUrl: string) => {
          if (err) {
            errorAndExit(err.message, err);
          } else {
            resolve(consoleUrl);
          }
        }
      );
    });

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
