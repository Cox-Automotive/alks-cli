import clc from 'cli-color';
import commander from 'commander';
import { isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getIamKey } from '../getIamKey';
import { log } from '../log';
import { saveMetadata } from '../saveMetadata';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksServerConfigure(
  options: commander.OptionValues
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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await saveMetadata({
        alksAccount: key.alksAccount,
        alksRole: key.alksRole,
        isIam: key.isIAM,
      });
    } catch (err) {
      errorAndExit('Unable to save metadata!', err as Error);
    }

    console.error(clc.white('Metadata has been saved!'));

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
