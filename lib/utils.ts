/*jslint node: true */
'use strict';

import { isEmpty, times, map, includes } from 'underscore';
import { filter } from 'fuzzy';
import { red, white, yellow } from 'cli-color';
import Table from 'cli-table3';
import { join } from 'path';
import { EOL } from 'os';
import { existsSync, appendFileSync } from 'fs';
import chmod from 'chmod';
import { createPromptModule } from 'inquirer';
import { version } from '../package.json';
import commander from 'commander';

let programCacher: commander.Command | undefined;
const accountRegex = /([0-9]*)(\/)(ALKS)([a-zA-Z]*)([- ]*)([a-zA-Z0-9_-]*)/g;

export function errorAndExit(errorMsg: string, errorObj?: Error) {
  console.error(red(errorMsg));
  if (errorObj) {
    console.error(red(JSON.stringify(errorObj, null, 4)));
  }
  process.exit(1);
}

export function deprecationWarning(msg: string) {
  msg = `\nWarning: ${
    isEmpty(msg) ? 'This command is being deprecated.' : msg
  }`;
  console.error(red.bold(msg));
}

export function getDBFile() {
  const path = process.env.ALKS_DB || getFilePathInHome('alks.db');

  // if we have a db, chmod it
  if (existsSync(path)) {
    chmod(path, getOwnerRWOnlyPermission());
  }

  return path;
}

export function isWindows() {
  const platform = process.env.PLATFORM || process.platform;
  return /^win/.test(platform);
}

export function isOSX() {
  return 'darwin' === process.platform;
}

export function getFilePathInHome(filename: string) {
  return join(
    process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH || '',
    filename
  );
}

export function getOutputValues() {
  // if adding new output types be sure to update keys.js:getKeyOutput
  return [
    'env',
    'json',
    'docker',
    'creds',
    'idea',
    'export',
    'set',
    'powershell',
    'fishshell',
    'terraformenv',
    'terraformarg',
    'aws',
  ];
}

export function trim(str: string) {
  if (isEmpty(str)) {
    return str;
  }
  return String(str).trim();
}

export function obfuscate(str: string) {
  if (isEmpty(str)) {
    return '';
  }

  const s1 = Math.floor(str.length * 0.3);
  const obfuscated = [str.substring(0, s1)];

  times(str.length - s1, () => {
    obfuscated.push('*');
  });

  return obfuscated.join('');
}

export function addNewLineToEOF(file: string) {
  try {
    appendFileSync(file, EOL);
  } catch (err) {
    errorAndExit('Error adding new line!', err);
  }
}

export function showBorderedMessage(cols: number, msg: string) {
  const table = new Table({
    colWidths: [cols],
  });

  table.push([msg]);
  console.error(table.toString());
}

export function subcommandSuggestion(
  program: commander.Command,
  subCommand: string
) {
  const commands = map(program.commands, '_name');

  if (program.args.length && !includes(commands, subCommand)) {
    const prefix = `alks ${subCommand}`;
    const msg = [prefix, subCommand, ' is not a valid ALKS command.'];
    const suggests = filter(subCommand, commands);
    const suggest = suggests.map((sug) => sug.string);

    if (suggest.length) {
      msg.push(white(' Did you mean '));
      msg.push(white.underline(prefix + suggest[0]));
      msg.push(white('?'));
    }

    errorAndExit(msg.join(''));
  }
}

export function isPasswordSecurelyStorable() {
  return isOSX() || isWindows();
}

export function passwordSaveErrorHandler(err: Error) {
  console.error(red('Error saving password!'), err.message);

  if (isWindows()) {
    console.error(
      red(
        'It looks like you\'re on Windows. This is most likely a script permission error. Please run: "Set-ExecutionPolicy -Scope CurrentUser remotesigned", press "Y" and try again.'
      )
    );
  }
}

export function isURL(url: string) {
  const pattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

  return pattern.test(url) || 'Please enter a valid URL.';
}

export function log(
  program: commander.Command | null,
  section: string,
  msg: string
) {
  if (program && !programCacher) programCacher = program; // so hacky!

  if (programCacher && programCacher.verbose) {
    console.error(yellow(['[', section, ']: ', msg].join('')));
  }
}

export function getOwnerRWOnlyPermission() {
  return {
    owner: { read: true, write: true, execute: false },
    group: { read: false, write: false, execute: false },
    others: { read: false, write: false, execute: false },
  };
}

export function getBadAccountMessage() {
  return 'Unable to generate session, please validate your account and role.\nYour account should look like "123456789/ALKSPowerUser - awsfoonp" and your role should look like "PowerUser".\nBe sure to wrap them in quotes.';
}

export function getAccountRegex() {
  return accountRegex;
}

export function tryToExtractRole(account: string): string | undefined {
  let match;
  while ((match = accountRegex.exec(account))) {
    if (match && account.indexOf('ALKS_') === -1) {
      // ignore legacy accounts
      return match[4];
    }
  }
  return undefined;
}

export function getUA() {
  return `alks-cli/${version}`;
}

export function getStdErrPrompt() {
  return createPromptModule({ output: process.stderr });
}
