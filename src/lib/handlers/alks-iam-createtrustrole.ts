import ALKS from 'alks.js';
import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { tryToExtractRole } from '../tryToExtractRole';
import { unpackTags } from '../unpackTags';
import { getAwsAccountFromString } from '../getAwsAccountFromString';
import { badAccountMessage } from '../badAccountMessage';

export async function handleAlksIamCreateTrustRole(
  options: commander.OptionValues
) {
  const roleNameDesc = 'alphanumeric including @+=._-';
  const trustArnDesc = 'arn:aws|aws-us-gov:iam::d{12}:role/TestRole';
  const ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
  const TRUST_ARN_REGEX =
    /arn:(aws|aws-us-gov):iam::\d{12}:role\/?[a-zA-Z_0-9+=,.@-_/]+/g;
  const roleName = options.rolename;
  const roleType = options.roletype;
  const trustArn = options.trustarn;
  const enableAlksAccess = options.enableAlksAccess;
  let alksAccount = options.account as string | undefined;
  let alksRole = options.role as string | undefined;
  const tags = options.tags ? unpackTags(options.tags) : undefined;
  const filterFavorites = options.favorites || false;

  log('validating role name: ' + roleName);
  if (isEmpty(roleName) || !ROLE_NAME_REGEX.test(roleName)) {
    errorAndExit(
      'The role name provided contains illegal characters. It must be ' +
        roleNameDesc
    );
  }

  log('validating role type: ' + roleType);
  if (
    isEmpty(roleType) ||
    (roleType !== 'Cross Account' && roleType !== 'Inner Account')
  ) {
    errorAndExit('The role type is required');
  }

  log('validating trust arn: ' + trustArn);
  if (isEmpty(trustArn) || !TRUST_ARN_REGEX.test(trustArn)) {
    errorAndExit(
      'The trust arn provided contains illegal characters. It must be ' +
        trustArnDesc
    );
  }

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log('trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (!alksAccount || !alksRole) {
      log('getting accounts');
      ({ alksAccount, alksRole } = await promptForAlksAccountAndRole({
        iamOnly: true,
        filterFavorites,
      }));
    } else {
      log('using provided account/role');
    }

    const auth = await getAuth();

    const awsAccount = await getAwsAccountFromString(alksAccount);
    if (!awsAccount) {
      throw new Error(badAccountMessage);
    }

    log('calling api to create trust role: ' + roleName);

    const alks = await getAlks({
      ...auth,
    });

    let role;
    try {
      role = await alks.createNonServiceRole({
        account: awsAccount.id,
        role: alksRole,
        roleName,
        roleType,
        trustArn,
        enableAlksAccess,
        includeDefaultPolicy: ALKS.PseudoBoolean.False,
        tags,
      });
    } catch (err) {
      errorAndExit(err as Error);
    }

    console.log(
      clc.white(
        ['The role: ', roleName, ' was created with the ARN: '].join('')
      ) + clc.white.underline(role.roleArn)
    );
    if (role.instanceProfileArn) {
      console.log(
        clc.white(
          ['An instance profile was also created with the ARN: '].join('')
        ) + clc.white.underline(role.instanceProfileArn)
      );
    }
    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
