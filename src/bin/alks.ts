#!/usr/bin/env node

process.title = 'ALKS';

import clc from 'cli-color';
import _ from 'underscore';
import program from 'commander';
import fuzzy from 'fuzzy';
import pkg from '../../package.json';
import { errorAndExit } from '../lib/errorAndExit';

// Do not commit this line
program.command('test', 'this is a test');

program
  .command('sessions', 'manage aws sessions')
  .command('iam', 'manage iam resources')
  .command('developer', 'developer & account commands')
  .command('server', 'ec2 metadata server')
  .version(pkg.version);

if (process.stdout.isTTY) {
  console.error(clc.whiteBright.bold('ALKS v%s'), pkg.version);
}

program.parse(process.argv);

const commands = _.map(program.commands, '_name');
const requestedCommand = _.head(program.args) as string;

if (!program.args.length) {
  program.help();
} else if (!_.includes(commands, requestedCommand)) {
  const msg = [requestedCommand, ' is not a valid ALKS command.'];
  const suggests = fuzzy.filter(requestedCommand, commands);
  const suggest = suggests.map((sug) => sug.string);

  if (suggest.length) {
    msg.push(clc.white(' Did you mean '));
    msg.push(clc.white.underline(suggest[0]));
    msg.push(clc.white('?'));
  }

  errorAndExit(msg.join(''));
}
