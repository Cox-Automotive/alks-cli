#!/usr/bin/env node
'use strict';

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
  data: any,
  text: string,
  validator: ((str: string) => boolean | string) | null
) {
  const answers = await utils.getStdErrPrompt()([
    {
      type: 'input',
      name: field,
      message: text,
      default: () => {
        return data[field];
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
    const previousData = await Developer.getDeveloper();

    const server = await getPrompt(
      'server',
      previousData,
      'ALKS server',
      utils.isURL
    );

    const userid = await getPrompt(
      'userid',
      previousData,
      'Network Username',
      null
    );

    utils.log(program, logger, 'getting existing auth');
    const auth = await Developer.getAuth(program);

    utils.log(program, logger, 'getting existing password');
    auth.password = await Developer.getPasswordFromKeystore();

    utils.log(program, logger, 'getting password');
    auth.password = await Developer.getPasswordFromPrompt(
      'Network Password',
      auth.password
    );

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'savePassword',
        message: 'Save password',
      },
    ]);
    const savePassword = answers.savePassword;

    utils.log(program, logger, 'Getting ALKS accounts');
    const prompt = 'Please select your default ALKS account/role';

    program.auth = auth; // this ensures getALKSAccount() doesnt prompt..
    const opts = {
      prompt,
      dontDefault: true,
      server,
      userid,
    };

    let data;
    try {
      data = await Developer.getALKSAccount(program, opts);
    } catch (e) {
      if (e.message.indexOf('No accounts') === -1) {
        throw e;
      }
    }
    const { alksAccount = '', alksRole = '' } = data as {
      alksAccount: string;
      alksRole: string;
    };

    utils.log(program, logger, 'Getting output formats');

    const promptData = {
      type: 'list',
      name: 'outputFormat',
      default: previousData.outputFormat,
      message: 'Please select your default output format',
      choices: utils.getOutputValues(),
      pageSize: 10,
    };

    const answers2 = await utils.getStdErrPrompt()([promptData]);
    const outputFormat = answers2.outputFormat;

    const developerPayload = {
      server,
      userid,
      password: auth.password,
      savePassword,
      alksAccount,
      alksRole,
      outputFormat,
    };

    // create developer
    utils.log(program, logger, 'saving developer');
    try {
      await Developer.saveDeveloper(developerPayload);
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
