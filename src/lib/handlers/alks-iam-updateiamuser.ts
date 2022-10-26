import clc from 'cli-color';
import commander from 'commander';
import { isEmpty, isUndefined } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { extractAccountId } from '../extractAccountId';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { unpackTags } from '../unpackTags';

export async function handleAlksIamUpdateIamUser(
  options: commander.OptionValues
) {
  const nameDesc = 'alphanumeric including @+=._-';
  const NAME_REGEX = /^[a-zA-Z0-9!@+=._-]+$/g;
  const iamUsername = options.iamusername;
  const alksAccount = extractAccountId(options.account);
  const output = options.output || 'text';
  const tags = options.tags ? unpackTags(options.tags) : undefined;
  if (isUndefined(tags)) {
    errorAndExit(
      'Tags must be provided in update request.  Provide empty list to remove all non-protected tags'
    );
  }

  log('validating iam user name: ' + iamUsername);
  if (isEmpty(iamUsername)) {
    errorAndExit('Please provide a username (-n)');
  } else if (!NAME_REGEX.test(iamUsername)) {
    errorAndExit(
      'The username provided contains illegal characters. It must be ' +
        nameDesc
    );
  }

  try {
    if (isUndefined(alksAccount)) {
      errorAndExit('Must specifify ALKS Account Id');
    }

    const auth = await getAuth();

    const alks = await getAlks({
      ...auth,
    });

    log('calling api to update iamUser: ' + iamUsername);
    let iamUser;
    try {
      iamUser = await alks.updateIamUser({
        account: alksAccount,
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
          [
            'Iam User with username: ',
            iamUsername,
            ' was updated with tags: ',
          ].join('')
        ) + clc.white.underline(iamUserData.tags)
      );
    }

    await checkForUpdate();
  } catch (err) {
    errorAndExit((err as Error).message, err as Error);
  }
}
