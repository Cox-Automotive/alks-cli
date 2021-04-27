#!/usr/bin/env node
'use strict';

process.title = 'ALKS';

import program from 'commander';
import clc from 'cli-color';
import forever from 'forever';
import config from '../package.json';
import * as utils from '../lib/utils';

program
  .version(config.version)
  .description('stops the metadata server')
  .option('-v, --verbose', 'be verbose')
  .parse(process.argv);

if (!utils.isOSX()) {
  console.error(clc.red('The metadata server is only supported on OSX.'));
  process.exit(0);
}

console.error(clc.white('Stopping metadata server..'));

forever.list(false, (_err: Error | null, list: any[] | null) => {
  if (list === null) {
    console.log(clc.white('Metadata server is not running.'));
  } else {
    forever.stopAll();
    console.log(clc.white('Metadata server stopped.'));
  }
});
