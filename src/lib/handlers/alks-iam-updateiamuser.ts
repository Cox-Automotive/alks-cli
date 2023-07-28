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
import { unpackTags } from '../unpackTags';

export async function handleAlksIamUpdateIamUser(
  options: commander.OptionValues
) {
  const nameDesc = 'alphanumeric including @+=._-';
  const NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
  const iamUsername = options.iamusername;
  const alksAccount = options.account as string | undefined;
  const output = options.output || 'text';
  const tags = options.tags ? unpackTags(options.tags) : undefined;
  console.log(`tags: ${tags?.length}`);
  if (isUndefined(tags)) {
    console.log(`error`);
    errorAndExit(
      'Tags must be provided in update request.  Provide empty list to remove all non-protected tags'
    );
  }

  log('validating iam user name: ' + iamUsername);
  if (isEmpty(iamUsername)) {
    console.log(`empty username`);
    errorAndExit('Please provide a username (-n)');
  } else if (!NAME_REGEX.test(iamUsername)) {
    console.log(`bad username`);
    errorAndExit(
      'The username provided contains illegal characters. It must be ' +
        nameDesc
    );
  }

  try {
    if (isUndefined(alksAccount)) {
      console.log(`undefined alks account`);
      errorAndExit('Must specifify ALKS Account Id');
    }

    const auth = await getAuth();

    const alks = await getAlks({
      ...auth,
    });

    console.log(`about to fetch aws account`);

    const awsAccount = await getAwsAccountFromString(alksAccount);
    if (!awsAccount) {
      console.log(`no aws account found`);

      throw new Error(badAccountMessage);
    }

    log('calling api to update iamUser: ' + iamUsername);
    let iamUser;
    try {
      iamUser = await alks.updateIamUser({
        account: awsAccount.id,
        iamUserName: iamUsername,
        tags,
      });
    } catch (err) {
      errorAndExit(err as Error);
    }

    if (output === 'json') {
      const iamUserData = {
        accessKey: iamUser.accessKey,
        iamUserName: iamUser.userName,
        iamUserArn: iamUser.arn,
        accountId: iamUser.accountId,
        tags: iamUser.tags,
      };
      console.log(JSON.stringify(iamUserData, null, 4));
    } else {
      const iamUserData = {
        accessKey: iamUser.accessKey,
        iamUserName: iamUser.userName,
        iamUserArn: iamUser.arn,
        accountId: iamUser.accountId,
        tags: iamUser.tags,
      };
      console.log(
        clc.white(
          `Iam User with username "${iamUsername}" was updated with tags: `
        ) + clc.white.underline(iamUserData.tags)
      );
    }

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
