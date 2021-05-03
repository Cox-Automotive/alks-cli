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

export async function handleAlksIamCreateLtk(
  options: commander.OptionValues,
  program: commander.Command
) {
  const logger = 'iam-createltk';
  const nameDesc = 'alphanumeric including @+=._-';
  const NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
  const iamUsername = options.iamusername;
  let alksAccount: string | undefined = options.account;
  let alksRole: string | undefined = options.role;
  const filterFaves = options.favorites || false;
  const output = options.output || 'text';

  log(program, logger, 'validating iam user name: ' + iamUsername);
  if (isEmpty(iamUsername)) {
    errorAndExit('Please provide a username (-n)');
  } else if (!NAME_REGEX.test(iamUsername)) {
    errorAndExit(
      'The username provided contains illegal characters. It must be ' +
        nameDesc
    );
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

    log(program, logger, 'calling api to create ltk: ' + iamUsername);

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

    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
