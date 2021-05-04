import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getDeveloper } from '../getDeveloper';
import { getIamKey } from '../getIamKey';
import { getKeyOutput } from '../getKeyOutput';
import { getSessionKey } from '../getSessionKey';
import { log } from '../log';
import { trackActivity } from '../trackActivity';
import { tryToExtractRole } from '../tryToExtractRole';
import { Key } from '../../model/keys';
import { Developer } from '../../model/developer';

export async function handleAlksSessionsOpen(
  options: commander.OptionValues,
  program: commander.Command
) {
  let alksAccount: string | undefined = options.account;
  let alksRole: string | undefined = options.role;
  const logger = 'sessions-open';

  // Try to guess role from account if only account was provided
  if (alksAccount && !alksRole) {
    log(program, logger, 'trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    let developer: Developer;
    try {
      developer = await getDeveloper();
    } catch (err) {
      return errorAndExit('Unable to load default account!', err);
    }

    if (options.default) {
      alksAccount = developer.alksAccount;
      alksRole = developer.alksRole;
    }

    let key: Key;
    if (options.iam) {
      key = await getIamKey(
        program,
        logger,
        alksAccount,
        alksRole,
        options.newSession,
        options.favorites
      );
    } else {
      key = await getSessionKey(
        program,
        logger,
        alksAccount,
        alksRole,
        false,
        options.newSession,
        options.favorites
      );
    }

    console.log(
      getKeyOutput(
        options.output || developer.outputFormat,
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
