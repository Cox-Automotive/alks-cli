import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getIamKey } from '../getIamKey';
import { getKeyOutput } from '../getKeyOutput';
import { log } from '../log';
import { tryToExtractRole } from '../tryToExtractRole';
import { getAlksAccount } from '../state/alksAccount';
import { getAlksRole } from '../state/alksRole';
import { getOutputFormat } from '../state/outputFormat';

export async function handleAlksSessionsOpen(options: commander.OptionValues) {
  let alksAccount: string | undefined = options.account;
  let alksRole: string | undefined = options.role;

  // Try to guess role from account if only account was provided
  if (alksAccount && !alksRole) {
    log('trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (options.default) {
      alksAccount = await getAlksAccount();
      alksRole = await getAlksRole();
      if (!alksAccount || !alksRole) {
        errorAndExit('Unable to load default account!');
      }
    }

    const key = await getIamKey(
      alksAccount,
      alksRole,
      options.newSession,
      options.favorites,
      !!options.iam
    );

    console.log(
      getKeyOutput(
        options.output || (await getOutputFormat()),
        key,
        options.namedProfile,
        options.force
      )
    );

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
