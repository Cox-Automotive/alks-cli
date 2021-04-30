import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { Key } from '../../model/keys';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getDeveloper } from '../getDeveloper';
import { getIamKey } from '../getIamKey';
import { getSessionKey } from '../getSessionKey';
import { getUserAgentString } from '../getUserAgentString';
import { log } from '../log';
import { trackActivity } from '../tractActivity';
import { tryToExtractRole } from '../tryToExtractRole';
import alksNode from 'alks-node';
import opn from 'opn';

export async function handleAlksSessionsConsole(program: commander.Command) {
  const options = program.opts();
  let alksAccount = options.account;
  let alksRole = options.role;
  const forceNewSession = options.newSession;
  const useDefaultAcct = options.default;
  const filterFaves = options.favorites || false;
  const logger = 'sessions-console';

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log(program, logger, 'trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (useDefaultAcct) {
      try {
        const dev = await getDeveloper();

        alksAccount = dev.alksAccount;
        alksRole = dev.alksRole;
      } catch (err) {
        return errorAndExit('Unable to load default account!', err);
      }
    }

    let key: Key;
    try {
      if (isUndefined(options.iam)) {
        key = await getSessionKey(
          program,
          logger,
          alksAccount,
          alksRole,
          false,
          forceNewSession,
          filterFaves
        );
      } else {
        key = await getIamKey(
          program,
          logger,
          alksAccount,
          alksRole,
          forceNewSession,
          filterFaves
        );
      }
    } catch (err) {
      return errorAndExit(err);
    }

    log(program, logger, 'calling aws to generate 15min console URL');

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
      try {
        await opn(url, opts);
      } catch (err) {
        console.error(`Failed to open ${url}`);
        console.error('Please open the url in the browser of your choice');
      }

      log(program, logger, 'checking for updates');
      await checkForUpdate();
      await trackActivity(logger);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // needed for if browser is still open
      process.exit(0);
    }
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
