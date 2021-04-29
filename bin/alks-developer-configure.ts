#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import inquirer from 'inquirer';
import _ from 'underscore';
import config from '../package.json';
import { checkForUpdate } from '../lib/checkForUpdate';
import {
  errorAndExit,
  getOutputValues,
  getStdErrPrompt,
  isURL,
  log,
} from '../lib/utils';
import {
  Auth,
  Developer,
  getAlksAccount,
  getAuth,
  getDeveloper,
  getPasswordFromKeystore,
  getPasswordFromPrompt,
  saveDeveloper,
  trackActivity,
} from '../lib/developer';

program
  .version(config.version)
  .description('configures developer')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

const logger = 'dev-config';

async function getPrompt(
  field: string,
  defaultValue: string | undefined,
  text: string,
  validator: ((str: string) => boolean | string) | null
): Promise<string> {
  const answers = await getStdErrPrompt()([
    {
      type: 'input',
      name: field,
      message: text,
      default: () => {
        return defaultValue;
      },
      validate: validator
        ? validator
        : (val) => {
            return !_.isEmpty(val)
              ? true
              : 'Please enter a value for ' + text + '.';
          },
    },
  ]);
  return answers[field];
}

(async function () {
  try {
    log(program, logger, 'getting developer');
    let previousDeveloper: Developer | undefined;
    try {
      previousDeveloper = await getDeveloper();
    } catch (e) {
      // it's ok if no developer exists since we're configuring it now
    }

    const server = await getPrompt(
      'server',
      previousDeveloper?.server,
      'ALKS server',
      isURL
    );

    const userid = await getPrompt(
      'userid',
      previousDeveloper?.userid,
      'Network Username',
      null
    );

    log(program, logger, 'getting existing password');
    let password = await getPasswordFromKeystore();

    log(program, logger, 'getting password');
    password = await getPasswordFromPrompt('Network Password', password);

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'savePassword',
        message: 'Save password',
      },
    ]);
    const savePassword = answers.savePassword;
    if (savePassword) {
      await savePassword(password);
    }

    // Get existing auth so we don't erase any tokens that might exist
    let auth: Auth;
    try {
      log(program, logger, 'getting existing auth');
      auth = await getAuth(program, false);
    } catch (e) {
      // it's ok if no auth exists since we're configuring it now
      auth = {} as Auth;
    }

    // Cache password in program object for faster lookup
    program.auth = {
      userid,
      password,
      ...auth,
    };

    log(program, logger, 'Getting ALKS accounts');
    const prompt = 'Please select your default ALKS account/role';

    const opts = {
      prompt,
      server,
      userid,
    };

    const { alksAccount, alksRole } = await getAlksAccount(program, opts);

    log(program, logger, 'Getting output formats');

    const promptData = {
      type: 'list',
      name: 'outputFormat',
      default: previousDeveloper?.outputFormat,
      message: 'Please select your default output format',
      choices: getOutputValues(),
      pageSize: 10,
    };

    const answers2 = await getStdErrPrompt()([promptData]);
    const outputFormat = answers2.outputFormat as string;

    const newDeveloper = {
      server,
      userid,
      alksAccount,
      alksRole,
      outputFormat,
    };

    // create developer
    log(program, logger, 'saving developer');
    try {
      await saveDeveloper(newDeveloper);
    } catch (e2) {
      if (e2) {
        log(program, logger, 'error saving! ' + e2.message);
        console.error(
          clc.red.bold(
            'There was an error updating your developer configuration.'
          )
        );
      } else {
        console.error(
          clc.white('Your developer configuration has been updated.')
        );
      }
    }

    log(program, logger, 'checking for update');
    await checkForUpdate();
    await trackActivity(logger);
  } catch (err) {
    return errorAndExit('Error configuring developer: ' + err.message);
  }
})().catch((err) => errorAndExit(err.message, err));
