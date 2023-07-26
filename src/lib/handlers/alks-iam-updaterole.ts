import clc from 'cli-color';
import commander from 'commander';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { unpackTags } from '../unpackTags';
import { extractAccountAndRole } from '../extractAccountAndRole';

export async function handleAlksIamUpdateRole(options: commander.OptionValues) {
  const roleName: string | undefined = options.rolename;
  if (!roleName) {
    errorAndExit('Must provide a valid role name');
  }

  let trustPolicy: Record<string, object> | undefined;
  try {
    trustPolicy = options.trustPolicy
      ? JSON.parse(options.trustPolicy)
      : undefined;
  } catch {
    errorAndExit('Error parsing trust policy. Must be valid JSON string');
  }

  const tags = options.tags ? unpackTags(options.tags) : undefined;

  const { awsAccount, role } = await extractAccountAndRole(options);

  try {
    const auth = await getAuth();

    log('calling api to update role: ' + roleName);

    const alks = await getAlks({
      ...auth,
    });

    await alks.updateRole({
      account: awsAccount.id,
      role,
      roleName,
      trustPolicy,
      tags,
    });

    console.log(clc.white(`The role "${roleName}" was updated successfully`));
    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
