import clc from 'cli-color';
import commander from 'commander';
import { contains, each } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { log } from '../log';
import { trackActivity } from '../trackActivity';

export async function handleAlksIamRoleTypes(options: commander.OptionValues) {
  const outputVals = ['list', 'json'];
  const output = options.output;

  if (!contains(outputVals, output)) {
    errorAndExit(
      'The output provided (' +
        output +
        ') is not in the allowed values: ' +
        outputVals.join(', ')
    );
  }

  try {
    log('getting auth');
    const auth = await getAuth();

    const alks = await getAlks({
      ...auth,
    });

    log('getting list of role types from REST API');
    let roleTypes;
    try {
      roleTypes = await alks.getAllAWSRoleTypes({});
    } catch (err) {
      errorAndExit(err);
    }

    log(
      'outputting list of ' +
        (roleTypes ? roleTypes.length : -1) +
        ' role types'
    );
    console.error(clc.white.underline.bold('\nAvailable IAM Role Types'));

    if (output === 'list') {
      each(roleTypes, (roleType, i) => {
        console.log(
          clc.white(
            [i < 9 ? ' ' : '', i + 1, ') ', roleType.roleTypeName].join('')
          )
        );
      });
    } else {
      console.log(
        JSON.stringify(roleTypes.map((roleType) => roleType.roleTypeName))
      );
    }

    log('checking for updates');
    await checkForUpdate();
    await trackActivity();
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
