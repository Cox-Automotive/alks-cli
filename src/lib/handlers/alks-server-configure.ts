import clc from 'cli-color';
import commander from 'commander';
import { isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getIamKey } from '../getIamKey';
import { getSessionKey } from '../getSessionKey';
import { log } from '../log';
import { saveMetadata } from '../saveMetadata';
import { trackActivity } from '../trackActivity';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksServerConfigure(
  options: commander.OptionValues,
  program: commander.Command
) {
  const alksAccount = options.account;
  let alksRole = options.role;
  const forceNewSession = options.newSession;
  const filterFaves = options.favorites || false;

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log('trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    let key;
    try {
      if (isUndefined(options.iam)) {
        key = await getSessionKey(
          program,
          alksAccount,
          alksRole,
          false,
          forceNewSession,
          filterFaves
        );
      } else {
        key = await getIamKey(
          program,
          alksAccount,
          alksRole,
          forceNewSession,
          filterFaves
        );
      }
    } catch (err) {
      return errorAndExit(err);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await saveMetadata({
        alksAccount: key.alksAccount,
        alksRole: key.alksRole,
        isIam: key.isIAM,
      });
    } catch (err) {
      return errorAndExit('Unable to save metadata!', err);
    }

    console.error(clc.white('Metadata has been saved!'));

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
