import ALKS from 'alks.js';
import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAlksAccount } from '../getAlksAccount';
import { getAuth } from '../getAuth';
import { getDeveloper } from '../getDeveloper';
import { log } from '../log';
import { trackActivity } from '../tractActivity';
import { tryToExtractRole } from '../tryToExtractRole';

export async function handleAlksIamCreateTrustRole(
  options: commander.OptionValues,
  program: commander.Command
) {
  const logger = 'iam-createtrustrole';
  const roleNameDesc = 'alphanumeric including @+=._-';
  const trustArnDesc = 'arn:aws|aws-us-gov:iam::d{12}:role/TestRole';
  const ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
  const TRUST_ARN_REGEX = /arn:(aws|aws-us-gov):iam::\d{12}:role\/?[a-zA-Z_0-9+=,.@-_/]+/g;
  const roleName = options.rolename;
  const roleType = options.roletype;
  const trustArn = options.trustarn;
  const enableAlksAccess = options.enableAlksAccess;
  let alksAccount = options.account;
  let alksRole = options.role;
  const filterFavorites = options.favorites || false;

  log(program, logger, 'validating role name: ' + roleName);
  if (isEmpty(roleName) || !ROLE_NAME_REGEX.test(roleName)) {
    errorAndExit(
      'The role name provided contains illegal characters. It must be ' +
        roleNameDesc
    );
  }

  log(program, logger, 'validating role type: ' + roleType);
  if (
    isEmpty(roleType) ||
    (roleType !== 'Cross Account' && roleType !== 'Inner Account')
  ) {
    errorAndExit('The role type is required');
  }

  log(program, logger, 'validating trust arn: ' + trustArn);
  if (isEmpty(trustArn) || !TRUST_ARN_REGEX.test(trustArn)) {
    errorAndExit(
      'The trust arn provided contains illegal characters. It must be ' +
        trustArnDesc
    );
  }

  if (!isUndefined(alksAccount) && isUndefined(alksRole)) {
    log(program, logger, 'trying to extract role from account');
    alksRole = tryToExtractRole(alksAccount);
  }

  try {
    if (isEmpty(alksAccount) || isEmpty(alksRole)) {
      log(program, logger, 'getting accounts');
      ({ alksAccount, alksRole } = await getAlksAccount(program, {
        iamOnly: true,
        filterFavorites,
      }));
    } else {
      log(program, logger, 'using provided account/role');
    }

    const developer = await getDeveloper();

    const auth = await getAuth(program);

    log(program, logger, 'calling api to create trust role: ' + roleName);

    const alks = await getAlks({
      baseUrl: developer.server,
      ...auth,
    });

    let role;
    try {
      role = await alks.createNonServiceRole({
        account: alksAccount,
        role: alksRole,
        roleName,
        roleType,
        trustArn,
        enableAlksAccess,
        includeDefaultPolicy: ALKS.PseudoBoolean.False,
      });
    } catch (err) {
      return errorAndExit(err);
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
    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
