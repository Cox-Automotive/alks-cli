import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksIamCreateLtk(options: commander.OptionValues) {
  const nameDesc = 'alphanumeric including @+=._-';
  const NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
  const iamUsername = options.iamusername;
  let alksAccount: string | undefined = options.account;
  let alksRole: string | undefined = options.role;
  const filterFaves = options.favorites || false;
  const output = options.output || 'text';

  log('validating iam user name: ' + iamUsername);
  if (isEmpty(iamUsername)) {
    errorAndExit('Please provide a username (-n)');
  } else if (!NAME_REGEX.test(iamUsername)) {
    errorAndExit(
      'The username provided contains illegal characters. It must be ' +
        nameDesc
    );
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

    log('calling api to create ltk: ' + iamUsername);

    if (!alksAccount || !alksRole) {
      throw new Error('Must specifify ALKS Account and Role');
    }
    const ltk = await alks.createAccessKeys({
      account: alksAccount,
      role: alksRole,
      iamUserName: iamUsername,
    });

    if (output === 'json') {
      const ltkData = {
        accessKey: ltk.accessKey,
        secretKey: ltk.secretKey,
        iamUserName: iamUsername,
        iamUserArn: ltk.iamUserArn,
      };
      console.log(JSON.stringify(ltkData, null, 4));
    } else {
      const ltkData = {
        accessKey: ltk.accessKey,
        secretKey: ltk.secretKey,
        iamUserName: iamUsername,
        iamUserArn: ltk.iamUserArn,
        alksAccount,
        alksRole,
      };
      console.log(
        clc.white(
          [
            'LTK created for IAM User: ',
            iamUsername,
            ' was created with the ARN: ',
          ].join('')
        ) + clc.white.underline(ltkData.iamUserArn)
      );
      console.log(
        clc.white(['LTK Access Key: '].join('')) +
          clc.white.underline(ltkData.accessKey)
      );
      console.log(
        clc.white(['LTK Secret Key: '].join('')) +
          clc.white.underline(ltkData.secretKey)
      );
    }

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
