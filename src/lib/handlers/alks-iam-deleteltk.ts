import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getIAMAccount } from '../getIamAccount';
import { log } from '../log';
import { trackActivity } from '../tractActivity';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksIamDeleteLtk(program: commander.Command) {
  const logger = 'iam-deleteltk';
  const options = program.opts();
  const iamUsername = options.iamusername;
  let alksAccount = options.account;
  let alksRole = options.role;
  const filterFaves = options.favorites || false;

  log(program, logger, 'validating iam user name: ' + iamUsername);
  if (isEmpty(iamUsername)) {
    errorAndExit('The IAM username is required.');
  }

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log(program, logger, 'trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    let iamAccount;
    try {
      iamAccount = await getIAMAccount(
        program,
        logger,
        alksAccount,
        alksRole,
        filterFaves
      );
    } catch (err) {
      return errorAndExit(err);
    }
    const { developer, auth } = iamAccount;
    ({ account: alksAccount, role: alksRole } = iamAccount);

    const alks = await getAlks({
      baseUrl: developer.server,
      ...auth,
    });

    log(program, logger, 'calling api to delete ltk: ' + iamUsername);

    try {
      await alks.deleteIAMUser({
        account: alksAccount,
        role: alksRole,
        iamUserName: iamUsername,
      });
    } catch (err) {
      return errorAndExit(err);
    }

    console.log(
      clc.white(['LTK deleted for IAM User: ', iamUsername].join(''))
    );

    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
