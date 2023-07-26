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
import { parseKeyValuePairs } from '../parseKeyValuePairs';
import { unpackTags } from '../unpackTags';
import { getAwsAccountFromString } from '../getAwsAccountFromString';
import { badAccountMessage } from '../badAccountMessage';

export async function handleAlksIamCreateRole(options: commander.OptionValues) {
  const roleNameDesc = 'alphanumeric including @+=._-';
  const ROLE_NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
  const roleName: string | undefined = options.rolename;
  const roleType = options.roletype ? (options.roletype as string) : undefined;
  let trustPolicy;
  try {
    trustPolicy = options.trustPolicy
      ? JSON.parse(options.trustPolicy)
      : undefined;
  } catch {
    errorAndExit('Error parsing trust policy.  Must be valid JSON string');
  }

  const incDefPolicies = options.defaultPolicies;
  const enableAlksAccess = options.enableAlksAccess;
  let alksAccount = options.account;
  let alksRole = options.role;
  const filterFavorites = options.favorites || false;
  const tags = options.tags ? unpackTags(options.tags) : undefined;
  const templateFields = options.templateFields
    ? parseKeyValuePairs(options.templateFields)
    : undefined;

  log('validating role name: ' + roleName);
  if (!roleName || !ROLE_NAME_REGEX.test(roleName)) {
    errorAndExit(
      'The role name provided contains illegal characters. It must be ' +
        roleNameDesc
    );
  }

  log('validating role type or trust policy');
  const roleTypeExists = isEmpty(roleType);
  const trustPolicyExists = isEmpty(trustPolicy);
  if (roleTypeExists === trustPolicyExists) {
    errorAndExit('Must provide role type or trust policy but not both.');
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

    log('calling api to create role: ' + roleName);

    const alks = await getAlks({
      ...auth,
    });

    let role;
    try {
      role = await alks.createRole({
        account: awsAccount.id,
        role: alksRole,
        roleName,
        roleType,
        trustPolicy,
        includeDefaultPolicy: incDefPolicies ? 1 : 0,
        enableAlksAccess,
        tags,
        templateFields,
      });
    } catch (err) {
      errorAndExit(err as Error);
    }

    console.log(
      clc.white(`The role "${roleName}" was created with the ARN: `) +
        clc.white.underline(role.roleArn)
    );
    if (role.instanceProfileArn) {
      console.log(
        clc.white('An instance profile was also created with the ARN: ') +
          clc.white.underline(role.instanceProfileArn)
      );
    }
    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
