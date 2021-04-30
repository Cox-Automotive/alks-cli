import clc from 'cli-color';
import commander from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import { errorAndExit } from '../errorAndExit';
import { isOsx } from '../isOsx';
import forever from 'forever';
import { log } from '../log';
import fs from 'fs';

function runServerDaemon() {
  console.error(clc.white('Starting metadata server..'));

  forever.startDaemon(path.join(__dirname, '../lib') + '/metadata-server.js', {
    uid: 'alks-metadata',
    root: path.join(__dirname, '../'),
  });

  console.error(clc.white('Metadata server now listening on: 169.254.169.254'));
}

export async function handleAlksServerStart(program: commander.Command) {
  try {
    const logger = 'server-start';

    if (!isOsx()) {
      errorAndExit('The metadata server is only supported on OSX.');
    }

    log(
      program,
      logger,
      'Checking if forwarding daemon is already installed..'
    );

    if (!fs.existsSync('/etc/pf.anchors/com.coxautodev.alks')) {
      console.error(
        clc.white(
          'Installing metadata daemon rules. You may be prompted for your system password since this requires escalated privileges.'
        )
      );
      const servicePath = path.join(__dirname, '../service');

      try {
        log(program, logger, 'Adding pf.anchor');
        execSync(
          'sudo cp ' + servicePath + '/com.coxautodev.alks /etc/pf.anchors/'
        );

        log(program, logger, 'Adding launch daemon');
        execSync(
          'sudo cp ' +
            servicePath +
            '/com.coxautodev.alks.Ec2MetaDataFirewall.plist /Library/LaunchDaemons/'
        );

        log(program, logger, 'Loading launch daemon');
        execSync(
          'sudo launchctl load -w /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist'
        );
      } catch (err) {
        console.log(clc.red('Error installing metadata daemon.'), err);
      }
      console.log(clc.white('Successfully installed metadata daemon.'));
      runServerDaemon();
    } else {
      log(program, logger, 'Daemon is already installed..');
      runServerDaemon();
    }
  } catch (err) {
    errorAndExit(err.message, err);
  }
}
