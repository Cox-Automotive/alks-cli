#!/usr/bin/env node

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import inquirer from 'inquirer';
import _ from 'underscore';
import config from '../package.json';
import * as utils from '../lib/utils';
import * as Developer from '../lib/developer';
import { checkForUpdate } from '../lib/checkForUpdate';

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
  const answers = await utils.getStdErrPrompt()([
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
    utils.log(program, logger, 'getting developer');
    let previousDeveloper: Developer.Developer | undefined;
    try {
      previousDeveloper = await Developer.getDeveloper();
    } catch (e) {
      // it's ok if no developer exists since we're configuring it now
    }

    const server = await getPrompt(
      'server',
      previousDeveloper?.server,
      'ALKS server',
      utils.isURL
    );

    const userid = await getPrompt(
      'userid',
      previousDeveloper?.userid,
      'Network Username',
      null
    );

    utils.log(program, logger, 'getting existing password');
    let password = await Developer.getPasswordFromKeystore();

    utils.log(program, logger, 'getting password');
    password = await Developer.getPasswordFromPrompt(
      'Network Password',
      password
    );

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'savePassword',
        message: 'Save password',
      },
    ]);
    const savePassword = answers.savePassword;
    if (savePassword) {
      await Developer.savePassword(password);
    }

    // Get existing auth so we don't erase any tokens that might exist
    let auth: Developer.Auth;
    try {
      utils.log(program, logger, 'getting existing auth');
      auth = await Developer.getAuth(program, false);
    } catch (e) {
      // it's ok if no auth exists since we're configuring it now
      auth = {} as Developer.Auth;
    }

    // Cache password in program object for faster lookup
    program.auth = {
      userid,
      password,
      ...auth,
    };

    utils.log(program, logger, 'Getting ALKS accounts');
    const prompt = 'Please select your default ALKS account/role';

    const opts = {
      prompt,
      server,
      userid,
    };

    const { alksAccount, alksRole } = await Developer.getAlksAccount(
      program,
      opts
    );

    utils.log(program, logger, 'Getting output formats');

    const promptData = {
      type: 'list',
      name: 'outputFormat',
      default: previousDeveloper?.outputFormat,
      message: 'Please select your default output format',
      choices: utils.getOutputValues(),
      pageSize: 10,
    };

    const answers2 = await utils.getStdErrPrompt()([promptData]);
    const outputFormat = answers2.outputFormat as string;

    const newDeveloper = {
      server,
      userid,
      alksAccount,
      alksRole,
      outputFormat,
    };

    // create developer
    utils.log(program, logger, 'saving developer');
    try {
      await Developer.saveDeveloper(newDeveloper);
    } catch (e2) {
      if (e2) {
        utils.log(program, logger, 'error saving! ' + e2.message);
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

    utils.log(program, logger, 'checking for update');
    await checkForUpdate();
    await Developer.trackActivity(logger);
  } catch (err) {
    return utils.errorAndExit('Error configuring developer: ' + err.message);
  }
})().catch((err) => utils.errorAndExit(err.message, err));
