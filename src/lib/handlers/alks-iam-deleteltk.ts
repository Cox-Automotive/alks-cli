import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { trackActivity } from '../trackActivity';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksIamDeleteLtk(options: commander.OptionValues) {
  const iamUsername = options.iamusername;
  let alksAccount = options.account;
  let alksRole = options.role;
  const filterFaves = options.favorites || false;

  log('validating iam user name: ' + iamUsername);
  if (isEmpty(iamUsername)) {
    errorAndExit('The IAM username is required.');
  }

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log('trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (isEmpty(alksAccount) || isEmpty(alksRole)) {
      ({ alksAccount, alksRole } = await promptForAlksAccountAndRole({
        iamOnly: true,
        filterFavorites: filterFaves,
      }));
    }

    const auth = await getAuth();

    const alks = await getAlks({
      ...auth,
    });

    log('calling api to delete ltk: ' + iamUsername);

    try {
      await alks.deleteIAMUser({
        account: alksAccount,
        role: alksRole,
        iamUserName: iamUsername,
      });
    } catch (err) {
      errorAndExit(err);
    }

    console.log(
      clc.white(['LTK deleted for IAM User: ', iamUsername].join(''))
    );

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
