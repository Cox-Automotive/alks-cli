import commander from 'commander';
import { isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getDeveloper } from '../getDeveloper';
import { getIamKey } from '../getIamKey';
import { getKeyOutput } from '../getKeyOutput';
import { getSessionKey } from '../getSessionKey';
import { log } from '../log';
import { trackActivity } from '../tractActivity';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksSessionsOpen(
  options: commander.OptionValues,
  program: commander.Command
) {
  let alksAccount = options.account;
  let alksRole = options.role;
  const forceNewSession = options.newSession;
  const useDefaultAcct = options.default;
  const output = options.output;
  const filterFaves = options.favorites || false;
  const logger = 'sessions-open';

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log(program, logger, 'trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    let developer;
    try {
      developer = await getDeveloper();
    } catch (err) {
      return errorAndExit('Unable to load default account!', err);
    }

    if (useDefaultAcct) {
      alksAccount = developer.alksAccount;
      alksRole = developer.alksRole;
    }

    let key;
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

    console.log(
      getKeyOutput(
        output || developer.outputFormat,
        key,
        options.namedProfile,
        options.force
      )
    );

    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
