import clc from 'cli-color';
import commander from 'commander';
import { contains, each } from 'underscore';
import { checkForUpdate } from '../checkForUpdate';
import { errorAndExit } from '../errorAndExit';
import { getAlks } from '../getAlks';
import { getAuth } from '../getAuth';
import { getDeveloper } from '../getDeveloper';
import { log } from '../log';
import { trackActivity } from '../tractActivity';

export async function handleAlksIamRoleTypes(program: commander.Command) {
  const logger = 'iam-roletypes';
  const outputVals = ['list', 'json'];
  const options = program.opts();
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
    log(program, logger, 'getting developer');
    const developer = await getDeveloper();

    log(program, logger, 'getting auth');
    const auth = await getAuth(program);

    const alks = await getAlks({
      baseUrl: developer.server,
      ...auth,
    });

    log(program, logger, 'getting list of role types from REST API');
    let roleTypes;
    try {
      roleTypes = await alks.getAllAWSRoleTypes({});
    } catch (err) {
      return errorAndExit(err);
    }

    log(
      program,
      logger,
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

    log(program, logger, 'checking for updates');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
