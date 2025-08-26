import clc from 'cli-color';
import commander from 'commander';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { getAwsAccountFromString } from '../getAwsAccountFromString';
import { promptForAlksAccountAndRole } from '../promptForAlksAccountAndRole';

export async function handleAlksCr(options: commander.OptionValues) {
  let alksAccount: string | undefined = options.account;
  let alksRole: string | undefined = options.role;
  const crNumber = options.cr;
  const sessionTime = options.sessionTime || 1;
  const filterFaves = options.favorites || false;

  try {
    if (!crNumber) {
      errorAndExit(
        'Please provide a Change Request number using --cr <crNumber>'
      );
      return;
    }

    if (!alksAccount || !alksRole) {
      ({ alksAccount, alksRole } = await promptForAlksAccountAndRole({
        iamOnly: true,
        filterFavorites: filterFaves,
      }));
    }

    const auth = await getAuth();
    const alks = await getAlks({ ...auth });
    const awsAccount = await getAwsAccountFromString(alksAccount);
    if (!awsAccount) {
      errorAndExit('Invalid or unknown AWS account.');
      return;
    }

    // Prepare params for getIAMKeys
    const params: any = {
      account: awsAccount.id,
      role: alksRole,
      sessionTime,
      changeRequestNumber: crNumber,
    };
    if (options.workloadId) {
      params.workloadId = options.workloadId;
    }

    const result = await alks.getIAMKeys(params);

    console.log(clc.green('CR operation result:'));
    console.log(result);
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
