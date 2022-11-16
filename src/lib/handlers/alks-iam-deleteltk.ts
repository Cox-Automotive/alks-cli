import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { badAccountMessage } from '../badAccountMessage';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { getAwsAccountFromString } from '../getAwsAccountFromString';
import { log } from '../log';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksIamDeleteLtk(options: commander.OptionValues) {
  const iamUsername = options.iamusername;
  let alksAccount = options.account as string | undefined;
  let alksRole = options.role as string | undefined;
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
    if (!alksAccount || !alksRole) {
      ({ alksAccount, alksRole } = await promptForAlksAccountAndRole({
        iamOnly: true,
        filterFavorites: filterFaves,
      }));
    }

    const auth = await getAuth();

    const alks = await getAlks({
      ...auth,
    });

    const awsAccount = await getAwsAccountFromString(alksAccount);
    if (!awsAccount) {
      throw new Error(badAccountMessage);
    }

    log('calling api to delete ltk: ' + iamUsername);

    try {
      await alks.deleteIAMUser({
        account: awsAccount.id,
        role: alksRole,
        iamUserName: iamUsername,
      });
    } catch (err) {
      errorAndExit(err as Error);
    }

    console.log(
      clc.white(['LTK deleted for IAM User: ', iamUsername].join(''))
    );

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
